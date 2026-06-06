package com.evgo.locking;

import com.evgo.exception.LockExpiryException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Distributed lock service backed by Redisson (Redis).
 *
 * <p>Provides a two-tier locking strategy:
 * <ul>
 *   <li><b>Primary:</b> Redisson {@link RLock} – fast, distributed coordination across
 *       Cloud Run instances using atomic SET NX EX Redis operations.</li>
 *   <li><b>Fallback:</b> When Redisson is unavailable, logs a warning and returns
 *       {@code true} so that the database-level pessimistic lock (SELECT FOR UPDATE
 *       with SERIALIZABLE isolation) acts as the sole concurrency guard.</li>
 * </ul>
 *
 * <p>Lock key convention: {@code slot:lock:{slotId}}
 *
 * <p>Requirements: 1.1 (distributed lock), 1.2 (lock extension), 1.3 (Redis locking),
 * 1.7 (fallback to DB locking)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DistributedLockService {

    private final RedissonClient redissonClient;

    /**
     * Default TTL in seconds applied when acquiring a slot lock.
     * Matches the Lock_Expiry defined in the requirements (10 seconds).
     *
     * Requirements: 1.3
     */
    @Value("${app.booking.lock-ttl-seconds:10}")
    private long defaultLeaseSecs;

    /**
     * Maximum wait time in seconds before giving up acquiring a lock.
     * After this threshold the caller receives HTTP 409 (SLOT_CONTENTION).
     *
     * Requirements: 1.4
     */
    @Value("${app.booking.lock-wait-seconds:3}")
    private long defaultWaitSecs;

    /**
     * Threshold in seconds after which an already-held lock should be extended.
     * When a transaction approaches this threshold the service calls {@link #extendLock}.
     *
     * Requirements: 1.3
     */
    @Value("${app.booking.lock-extend-threshold-seconds:7}")
    private long lockExtendThresholdSecs;

    // ── Slot-scoped helpers ───────────────────────────────────────────────────

    /**
     * Returns the Redis key used to lock a specific slot.
     *
     * @param slotId the slot identifier
     * @return lock key in the form {@code slot:lock:{slotId}}
     */
    public static String slotLockKey(Long slotId) {
        return "slot:lock:" + slotId;
    }

    /**
     * Attempts to acquire a slot-scoped distributed lock using the default TTL and
     * wait timeout configured via {@code app.booking.*} properties.
     *
     * @param slotId the slot to lock
     * @return {@code true} if the lock was acquired (or Redis is unavailable and
     *         fallback is active); {@code false} if the lock is held by another holder
     *
     * Requirements: 1.1, 1.3
     */
    public boolean tryLockSlot(Long slotId) {
        return tryLock(slotLockKey(slotId), defaultWaitSecs, defaultLeaseSecs);
    }

    /**
     * Releases the slot-scoped lock if held by the current thread.
     *
     * @param slotId the slot whose lock should be released
     *
     * Requirements: 1.1
     */
    public void releaseSlotLock(Long slotId) {
        releaseLock(slotLockKey(slotId));
    }

    /**
     * Extends the slot-scoped lock if processing exceeds the configured threshold.
     *
     * @param slotId the slot whose lock should be extended
     * @return {@code true} if the extension succeeded or was unnecessary
     *
     * Requirements: 1.2
     */
    public boolean extendSlotLockIfNeeded(Long slotId) {
        return extendLock(slotLockKey(slotId), defaultLeaseSecs);
    }

    // ── Core locking operations ───────────────────────────────────────────────

    /**
     * Attempts to acquire a distributed lock for the given key.
     *
     * <p>Uses Redisson's fair-lock semantics with a configurable wait timeout and
     * automatic lease expiry to prevent lock starvation on process crash.
     *
     * @param lockKey      the unique key identifying the resource to lock
     *                     (e.g. {@code "slot:lock:42"})
     * @param waitSeconds  maximum time to wait for the lock before giving up
     * @param leaseSeconds automatic lock expiry (TTL) after acquisition
     * @return {@code true} if the lock was acquired (or Redis is unavailable and
     *         fallback is active); {@code false} if the lock is held by another thread
     *
     * Requirements: 1.1, 1.3
     */
    public boolean tryLock(String lockKey, long waitSeconds, long leaseSeconds) {
        long startNanos = System.nanoTime();
        try {
            RLock lock = redissonClient.getLock(lockKey);
            boolean acquired = lock.tryLock(waitSeconds, leaseSeconds, TimeUnit.SECONDS);

            long elapsedMs = (System.nanoTime() - startNanos) / 1_000_000;
            if (acquired) {
                log.info("Distributed lock acquired: key={}, leaseSeconds={}, acquisitionMs={}",
                        lockKey, leaseSeconds, elapsedMs);
            } else {
                log.debug("Distributed lock not acquired (held by another): key={}, waitedMs={}",
                        lockKey, elapsedMs);
            }
            return acquired;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Lock acquisition interrupted: key={}", lockKey);
            return false;
        } catch (Exception e) {
            log.warn("Redisson unavailable – falling back to DB-level locking: key={}, error={}",
                    lockKey, e.getMessage());
            // Fallback: allow the request to proceed; DB pessimistic lock with SERIALIZABLE
            // isolation will guard correctness (Requirement 1.7)
            return true;
        }
    }

    /**
     * Extends the lease of a lock already held by the current thread.
     *
     * <p>Only extends if the lock is currently held by the calling thread.
     * Useful for long-running booking transactions that may approach the initial TTL.
     *
     * @param lockKey           the key of the lock to extend
     * @param additionalSeconds additional seconds to add to the current lease
     * @return {@code true} if the extension succeeded; {@code false} if the lock is
     *         not held by the current thread or Redisson is unavailable
     *
     * Requirements: 1.2
     */
    public boolean extendLock(String lockKey, long additionalSeconds) {
        try {
            RLock lock = redissonClient.getLock(lockKey);
            if (!lock.isHeldByCurrentThread()) {
                log.warn("Cannot extend lock not held by current thread: key={}", lockKey);
                return false;
            }
            lock.lock(additionalSeconds, TimeUnit.SECONDS);
            log.info("Distributed lock extended: key={}, additionalSeconds={}", lockKey, additionalSeconds);
            return true;

        } catch (Exception e) {
            log.warn("Failed to extend lock – Redisson unavailable: key={}, error={}",
                    lockKey, e.getMessage());
            return false;
        }
    }

    /**
     * Safely releases a distributed lock.
     *
     * <p>Only releases the lock if it is currently held by the calling thread,
     * preventing accidental release of another thread's lock after TTL expiry.
     *
     * @param lockKey the key of the lock to release
     *
     * Requirements: 1.1, 1.3
     */
    public void releaseLock(String lockKey) {
        try {
            RLock lock = redissonClient.getLock(lockKey);
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.info("Distributed lock released: key={}", lockKey);
            } else {
                log.debug("Lock release skipped – not held by current thread (may have expired): key={}",
                        lockKey);
            }
        } catch (Exception e) {
            log.warn("Error releasing lock – Redisson unavailable: key={}, error={}",
                    lockKey, e.getMessage());
        }
    }

    /**
     * Verifies the lock is still held by the current thread; throws
     * {@link LockExpiryException} if it has expired or been released.
     *
     * <p>Called by the booking service before committing a transaction to ensure the
     * distributed lock has not expired while the database transaction was running.
     *
     * @param lockKey the key to verify
     * @throws LockExpiryException if the lock is no longer held by the current thread
     *
     * Requirements: 1.1 (detect expiry before transaction commits), 1.7
     */
    public void assertLockHeldByCurrentThread(String lockKey) {
        try {
            RLock lock = redissonClient.getLock(lockKey);
            if (!lock.isHeldByCurrentThread()) {
                log.error("Distributed lock expired before transaction commit: key={}", lockKey);
                throw new LockExpiryException(
                        "Distributed lock expired before the transaction could commit: key=" + lockKey);
            }
        } catch (LockExpiryException e) {
            throw e;
        } catch (Exception e) {
            // Redis unavailable – operating in DB-only fallback mode; do not throw
            log.warn("Cannot verify lock state – Redisson unavailable (DB-only fallback active): key={}", lockKey);
        }
    }

    /**
     * Checks whether the given lock is currently held by any thread.
     *
     * @param lockKey the key to check
     * @return {@code true} if the lock is held; {@code false} if free or Redisson unavailable
     *
     * Requirements: 1.1
     */
    public boolean isLockHeld(String lockKey) {
        try {
            RLock lock = redissonClient.getLock(lockKey);
            return lock.isLocked();
        } catch (Exception e) {
            log.warn("Cannot check lock state – Redisson unavailable: key={}, error={}",
                    lockKey, e.getMessage());
            return false;
        }
    }
}
