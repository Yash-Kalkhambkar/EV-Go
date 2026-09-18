package com.evgo.payment;

import com.evgo.payment.dto.VerifyPaymentRequest;

/**
 * Contract for payment operations.
 * V1: Covers payment verification only (refunds out of scope).
 */
public interface PaymentService {

    /**
     * Verifies a Razorpay payment with idempotency protection.
     *
     * <p>Validates the HMAC-SHA256 signature, confirms the booking, marks the
     * slot as BOOKED, and persists a {@link Payment} record. Duplicate calls
     * with the same idempotency key are silently ignored.
     *
     * @param request        the Razorpay payment details from the client
     * @param bookingId      the booking to confirm
     * @param idempotencyKey caller-supplied deduplication key; falls back to
     *                       {@code razorpayPaymentId} when {@code null} or blank
     */
    void verifyPayment(VerifyPaymentRequest request, Long bookingId, String idempotencyKey);
}
