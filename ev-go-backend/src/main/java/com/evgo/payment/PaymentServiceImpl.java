package com.evgo.payment;

import com.evgo.booking.Booking;
import com.evgo.booking.BookingRepository;
import com.evgo.booking.BookingStatus;
import com.evgo.exception.PaymentFailedException;
import com.evgo.exception.ResourceNotFoundException;
import com.evgo.payment.dto.VerifyPaymentRequest;
import com.evgo.slot.Slot;
import com.evgo.slot.SlotRepository;
import com.evgo.slot.SlotStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
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

/**
 * Default implementation of {@link PaymentService}.
 *
 * <h2>verifyPayment pipeline</h2>
 * <ol>
 *   <li>Resolve idempotency key and check Redis for duplicate calls.</li>
 *   <li>Verify HMAC-SHA256 signature using constant-time comparison.</li>
 *   <li>Load booking; short-circuit if already CONFIRMED.</li>
 *   <li>Atomically confirm booking, mark slot BOOKED, persist Payment record.</li>
 *   <li>Store idempotency marker in Redis with configurable TTL.</li>
 * </ol>
 */
@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String IDEMPOTENCY_KEY_PREFIX = "payment:idempotency:";
    private static final String IDEMPOTENCY_VALUE = "verified";

    @Value("${app.razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Value("${app.cache.payment-idempotency-ttl-seconds:86400}")
    private long idempotencyTtlSeconds;

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            SlotRepository slotRepository,
            @Qualifier("customStringRedisTemplate") RedisTemplate<String, String> redisTemplate) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.redisTemplate = redisTemplate;
    }

    // =========================================================================
    // PaymentService – verifyPayment
    // =========================================================================

    @Override
    @Transactional
    public void verifyPayment(VerifyPaymentRequest request, Long bookingId, String idempotencyKey) {

        // ── Step 1: Resolve idempotency key ───────────────────────────────────
        String key = (idempotencyKey != null && !idempotencyKey.isBlank())
                ? idempotencyKey
                : request.razorpayPaymentId();
        String cacheKey = IDEMPOTENCY_KEY_PREFIX + key;

        // ── Step 2: Idempotency check ─────────────────────────────────────────
        if (redisTemplate.opsForValue().get(cacheKey) != null) {
            log.info("Duplicate payment verification, returning cached for key={}", key);
            return;
        }

        // ── Step 3: Verify Razorpay HMAC-SHA256 signature ────────────────────
        String signatureData = request.razorpayOrderId() + "|" + request.razorpayPaymentId();
        String computed = computeHmac(signatureData, razorpayKeySecret);
        if (!MessageDigest.isEqual(
                computed.getBytes(StandardCharsets.UTF_8),
                request.razorpaySignature().getBytes(StandardCharsets.UTF_8))) {
            log.warn("Payment signature mismatch for bookingId={}, paymentId={}",
                    bookingId, request.razorpayPaymentId());
            throw new PaymentFailedException("Invalid payment signature");
        }

        // ── Step 4: Load booking ──────────────────────────────────────────────
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        // ── Step 5: Short-circuit if already confirmed (idempotent re-call) ──
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            redisTemplate.opsForValue().set(cacheKey, IDEMPOTENCY_VALUE,
                    Duration.ofSeconds(idempotencyTtlSeconds));
            log.info("Booking already confirmed for bookingId={}", bookingId);
            return;
        }

        // ── Step 6: Simple status validation ─────────────────────────────────
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Cannot confirm booking with status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CONFIRMED);

        Slot slot = booking.getSlot();
        slot.setStatus(SlotStatus.BOOKED);

        Payment payment = Payment.builder()
                .booking(booking)
                .razorpayOrderId(request.razorpayOrderId())
                .razorpayPaymentId(request.razorpayPaymentId())
                .razorpaySignature(request.razorpaySignature())
                .amount(booking.getTotalAmount())
                .status(PaymentStatus.SUCCESS)
                .currency("INR")
                .build();

        bookingRepository.save(booking);
        slotRepository.save(slot);
        paymentRepository.save(payment);

        // ── Step 7: Store idempotency marker ──────────────────────────────────
        redisTemplate.opsForValue().set(cacheKey, IDEMPOTENCY_VALUE,
                Duration.ofSeconds(idempotencyTtlSeconds));

        log.info("Payment verified for bookingId={}, paymentId={}", bookingId, request.razorpayPaymentId());
    }

    /**
     * Computes an HMAC-SHA256 digest of {@code data} using {@code secret} and
     * returns the result as a lowercase hex string.
     */
    private String computeHmac(String data, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            mac.init(keySpec);
            byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to compute HMAC-SHA256", ex);
        }
    }
}
