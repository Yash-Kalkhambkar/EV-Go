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
import java.util.HexFormat;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * Default implementation of {@link WebhookService}.
 *
 * <h2>Processing pipeline</h2>
 * <ol>
 *   <li>Verify HMAC-SHA256 signature (constant-time comparison).</li>
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

    @Value("${app.razorpay.webhook-secret}")
    private String webhookSecret;

    @Value("${app.webhook.idempotency-ttl-seconds:86400}")
    private long idempotencyTtlSeconds;

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
        // ── Step 1: Verify HMAC-SHA256 signature ─────────────────────────────
        // Retries from WebhookRetryJob bypass re-verification (already verified on first delivery)
        if (!RETRY_BYPASS_SIGNATURE.equals(signature)) {
            verifySignature(payload, signature);
        }

        // ── Step 2: Extract Razorpay order ID from payload ───────────────────
        String orderId = extractOrderId(payload);

        // ── Step 3: Idempotency check ─────────────────────────────────────────
        String idempotencyKey = WEBHOOK_KEY_PREFIX + orderId;
        String cached = redisTemplate.opsForValue().get(idempotencyKey);
        if (cached != null) {
            log.info("Duplicate webhook received for orderId={}, skipping", orderId);
            return;
        }

        // ── Step 4: Find booking ──────────────────────────────────────────────
        Optional<Booking> bookingOpt = bookingRepository.findByRazorpayOrderId(orderId);
        if (bookingOpt.isEmpty()) {
            log.warn("Booking not found for razorpayOrderId={}, queuing for retry", orderId);
            redisTemplate.opsForList().rightPush(WEBHOOK_RETRY_LIST, orderId);
            return;
        }

        // ── Steps 5-6: Transactional confirmation ─────────────────────────────
        confirmBookingTransactional(bookingOpt.get(), orderId);

        // ── Step 7: Store idempotency marker in Redis ─────────────────────────
        redisTemplate.opsForValue().set(idempotencyKey, PROCESSED_VALUE, idempotencyTtlSeconds, TimeUnit.SECONDS);

        log.info("AUDIT: webhook processed for booking {}, orderId={}", bookingOpt.get().getId(), orderId);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Verifies the HMAC-SHA256 signature using a constant-time comparison to
     * prevent timing-based attacks.
     *
     * @param payload   raw webhook body
     * @param signature hex-encoded signature from the {@code X-Razorpay-Signature} header
     * @throws WebhookSignatureException if the signature does not match
     *
     * Requirements: 4.1
     */
    private void verifySignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(
                    webhookSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            mac.init(keySpec);

            byte[] computedBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computedHex = HexFormat.of().formatHex(computedBytes);

            byte[] computedHexBytes = computedHex.getBytes(StandardCharsets.UTF_8);
            byte[] signatureBytes = signature.getBytes(StandardCharsets.UTF_8);

            // Constant-time comparison to prevent timing attacks
            if (!MessageDigest.isEqual(computedHexBytes, signatureBytes)) {
                log.warn("Webhook signature mismatch: expected={}, received={}", computedHex, signature);
                throw new WebhookSignatureException("Webhook signature verification failed");
            }

        } catch (WebhookSignatureException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new WebhookSignatureException("Failed to compute webhook HMAC signature", ex);
        }
    }

    /**
     * Parses the Razorpay order ID from the webhook JSON payload.
     *
     * <p>Expected path: {@code payload.payment.entity.order_id}
     *
     * @param payload raw JSON body
     * @return the Razorpay order ID
     * @throws IllegalArgumentException if the order ID cannot be extracted
     *
     * Requirements: 4.3
     */
    private String extractOrderId(String payload) {
        try {
            JsonNode root = objectMapper.readTree(payload);
            JsonNode orderIdNode = root
                    .path("payload")
                    .path("payment")
                    .path("entity")
                    .path("order_id");

            if (orderIdNode.isMissingNode() || orderIdNode.isNull()) {
                throw new IllegalArgumentException("order_id not found in webhook payload");
            }
            return orderIdNode.asText();

        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Failed to parse webhook payload", ex);
        }
    }

    /**
     * Atomically confirms the booking, marks the slot as BOOKED, and creates a
     * Payment record. All changes are committed in a single transaction.
     *
     * @param booking the booking to confirm
     * @param orderId the Razorpay order ID (used for the Payment record)
     *
     * Requirements: 4.2, 4.5
     */
    @Transactional
    protected void confirmBookingTransactional(Booking booking, String orderId) {
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
                .build();

        bookingRepository.save(booking);
        slotRepository.save(slot);
        paymentRepository.save(payment);
    }
}
