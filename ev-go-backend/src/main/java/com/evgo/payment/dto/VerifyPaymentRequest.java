package com.evgo.payment.dto;

/**
 * Request payload for verifying a Razorpay payment after the client-side
 * checkout flow completes.
 *
 * <p>All three fields are required for HMAC-SHA256 signature verification.
 *
 * Requirements: 5.1, 6.2
 */
public record VerifyPaymentRequest(
        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature
) {}
