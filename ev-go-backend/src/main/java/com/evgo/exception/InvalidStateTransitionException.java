package com.evgo.exception;

/**
 * Thrown when an attempt is made to transition an entity (booking or slot)
 * to a state that is not reachable from its current state.
 *
 * Requirements: 11.2, 12.1
 */
public class InvalidStateTransitionException extends RuntimeException {

    private final String errorCode = "INVALID_STATE_TRANSITION";

    public InvalidStateTransitionException(String message) {
        super(message);
    }

    public InvalidStateTransitionException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getErrorCode() {
        return errorCode;
    }
}
