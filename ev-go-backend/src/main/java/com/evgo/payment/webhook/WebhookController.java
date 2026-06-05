package com.evgo.payment.webhook;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Handles incoming Razorpay webhook events.
 *
 * POST /api/webhooks/razorpay
 *   - Reads raw body as String
 *   - Extracts X-Razorpay-Signature header
 *   - Delegates to WebhookService for signature verification and processing
 *   - Returns 200 OK on success, 401 on bad signature, 500 on processing error
 *
 * Requirements: 4.1, 4.6
 */
@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping(value = "/razorpay", consumes = "application/json")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        log.info("Received Razorpay webhook, signaturePresent={}", signature != null);

        try {
            webhookService.processWebhook(payload, signature);
            return ResponseEntity.ok("OK");
        } catch (WebhookSignatureException e) {
            log.warn("Webhook signature verification failed: {}", e.getMessage());
            return ResponseEntity.status(401).body("Signature verification failed");
        } catch (Exception e) {
            log.error("Webhook processing error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Processing error");
        }
    }
}
