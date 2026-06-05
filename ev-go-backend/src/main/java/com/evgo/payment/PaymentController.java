package com.evgo.payment;

import com.evgo.payment.dto.VerifyPaymentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for payment operations.
 *
 * <p>Exposes endpoints for:
 * <ul>
 *   <li>POST /api/payments/verify — verify a Razorpay payment after client-side checkout</li>
 * </ul>
 *
 * Requirements: 5.1
 */
@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Verifies a Razorpay payment and confirms the booking.
     *
     * @param idempotencyKey optional X-Idempotency-Key header for deduplication
     * @param bookingId      the booking to confirm
     * @param request        Razorpay payment details (orderId, paymentId, signature)
     * @return 200 OK on success
     *
     * Requirements: 5.1
     */
    @PostMapping("/verify")
    public ResponseEntity<Void> verifyPayment(
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestParam Long bookingId,
            @RequestBody VerifyPaymentRequest request) {

        log.info("Payment verification request: bookingId={}, paymentId={}", bookingId, request.razorpayPaymentId());
        paymentService.verifyPayment(request, bookingId, idempotencyKey);
        return ResponseEntity.ok().build();
    }
}
