package com.evgo.locking;

import com.evgo.exception.LockExpiryException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link DistributedLockService}.
 *
 * <p>Tests cover:
 * <ul>
 *   <li>Lock acquisition with TTL (Req 1.1, 1.3)</li>
 *   <li>Lock extension mechanism (Req 1.2)</li>
 *   <li>Lock release (Req 1.1)</li>
 *   <li>Lock expiry detection (Req 1.1)</li>
 *   <li>Redis unavailability fallback to DB-only locking (Req 1.7)</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class DistributedLockServiceTest {

    @Mock
    private RedissonClient redissonClient;

    @Mock
    private RLock rLock;

    @InjectMocks
    private DistributedLockService lockService;

    @BeforeEach
    void setUp() {
        when(redissonClient.getLock(anyString())).thenReturn(rLock);
    }

    // ── Key helper ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("slotLockKey should return 'slot:lock:{slotId}' pattern")
    void slotLockKey_shouldReturnCorrectPattern() {
        assertThat(DistributedLockService.slotLockKey(42L)).isEqualTo("slot:lock:42");
        assertThat(DistributedLockService.slotLockKey(1L)).isEqualTo("slot:lock:1");
        assertThat(DistributedLockService.slotLockKey(Long.MAX_VALUE))
                .isEqualTo("slot:lock:" + Long.MAX_VALUE);
    }

    // ── tryLock ───────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("tryLock")
    class TryLockTests {

        @Test
        @DisplayName("should return true when Redisson lock is acquired successfully")
        void shouldReturnTrue_whenLockAcquired() throws InterruptedException {
            when(rLock.tryLock(anyLong(), anyLong(), eq(TimeUnit.SECONDS))).thenReturn(true);

            boolean result = lockService.tryLock("slot:lock:1", 3, 10);

            assertThat(result).isTrue();
            verify(rLock).tryLock(3L, 10L, TimeUnit.SECONDS);
        }

        @Test
        @DisplayName("should return false when lock is held by another thread")
        void shouldReturnFalse_whenLockHeldByAnother() throws InterruptedException {
            when(rLock.tryLock(anyLong(), anyLong(), eq(TimeUnit.SECONDS))).thenReturn(false);

            boolean result = lockService.tryLock("slot:lock:1", 3, 10);

            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("should return false when thread is interrupted during lock acquisition")
        void shouldReturnFalse_whenInterrupted() throws InterruptedException {
            when(rLock.tryLock(anyLong(), anyLong(), eq(TimeUnit.SECONDS)))
                    .thenThrow(new InterruptedException("test interrupt"));

            boolean result = lockService.tryLock("slot:lock:1", 3, 10);

            assertThat(result).isFalse();
            // Verify interrupted flag is restored
            assertThat(Thread.currentThread().isInterrupted()).isTrue();
            Thread.interrupted(); // clear for subsequent tests
        }

        @Test
        @DisplayName("should return true (fallback) when Redisson throws a non-interruption exception")
        void shouldReturnTrue_whenRedissonUnavailable() throws InterruptedException {
            // Requirements: 1.7 – fallback to DB-only locking when Redis unavailable
            when(rLock.tryLock(anyLong(), anyLong(), eq(TimeUnit.SECONDS)))
                    .thenThrow(new RuntimeException("Redis connection refused"));

            boolean result = lockService.tryLock("slot:lock:1", 3, 10);

            assertThat(result)
                    .as("Fallback: should allow request through when Redis is unavailable")
                    .isTrue();
        }

        @Test
        @DisplayName("should return true (fallback) when RedissonClient throws on getLock")
        void shouldReturnTrue_whenGetLockThrows() {
            // Requirements: 1.7
            when(redissonClient.getLock(anyString()))
                    .thenThrow(new RuntimeException("Redisson not connected"));

            boolean result = lockService.tryLock("slot:lock:99", 3, 10);

            assertThat(result)
                    .as("Fallback: should allow request through when RedissonClient unavailable")
                    .isTrue();
        }
    }

    // ── extendLock ────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("extendLock")
    class ExtendLockTests {

        @Test
        @DisplayName("should return true and call lock() when lock is held by current thread")
        void shouldReturnTrue_whenLockHeldByCurrentThread() {
            // Requirements: 1.2
            when(rLock.isHeldByCurrentThread()).thenReturn(true);

            boolean result = lockService.extendLock("slot:lock:1", 10);

            assertThat(result).isTrue();
            verify(rLock).lock(10L, TimeUnit.SECONDS);
        }

        @Test
        @DisplayName("should return false when lock is NOT held by current thread")
        void shouldReturnFalse_whenLockNotHeld() {
            when(rLock.isHeldByCurrentThread()).thenReturn(false);

            boolean result = lockService.extendLock("slot:lock:1", 10);

            assertThat(result).isFalse();
            verify(rLock, never()).lock(anyLong(), any());
        }

        @Test
        @DisplayName("should return false when Redisson is unavailable during extension")
        void shouldReturnFalse_whenRedissonUnavailableDuringExtend() {
            when(rLock.isHeldByCurrentThread())
                    .thenThrow(new RuntimeException("Redis unreachable"));

            boolean result = lockService.extendLock("slot:lock:1", 10);

            assertThat(result).isFalse();
        }
    }

    // ── releaseLock ───────────────────────────────────────────────────────────

    @Nested
    @DisplayName("releaseLock")
    class ReleaseLockTests {

        @Test
        @DisplayName("should call unlock() when lock is held by current thread")
        void shouldCallUnlock_whenHeldByCurrentThread() {
            // Requirements: 1.1
            when(rLock.isHeldByCurrentThread()).thenReturn(true);

            lockService.releaseLock("slot:lock:1");

            verify(rLock).unlock();
        }

        @Test
        @DisplayName("should NOT call unlock() when lock is not held by current thread")
        void shouldNotCallUnlock_whenNotHeldByCurrentThread() {
            when(rLock.isHeldByCurrentThread()).thenReturn(false);

            lockService.releaseLock("slot:lock:1");

            verify(rLock, never()).unlock();
        }

        @Test
        @DisplayName("should not propagate exception when Redisson is unavailable on release")
        void shouldNotThrow_whenRedissonUnavailableOnRelease() {
            when(rLock.isHeldByCurrentThread())
                    .thenThrow(new RuntimeException("Redis connection lost"));

            // Should not throw – graceful degradation
            lockService.releaseLock("slot:lock:1");
        }
    }

    // ── assertLockHeldByCurrentThread ─────────────────────────────────────────

    @Nested
    @DisplayName("assertLockHeldByCurrentThread")
    class AssertLockHeldTests {

        @Test
        @DisplayName("should not throw when lock is still held by current thread")
        void shouldNotThrow_whenLockHeld() {
            // Requirements: 1.1
            when(rLock.isHeldByCurrentThread()).thenReturn(true);

            lockService.assertLockHeldByCurrentThread("slot:lock:1");
        }

        @Test
        @DisplayName("should throw LockExpiryException when lock has expired")
        void shouldThrowLockExpiryException_whenLockExpired() {
            // Requirements: 1.1 – detect expiry before transaction commits
            when(rLock.isHeldByCurrentThread()).thenReturn(false);

            assertThatThrownBy(() -> lockService.assertLockHeldByCurrentThread("slot:lock:1"))
                    .isInstanceOf(LockExpiryException.class)
                    .hasMessageContaining("slot:lock:1");
        }

        @Test
        @DisplayName("should not throw when Redisson is unavailable (DB fallback active)")
        void shouldNotThrow_whenRedissonUnavailable() {
            // Requirements: 1.7 – when Redis unavailable we trust DB-level locking
            when(rLock.isHeldByCurrentThread())
                    .thenThrow(new RuntimeException("Redis unavailable"));

            // Should not throw – DB fallback handles correctness
            lockService.assertLockHeldByCurrentThread("slot:lock:1");
        }
    }

    // ── isLockHeld ────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("isLockHeld")
    class IsLockHeldTests {

        @Test
        @DisplayName("should return true when the lock is locked by any holder")
        void shouldReturnTrue_whenLocked() {
            when(rLock.isLocked()).thenReturn(true);

            assertThat(lockService.isLockHeld("slot:lock:5")).isTrue();
        }

        @Test
        @DisplayName("should return false when the lock is free")
        void shouldReturnFalse_whenNotLocked() {
            when(rLock.isLocked()).thenReturn(false);

            assertThat(lockService.isLockHeld("slot:lock:5")).isFalse();
        }

        @Test
        @DisplayName("should return false when Redisson is unavailable")
        void shouldReturnFalse_whenRedissonUnavailable() {
            when(rLock.isLocked()).thenThrow(new RuntimeException("Redis down"));

            assertThat(lockService.isLockHeld("slot:lock:5")).isFalse();
        }
    }

    // ── Slot-scoped helpers ───────────────────────────────────────────────────

    @Nested
    @DisplayName("Slot-scoped helper methods")
    class SlotHelperTests {

        @Test
        @DisplayName("tryLockSlot should delegate to tryLock with slot:lock:{id} key")
        void tryLockSlot_shouldDelegateWithCorrectKey() throws InterruptedException {
            when(rLock.tryLock(anyLong(), anyLong(), eq(TimeUnit.SECONDS))).thenReturn(true);

            boolean result = lockService.tryLockSlot(42L);

            assertThat(result).isTrue();
            verify(redissonClient).getLock("slot:lock:42");
        }

        @Test
        @DisplayName("releaseSlotLock should delegate to releaseLock with slot:lock:{id} key")
        void releaseSlotLock_shouldDelegateWithCorrectKey() {
            when(rLock.isHeldByCurrentThread()).thenReturn(true);

            lockService.releaseSlotLock(42L);

            verify(redissonClient).getLock("slot:lock:42");
            verify(rLock).unlock();
        }

        @Test
        @DisplayName("extendSlotLockIfNeeded should delegate to extendLock with slot:lock:{id} key")
        void extendSlotLockIfNeeded_shouldDelegateWithCorrectKey() {
            when(rLock.isHeldByCurrentThread()).thenReturn(true);

            boolean result = lockService.extendSlotLockIfNeeded(42L);

            assertThat(result).isTrue();
            verify(redissonClient).getLock("slot:lock:42");
        }
    }
}
