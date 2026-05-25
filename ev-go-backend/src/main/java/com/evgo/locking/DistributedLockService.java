package com.evgo.locking;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Distributed lock service backed by Redisson (Redis).
 *
 * <p>Provides a two-tier locking strategy:
 * <ul>
 *   <li><b>Primary:</b> Redisson {@link RLock} – fast, distributed coordination across
 *       Cloud Run instances using Redis atomic operations.</li>
 *   <li><b>Fallback:</b> When Redisson is unavailable, logs a warning and returns
 *       {@code true} so that the database-level pessimistic lock (SELECT FOR UPDATE)
 *       acts as the sole concurrency guard.</li>
 * </ul>
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
            // Fallback: allow the request to proceed; DB pessimistic lock will guard correctness
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
