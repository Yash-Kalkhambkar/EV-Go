package com.evgo.payment.webhook;

/**
 * Thrown when a Razorpay webhook signature verification fails.
 * Requirements: 4.1, 4.6
 */
public class WebhookSignatureException extends RuntimeException {
    public WebhookSignatureException(String message) {
        super(message);
    }
}
