package com.evgo.payment.webhook;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that receives Razorpay webhook events.
 *
 * <p>Exposes a single endpoint:
 * <pre>POST /api/webhooks/razorpay</pre>
 *
 * <p>The raw request body is consumed as a {@code String} so that the exact bytes
 * used by Razorpay to compute the HMAC-SHA256 signature are preserved. Any JSON
 * parsing happens downstream in {@link WebhookService}.
 *
 * <p>Response codes:
 * <ul>
 *   <li>{@code 200 OK} – webhook accepted and processed (or duplicate, silently ignored)</li>
 *   <li>{@code 401 Unauthorized} – HMAC signature verification failed</li>
 *   <li>{@code 500 Internal Server Error} – unexpected processing error</li>
 * </ul>
 *
 * Requirements: 4.1, 4.6
 */
@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookService webhookService;

    /**
     * Handles an incoming Razorpay webhook event.
     *
     * @param payload   raw JSON body sent by Razorpay
     * @param signature value of the {@code X-Razorpay-Signature} header
     * @return {@code 200 OK} on success, {@code 401} on bad signature, {@code 500} on error
     */
    @PostMapping(value = "/razorpay", consumes = "application/json")
    public ResponseEntity<Void> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        try {
            webhookService.processWebhook(payload, signature);
            return ResponseEntity.ok().build();

        } catch (WebhookSignatureException ex) {
            log.warn("Webhook signature verification failed: {}", ex.getMessage());
            return ResponseEntity.status(401).build();

        } catch (Exception ex) {
            log.error("Unexpected error processing Razorpay webhook", ex);
            return ResponseEntity.status(500).build();
        }
    }
}
