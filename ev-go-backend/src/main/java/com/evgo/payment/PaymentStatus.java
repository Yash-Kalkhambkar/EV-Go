package com.evgo.payment;

/**
 * Lifecycle states for a payment record.
 *
 * Requirements: 5.1, 6.2, 6.6
 */
public enum PaymentStatus {

    /** Razorpay order created; awaiting payment. */
    CREATED,

    /** Payment captured successfully. */
    SUCCESS,

    /** Payment failed or was rejected. */
    FAILED
}
