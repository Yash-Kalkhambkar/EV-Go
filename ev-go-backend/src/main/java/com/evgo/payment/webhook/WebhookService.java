package com.evgo.payment.webhook;

/**
 * Contract for processing incoming Razorpay webhook events.
 *
 * <p>Implementations must be idempotent: calling {@link #processWebhook} multiple
 * times with the same payload must produce the same result without side-effects.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7
 */
public interface WebhookService {

    /**
     * Verifies the webhook signature and processes the payment event.
     *
     * <p>Processing steps:
     * <ol>
     *   <li>Verify HMAC-SHA256 signature against the webhook secret.</li>
     *   <li>Extract the Razorpay order ID from the payload.</li>
     *   <li>Check Redis for duplicate processing (idempotency).</li>
     *   <li>Find the associated booking and confirm it.</li>
     *   <li>Create a {@link com.evgo.payment.Payment} record.</li>
     *   <li>Store the processed marker in Redis with a 24-hour TTL.</li>
     * </ol>
     *
     * @param payload   raw JSON body of the webhook request
     * @param signature value of the {@code X-Razorpay-Signature} header
     * @throws WebhookSignatureException if the HMAC signature does not match
     */
    void processWebhook(String payload, String signature);
}
