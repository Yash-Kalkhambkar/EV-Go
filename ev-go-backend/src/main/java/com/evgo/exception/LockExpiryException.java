package com.evgo.exception;

/**
 * Thrown when a distributed lock has expired before the operation could complete.
 * The caller should treat this as a transient failure and may retry.
 *
 * Requirements: 1.2
 */
public class LockExpiryException extends RuntimeException {

    public LockExpiryException(String message) {
        super(message);
    }

    public LockExpiryException(String message, Throwable cause) {
        super(message, cause);
    }
}
