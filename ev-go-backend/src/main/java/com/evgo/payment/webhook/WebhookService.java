package com.evgo.payment.webhook;

/**
 * Contract for processing incoming payment webhooks.
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
public interface WebhookService {
    /**
     * Verifies the webhook signature and processes the payment event.
     *
     * @param payload   raw JSON body from Razorpay
     * @param signature value of X-Razorpay-Signature header
     * @throws WebhookSignatureException if signature verification fails
     */
    void processWebhook(String payload, String signature);
}
