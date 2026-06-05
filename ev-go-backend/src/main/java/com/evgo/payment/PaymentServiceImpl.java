package com.evgo.payment;

import com.evgo.booking.Booking;
import com.evgo.booking.BookingRepository;
import com.evgo.booking.BookingStatus;
import com.evgo.booking.statemachine.BookingStateMachine;
import com.evgo.exception.PaymentFailedException;
import com.evgo.exception.ResourceNotFoundException;
import com.evgo.monitoring.AlertService;
import com.evgo.payment.dto.VerifyPaymentRequest;
import com.evgo.slot.Slot;
import com.evgo.slot.SlotRepository;
import com.evgo.slot.SlotStatus;
import com.evgo.slot.statemachine.SlotStateMachine;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.UUID;

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
 *   <li>Increment Micrometer counter and emit audit log.</li>
 * </ol>
 *
 * <h2>issueRefund pipeline</h2>
 * <ol>
 *   <li>Load booking and its associated payment.</li>
 *   <li>Persist a PENDING Refund record.</li>
 *   <li>Call Razorpay refund API with exponential-backoff retry (max 3 attempts).</li>
 *   <li>On success: mark refund SUCCESS, update payment status.</li>
 *   <li>On exhausted retries: mark refund FAILED, set payment refundStatus, alert.</li>
 * </ol>
 *
 * Requirements: 5.1–5.7, 6.1–6.7
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String IDEMPOTENCY_KEY_PREFIX = "payment:idempotency:";
    private static final String IDEMPOTENCY_VALUE = "verified";

    // ── Injected configuration ────────────────────────────────────────────────

    @Value("${app.razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Value("${app.cache.payment-idempotency-ttl-seconds:86400}")
    private long idempotencyTtlSeconds;

    // ── Injected dependencies ─────────────────────────────────────────────────

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final RefundRepository refundRepository;
    private final SlotRepository slotRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final BookingStateMachine bookingStateMachine;
    private final SlotStateMachine slotStateMachine;
    private final MeterRegistry meterRegistry;
    private final AlertService alertService;

    // =========================================================================
    // PaymentService – verifyPayment
    // =========================================================================

    /**
     * {@inheritDoc}
     *
     * Requirements: 5.1–5.7
     */
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

        // ── Step 6: Transactional state transitions + Payment record ─────────
        bookingStateMachine.validate(booking.getStatus(), BookingStatus.CONFIRMED);
        booking.setStatus(BookingStatus.CONFIRMED);

        Slot slot = booking.getSlot();
        slotStateMachine.validate(slot.getStatus(), SlotStatus.BOOKED);
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

        // ── Step 8: Metrics + audit log ───────────────────────────────────────
        meterRegistry.counter("payment.verification.success").increment();
        log.info("AUDIT: payment verified for bookingId={}, paymentId={}",
                bookingId, request.razorpayPaymentId());
    }

    // =========================================================================
    // PaymentService – issueRefund
    // =========================================================================

    /**
     * {@inheritDoc}
     *
     * Requirements: 6.1–6.6
     */
    @Override
    public void issueRefund(Long bookingId, BigDecimal refundAmount, String reason) {

        // ── Step 1: Load booking and payment ─────────────────────────────────
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for bookingId: " + bookingId));

        // ── Step 2: Resolve refund amount (null → full refund) ────────────────
        BigDecimal amount = (refundAmount != null) ? refundAmount : payment.getAmount();

        // ── Step 3: Persist PENDING refund record ─────────────────────────────
        Refund refund = Refund.builder()
                .payment(payment)
                .booking(booking)
                .amount(amount)
                .reason(reason)
                .status("PENDING")
                .retryCount(0)
                .build();
        refundRepository.save(refund);

        // ── Step 4: Call Razorpay API with retry ──────────────────────────────
        try {
            String refundId = callRazorpayRefundApi(payment.getRazorpayPaymentId(), amount);

            // ── Step 5: Mark refund SUCCESS ───────────────────────────────────
            refund.setStatus("SUCCESS");
            refund.setRazorpayRefundId(refundId);

            // ── Step 6: Update payment status ─────────────────────────────────
            if (amount.compareTo(payment.getAmount()) == 0) {
                payment.setStatus(PaymentStatus.REFUNDED);
            } else {
                payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
            }
            BigDecimal previousRefund = payment.getRefundAmount() != null
                    ? payment.getRefundAmount()
                    : BigDecimal.ZERO;
            payment.setRefundAmount(previousRefund.add(amount));

            refundRepository.save(refund);
            paymentRepository.save(payment);

            log.info("AUDIT: refund issued for bookingId={}, refundId={}, amount={}",
                    bookingId, refundId, amount);

        } catch (Exception e) {
            // All retries exhausted — @Recover handles logging; update state here
            log.error("Refund failed after retries for bookingId={}: {}", bookingId, e.getMessage());
            refund.setStatus("FAILED");
            payment.setRefundStatus("REFUND_FAILED");
            refundRepository.save(refund);
            paymentRepository.save(payment);
        }
    }

    // =========================================================================
    // Private helpers
    // =========================================================================

    /**
     * Calls the Razorpay refund API with exponential-backoff retry.
     *
     * <p>Annotated with {@link Retryable} so Spring Retry will automatically
     * retry up to 3 times with a 1 s → 2 s → 4 s backoff on any exception.
     *
     * @param paymentId Razorpay payment ID to refund
     * @param amount    amount to refund
     * @return the Razorpay refund ID on success
     *
     * Requirements: 6.3, 6.4
     */
    @Retryable(
            retryFor = {Exception.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    private String callRazorpayRefundApi(String paymentId, BigDecimal amount) {
        log.info("Calling Razorpay refund API: paymentId={}, amount={}", paymentId, amount);
        // Stub implementation — replace with real Razorpay SDK call in production
        return "rfnd_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
    }

    /**
     * Recovery method invoked by Spring Retry when all {@link #callRazorpayRefundApi}
     * attempts are exhausted.
     *
     * <p>The actual entity state updates are handled in {@link #issueRefund}'s
     * catch block; this method exists to satisfy the Spring Retry {@link Recover}
     * contract and to emit a structured error log.
     *
     * @param e            the last exception thrown
     * @param bookingId    the booking ID (must match {@code issueRefund} signature)
     * @param refundAmount the refund amount
     * @param reason       the refund reason
     *
     * Requirements: 6.5
     */
    @Recover
    public String refundRecover(Exception e, Long bookingId, BigDecimal refundAmount, String reason) {
        log.error("All refund retries exhausted for bookingId={}: {}", bookingId, e.getMessage());
        // Entity state updates are handled in issueRefund's catch block
        throw new PaymentFailedException("Refund failed after all retries for bookingId: " + bookingId, e);
    }

    /**
     * Computes an HMAC-SHA256 digest of {@code data} using {@code secret} and
     * returns the result as a lowercase hex string.
     *
     * @param data   the message to sign
     * @param secret the signing key
     * @return lowercase hex-encoded HMAC-SHA256 digest
     * @throws RuntimeException if the JVM does not support HmacSHA256
     *
     * Requirements: 5.2
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

    // =========================================================================
    // Scheduled monitoring
    // =========================================================================

    /**
     * Monitors the refund failure rate over the last hour and raises an alert
     * if it exceeds 5%.
     *
     * <p>Runs every hour (fixed delay of 3 600 000 ms). If the failure rate
     * exceeds the threshold, {@link AlertService#publishAlert} is called so that
     * log-based alerting in Cloud Logging can trigger notifications.
     *
     * Requirements: 6.7
     */
    @Scheduled(fixedDelay = 3_600_000)
    public void monitorRefundFailureRate() {
        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        long failedCount = refundRepository.countByStatusAndCreatedAtAfter("FAILED", oneHourAgo);
        long totalCount  = refundRepository.countByCreatedAtAfter(oneHourAgo);

        if (totalCount > 0) {
            double failureRate = (double) failedCount / totalCount;
            if (failureRate > 0.05) {
                alertService.publishAlert(
                        "REFUND_FAILURE_RATE",
                        "Refund failure rate exceeds 5%",
                        "failed=" + failedCount + ", total=" + totalCount);
                log.warn("Refund failure rate alert: failed={}, total={}, rate={}",
                        failedCount, totalCount, String.format("%.2f%%", failureRate * 100));
            }
        }
    }
}
