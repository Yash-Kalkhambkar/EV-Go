package com.evgo.payment.webhook;

/**
 * Thrown when the HMAC-SHA256 signature on an incoming Razorpay webhook
 * does not match the expected value computed from the webhook secret.
 *
 * <p>Callers should respond with HTTP 401 when this exception is caught.
 *
 * Requirements: 4.1, 4.6
 */
public class WebhookSignatureException extends RuntimeException {

    public WebhookSignatureException(String message) {
        super(message);
    }

    public WebhookSignatureException(String message, Throwable cause) {
        super(message, cause);
    }
}
