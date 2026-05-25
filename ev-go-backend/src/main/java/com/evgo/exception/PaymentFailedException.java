package com.evgo.exception;

/**
 * Thrown when a Razorpay payment operation fails — either during order creation,
 * payment verification, or refund initiation.
 *
 * Requirements: 5.1, 6.2
 */
public class PaymentFailedException extends RuntimeException {

    public PaymentFailedException(String message) {
        super(message);
    }

    public PaymentFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}
