package com.evgo.exception;

/**
 * Thrown when a slot cannot be booked because it is already reserved, booked,
 * or currently being acquired by another user (lock contention).
 *
 * Requirements: 1.6, 12.1
 */
public class SlotUnavailableException extends RuntimeException {

    private final String errorCode;

    public SlotUnavailableException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public SlotUnavailableException(String message) {
        super(message);
        this.errorCode = "SLOT_UNAVAILABLE";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
