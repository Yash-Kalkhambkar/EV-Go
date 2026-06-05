package com.evgo.payment;

import com.evgo.payment.dto.VerifyPaymentRequest;
import java.math.BigDecimal;

/**
 * Contract for payment operations.
 *
 * <p>Covers the full payment lifecycle: verifying a Razorpay payment after the
 * client-side checkout completes, and issuing full or partial refunds when a
 * booking is cancelled.
 *
 * Requirements: 5.1, 6.1
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
     *
     * Requirements: 5.1–5.7
     */
    void verifyPayment(VerifyPaymentRequest request, Long bookingId, String idempotencyKey);

    /**
     * Issues a partial or full refund via Razorpay.
     *
     * <p>Creates a {@link Refund} record, calls the Razorpay refund API with
     * exponential-backoff retry, and updates the {@link Payment} status
     * accordingly. On exhausted retries the refund is marked {@code FAILED} and
     * an alert is raised.
     *
     * @param bookingId    the booking whose payment should be refunded
     * @param refundAmount the amount to refund; pass {@code null} for a full refund
     * @param reason       human-readable reason for the refund
     *
     * Requirements: 6.1–6.6
     */
    void issueRefund(Long bookingId, BigDecimal refundAmount, String reason);
}
