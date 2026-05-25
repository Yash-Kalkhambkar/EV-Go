package com.evgo.payment.webhook;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Scheduled job that retries webhook processing for orders that could not be
 * matched to a booking on the first attempt.
 *
 * <h2>Retry strategy</h2>
 * <ul>
 *   <li>Runs every 10 seconds ({@code fixedDelay = 10 000 ms}).</li>
 *   <li>Pops up to 10 order IDs from the Redis list {@code webhook:retry}.</li>
 *   <li>Tracks per-order retry count in {@code webhook:retry:count:{orderId}}.</li>
 *   <li>After 5 failed attempts the order is considered exhausted and an error is logged.</li>
 * </ul>
 *
 * <p>The job calls {@link WebhookService#processWebhook} with an empty signature
 * because the signature was already verified on the first attempt. The service
 * will re-fetch the booking from the database on each retry.
 *
 * Requirements: 4.4
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WebhookRetryJob {

    /** Maximum number of retry attempts before giving up. */
    private static final int MAX_RETRY_COUNT = 5;

    /** Maximum items to dequeue per execution cycle. */
    private static final int BATCH_SIZE = 10;

    private static final String WEBHOOK_RETRY_LIST = "webhook:retry";
    private static final String RETRY_COUNT_PREFIX = "webhook:retry:count:";

    /**
     * Placeholder payload used when re-triggering processWebhook for a retry.
     * The orderId is embedded so the service can extract it without a real payload.
     */
    private static final String RETRY_PAYLOAD_TEMPLATE =
            "{\"payload\":{\"payment\":{\"entity\":{\"order_id\":\"%s\"}}}}";

    /**
     * Placeholder signature used for retries. Signature was already verified on
     * the initial webhook delivery; retries skip re-verification by using a
     * pre-verified marker that the service recognises.
     *
     * <p>Note: In production, consider storing the original verified payload in
     * Redis alongside the orderId so the full payload can be replayed.
     */
    private static final String RETRY_SIGNATURE_BYPASS = "RETRY_BYPASS";

    private final RedisTemplate<String, String> redisTemplate;
    private final WebhookService webhookService;

    /**
     * Processes the webhook retry queue.
     *
     * <p>Dequeues up to {@value #BATCH_SIZE} order IDs, checks their retry count,
     * and either retries processing or logs an exhaustion alert.
     *
     * Requirements: 4.4
     */
    @Scheduled(fixedDelay = 10_000)
    public void processRetryQueue() {
        List<String> orderIds = popBatch();
        if (orderIds.isEmpty()) {
            return;
        }

        log.debug("WebhookRetryJob: processing {} items from retry queue", orderIds.size());

        for (String orderId : orderIds) {
            processRetryItem(orderId);
        }
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Pops up to {@value #BATCH_SIZE} items from the Redis retry list atomically.
     *
     * @return list of order IDs (may be empty)
     */
    private List<String> popBatch() {
        List<String> result = new ArrayList<>(BATCH_SIZE);
        for (int i = 0; i < BATCH_SIZE; i++) {
            String orderId = redisTemplate.opsForList().leftPop(WEBHOOK_RETRY_LIST);
            if (orderId == null) {
                break;
            }
            result.add(orderId);
        }
        return result;
    }

    /**
     * Processes a single retry item.
     *
     * <p>Increments the retry counter and either retries the webhook or logs an
     * exhaustion alert if the maximum retry count has been reached.
     *
     * @param orderId the Razorpay order ID to retry
     */
    private void processRetryItem(String orderId) {
        String countKey = RETRY_COUNT_PREFIX + orderId;
        String countStr = redisTemplate.opsForValue().get(countKey);
        int currentCount = countStr != null ? Integer.parseInt(countStr) : 0;

        if (currentCount >= MAX_RETRY_COUNT) {
            log.error("Webhook retry exhausted for orderId={} after {} attempts — manual intervention required",
                    orderId, MAX_RETRY_COUNT);
            // Alert: in production this would call alertService.publishAlert(...)
            return;
        }

        // Increment retry counter
        redisTemplate.opsForValue().increment(countKey);
        int attempt = currentCount + 1;
        log.info("Retrying webhook for orderId={}, attempt={}/{}", orderId, attempt, MAX_RETRY_COUNT);

        try {
            String retryPayload = String.format(RETRY_PAYLOAD_TEMPLATE, orderId);
            webhookService.processWebhook(retryPayload, RETRY_SIGNATURE_BYPASS);
            log.info("Webhook retry succeeded for orderId={} on attempt {}", orderId, attempt);

        } catch (WebhookSignatureException ex) {
            // Signature bypass should never fail; log as error if it does
            log.error("Unexpected signature exception during webhook retry for orderId={}", orderId, ex);
            redisTemplate.opsForList().rightPush(WEBHOOK_RETRY_LIST, orderId);

        } catch (Exception ex) {
            log.warn("Webhook retry attempt {} failed for orderId={}: {}", attempt, orderId, ex.getMessage());
            // Re-queue for next cycle if retries remain
            if (attempt < MAX_RETRY_COUNT) {
                redisTemplate.opsForList().rightPush(WEBHOOK_RETRY_LIST, orderId);
            } else {
                log.error("Webhook retry exhausted for orderId={} after {} attempts — manual intervention required",
                        orderId, MAX_RETRY_COUNT);
            }
        }
    }
}
