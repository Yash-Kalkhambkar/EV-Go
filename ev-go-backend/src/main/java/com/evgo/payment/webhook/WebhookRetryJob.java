package com.evgo.payment.webhook;

import com.evgo.monitoring.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Scheduled job that retries webhook processing for orders that could not be
 * matched to a booking on the first delivery attempt.
 *
 * <h2>Retry strategy</h2>
 * <ul>
 *   <li>Runs every 10 seconds ({@code fixedDelay = 10 000 ms}).</li>
 *   <li>Pops up to 10 order IDs per cycle from the Redis list {@code webhook:retry}.</li>
 *   <li>Tracks per-order retry count in {@code webhook:retry:count:{orderId}} with a
 *       24-hour TTL.</li>
 *   <li>After 5 failed attempts the order is considered exhausted: an error is logged
 *       and an operational alert is published via {@link AlertService}.</li>
 *   <li>On transient failure the order ID is re-queued at the tail of the list so
 *       other items are not starved.</li>
 * </ul>
 *
 * <p>Signature verification is bypassed on retries by passing
 * {@link WebhookServiceImpl#RETRY_BYPASS_SIGNATURE} — the signature was already
 * verified on the initial delivery.
 *
 * <p>Requirements: 4.4
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class WebhookRetryJob {

    /** Maximum number of retry attempts before an order is considered exhausted. */
    private static final int MAX_RETRY_COUNT = 5;

    /** Maximum items to dequeue per execution cycle. */
    private static final int BATCH_SIZE = 10;

    /** Redis list key holding order IDs pending retry. */
    private static final String WEBHOOK_RETRY_LIST = "webhook:retry";

    /** Redis key prefix for per-order retry counters. */
    private static final String RETRY_COUNT_PREFIX = "webhook:retry:count:";

    private final RedisTemplate<String, String> redisTemplate;
    private final WebhookService webhookService;
    private final AlertService alertService;

    /**
     * Processes the webhook retry queue.
     *
     * <p>Dequeues up to {@value #BATCH_SIZE} order IDs from {@code webhook:retry},
     * checks each order's retry count, and either retries webhook processing or
     * publishes an exhaustion alert when the maximum attempt limit is reached.
     *
     * <p>Requirements: 4.4
     */
    @Scheduled(fixedDelay = 10_000)
    public void processRetryQueue() {
        for (int i = 0; i < BATCH_SIZE; i++) {
            String orderId = redisTemplate.opsForList().leftPop(WEBHOOK_RETRY_LIST);
            if (orderId == null) {
                break;
            }

            // ── Retrieve current retry count ──────────────────────────────────
            String countKey = RETRY_COUNT_PREFIX + orderId;
            String countStr = redisTemplate.opsForValue().get(countKey);
            int count = countStr != null ? Integer.parseInt(countStr) : 0;

            // ── Exhaustion check ──────────────────────────────────────────────
            if (count >= MAX_RETRY_COUNT) {
                log.error("Webhook retry exhausted for orderId={}, giving up after {} attempts",
                        orderId, count);
                alertService.publishAlert(
                        "WEBHOOK_RETRY_EXHAUSTED",
                        "Webhook retry exhausted for orderId=" + orderId,
                        "orderId=" + orderId);
                continue;
            }

            // ── Increment retry counter (TTL 24 h) ────────────────────────────
            redisTemplate.opsForValue().set(countKey, String.valueOf(count + 1), Duration.ofHours(24));
            log.info("Retrying webhook for orderId={}, attempt={}", orderId, count + 1);

            // ── Attempt retry ─────────────────────────────────────────────────
            try {
                webhookService.processWebhook(
                        "{\"order_id\":\"" + orderId + "\"}",
                        WebhookServiceImpl.RETRY_BYPASS_SIGNATURE);
            } catch (Exception e) {
                log.warn("Webhook retry failed for orderId={}: {}", orderId, e.getMessage());
                // Re-queue at the tail so other items are not starved
                redisTemplate.opsForList().rightPush(WEBHOOK_RETRY_LIST, orderId);
            }
        }
    }
}
