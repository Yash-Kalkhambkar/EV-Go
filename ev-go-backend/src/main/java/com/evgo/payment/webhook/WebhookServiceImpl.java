package com.evgo.payment.webhook;

import com.evgo.booking.Booking;
import com.evgo.booking.BookingRepository;
import com.evgo.booking.BookingStatus;
import com.evgo.booking.statemachine.BookingStateMachine;
import com.evgo.payment.Payment;
import com.evgo.payment.PaymentRepository;
import com.evgo.payment.PaymentStatus;
import com.evgo.slot.Slot;
import com.evgo.slot.SlotRepository;
import com.evgo.slot.SlotStatus;
import com.evgo.slot.statemachine.SlotStateMachine;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Optional;

/**
 * Default implementation of {@link WebhookService}.
 *
 * <h2>Processing pipeline</h2>
 * <ol>
 *   <li>Reject missing or blank signatures immediately.</li>
 *   <li>Verify HMAC-SHA256 signature using constant-time comparison.</li>
 *   <li>Parse the Razorpay order ID from the JSON payload.</li>
 *   <li>Check Redis for duplicate processing (idempotency key {@code webhook:{orderId}}).</li>
 *   <li>Look up the booking by Razorpay order ID.</li>
 *   <li>If booking not found, push to retry queue ({@code webhook:retry}) and return.</li>
 *   <li>Atomically confirm the booking, mark the slot as BOOKED, and create a Payment record.</li>
 *   <li>Store the idempotency marker in Redis with a 24-hour TTL.</li>
 * </ol>
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookServiceImpl implements WebhookService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String WEBHOOK_KEY_PREFIX = "webhook:";
    private static final String WEBHOOK_RETRY_LIST = "webhook:retry";
    private static final String PROCESSED_VALUE = "processed";
    private static final Duration IDEMPOTENCY_TTL = Duration.ofHours(24);

    @Value("${app.razorpay.webhook-secret:}")
    private String webhookSecret;

    private final RedisTemplate<String, String> redisTemplate;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final SlotRepository slotRepository;
    private final BookingStateMachine bookingStateMachine;
    private final SlotStateMachine slotStateMachine;
    private final ObjectMapper objectMapper;

    /**
     * Sentinel value used by {@link WebhookRetryJob} to bypass signature
     * verification on retries (the signature was already verified on the
     * initial delivery).
     */
    static final String RETRY_BYPASS_SIGNATURE = "RETRY_BYPASS";

    /**
     * {@inheritDoc}
     *
     * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7
     */
    @Override
    public void processWebhook(String payload, String signature) {
        // ── Step 1: Reject missing/blank signatures ───────────────────────────
        if (signature == null || signature.isBlank()) {
            throw new WebhookSignatureException("Missing signature");
        }

        // ── Step 2: Verify HMAC-SHA256 signature ─────────────────────────────
        // Retries from WebhookRetryJob bypass re-verification (already verified on first delivery)
        if (!RETRY_BYPASS_SIGNATURE.equals(signature)) {
            String computed = computeHmac(payload, webhookSecret);
            if (!MessageDigest.isEqual(
                    computed.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8))) {
                log.warn("Webhook signature mismatch for received signature={}", signature);
                throw new WebhookSignatureException("Invalid signature");
            }
        }

        // ── Step 3: Extract Razorpay order ID from payload ───────────────────
        String orderId = extractOrderId(payload);
        if (orderId == null) {
            log.warn("Could not extract order_id from webhook payload, ignoring");
            return;
        }

        // ── Step 4: Idempotency check ─────────────────────────────────────────
        String idempotencyKey = WEBHOOK_KEY_PREFIX + orderId;
        String cached = redisTemplate.opsForValue().get(idempotencyKey);
        if (cached != null) {
            log.info("Duplicate webhook, skipping orderId={}", orderId);
            return;
        }

        // ── Step 5: Find booking ──────────────────────────────────────────────
        Optional<Booking> bookingOpt = bookingRepository.findByRazorpayOrderId(orderId);
        if (bookingOpt.isEmpty()) {
            redisTemplate.opsForList().rightPush(WEBHOOK_RETRY_LIST, orderId);
            log.warn("Booking not found for orderId={}, queued for retry", orderId);
            return;
        }

        // ── Step 6: Transactional confirmation ────────────────────────────────
        Booking booking = confirmBookingTransactional(bookingOpt.get(), orderId, idempotencyKey);
        if (booking == null) {
            // Already confirmed — idempotency key was stored inside the transaction
            return;
        }

        // ── Step 7: Store idempotency marker in Redis ─────────────────────────
        redisTemplate.opsForValue().set(idempotencyKey, PROCESSED_VALUE, IDEMPOTENCY_TTL);

        // ── Step 8: Audit log ─────────────────────────────────────────────────
        log.info("AUDIT: webhook processed for bookingId={}, orderId={}", booking.getId(), orderId);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Computes an HMAC-SHA256 digest of {@code data} using {@code secret} and
     * returns the result as a lowercase hex string.
     *
     * @param data   the message to sign
     * @param secret the signing key
     * @return lowercase hex-encoded HMAC-SHA256 digest
     * @throws RuntimeException if the JVM does not support HmacSHA256
     *
     * Requirements: 4.1
     */
    private String computeHmac(String data, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            mac.init(keySpec);
            byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest); // lowercase by default
        } catch (Exception ex) {
            throw new RuntimeException("Failed to compute HMAC-SHA256", ex);
        }
    }

    /**
     * Parses the Razorpay order ID from the webhook JSON payload.
     *
     * <p>Primary path: {@code payload → "payload" → "payment" → "entity" → "order_id"}<br>
     * Fallback path: {@code payload → "order_id"}
     *
     * @param payload raw JSON body
     * @return the Razorpay order ID, or {@code null} if not found
     *
     * Requirements: 4.3
     */
    private String extractOrderId(String payload) {
        try {
            JsonNode root = objectMapper.readTree(payload);

            // Primary path: nested Razorpay webhook structure
            JsonNode orderIdNode = root
                    .path("payload")
                    .path("payment")
                    .path("entity")
                    .path("order_id");

            if (!orderIdNode.isMissingNode() && !orderIdNode.isNull()) {
                return orderIdNode.asText();
            }

            // Fallback: top-level order_id
            JsonNode topLevel = root.path("order_id");
            if (!topLevel.isMissingNode() && !topLevel.isNull()) {
                return topLevel.asText();
            }

            return null;

        } catch (Exception ex) {
            log.warn("Failed to parse webhook payload for order_id extraction", ex);
            return null;
        }
    }

    /**
     * Atomically confirms the booking, marks the slot as BOOKED, and creates a
     * Payment record. All changes are committed in a single transaction.
     *
     * <p>If the booking is already CONFIRMED this method stores the idempotency
     * key and returns {@code null} to signal that no further action is needed.
     *
     * @param booking        the booking to confirm
     * @param orderId        the Razorpay order ID (used for the Payment record)
     * @param idempotencyKey the Redis key to mark as processed on early-exit
     * @return the confirmed booking, or {@code null} if it was already confirmed
     *
     * Requirements: 4.2, 4.5
     */
    @Transactional
    protected Booking confirmBookingTransactional(Booking booking, String orderId, String idempotencyKey) {
        // Guard: booking already confirmed (idempotent re-delivery)
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            log.info("Booking already confirmed for bookingId={}, orderId={}", booking.getId(), orderId);
            redisTemplate.opsForValue().set(idempotencyKey, PROCESSED_VALUE, IDEMPOTENCY_TTL);
            return null;
        }

        // Validate and apply booking state transition: PENDING → CONFIRMED
        bookingStateMachine.validate(booking.getStatus(), BookingStatus.CONFIRMED);
        booking.setStatus(BookingStatus.CONFIRMED);

        // Validate and apply slot state transition: RESERVED → BOOKED
        Slot slot = booking.getSlot();
        slotStateMachine.validate(slot.getStatus(), SlotStatus.BOOKED);
        slot.setStatus(SlotStatus.BOOKED);

        // Create payment record
        Payment payment = Payment.builder()
                .booking(booking)
                .razorpayOrderId(orderId)
                .amount(booking.getTotalAmount())
                .status(PaymentStatus.SUCCESS)
                .currency("INR")
                .build();

        bookingRepository.save(booking);
        slotRepository.save(slot);
        paymentRepository.save(payment);

        return booking;
    }
}
