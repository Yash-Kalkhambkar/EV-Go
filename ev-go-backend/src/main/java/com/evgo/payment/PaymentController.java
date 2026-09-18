package com.evgo.payment;

import com.evgo.booking.BookingService;
import com.evgo.booking.BookingStatus;
import com.evgo.payment.dto.CreateOrderRequest;
import com.evgo.payment.dto.CreateOrderResponse;
import com.evgo.payment.dto.VerifyPaymentRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for payment operations.
 * 
 * <p>Endpoints:
 * <ul>
 *   <li>POST /api/payments/orders - Create Razorpay order for booking</li>
 *   <li>POST /api/payments/verify - Verify payment and confirm booking</li>
 *   <li>POST /api/payments/webhook - Razorpay webhook (future)</li>
 * </ul>
 * 
 * <p>Flow:
 * <ol>
 *   <li>User creates booking → status = PENDING, slot = RESERVED</li>
 *   <li>Frontend calls POST /api/payments/orders → gets Razorpay order ID</li>
 *   <li>User pays via Razorpay checkout</li>
 *   <li>Frontend calls POST /api/payments/verify with signature</li>
 *   <li>Backend verifies signature, confirms booking, sends WebSocket notification</li>
 * </ol>
 * 
 * Requirements: 5.1, 6.2, 6.6
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    
    private final PaymentService paymentService;
    private final RazorpayService razorpayService;
    private final BookingService bookingService;
    
    /**
     * Create a Razorpay order for a booking.
     * Called by frontend before showing Razorpay checkout.
     * 
     * <p>Example request:
     * <pre>{@code
     * POST /api/payments/orders
     * {
     *   "bookingId": 5001,
     *   "amount": 50.00,
     *   "currency": "INR"
     * }
     * }</pre>
     * 
     * <p>Example response:
     * <pre>{@code
     * {
     *   "orderId": "order_MxK1aB2cD3eF4g",
     *   "amount": 5000,
     *   "currency": "INR",
     *   "keyId": "rzp_test_xxxxx"
     * }
     * }</pre>
     * 
     * @param request Create order request
     * @return Razorpay order details
     */
    @PostMapping("/orders")
    public ResponseEntity<CreateOrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        
        log.info("Creating Razorpay order: bookingId={}, amount={}", 
                 request.bookingId(), request.amount());
        
        CreateOrderResponse response = razorpayService.createOrder(request);
        
        log.info("Razorpay order created: orderId={}, bookingId={}", 
                 response.orderId(), request.bookingId());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Verify payment signature and confirm booking.
     * Called by frontend after successful Razorpay checkout.
     * 
     * <p>Flow:
     * <ol>
     *   <li>Verify HMAC-SHA256 signature</li>
     *   <li>Check idempotency (Redis cache)</li>
     *   <li>Update booking: PENDING → CONFIRMED</li>
     *   <li>Update slot: RESERVED → BOOKED</li>
     *   <li>Create Payment record</li>
     *   <li>Send WebSocket notification</li>
     * </ol>
     * 
     * <p>Example request:
     * <pre>{@code
     * POST /api/payments/verify
     * {
     *   "bookingId": 5001,
     *   "razorpayOrderId": "order_MxK1aB2cD3eF4g",
     *   "razorpayPaymentId": "pay_MxK1aB2cD3eF4h",
     *   "razorpaySignature": "abcd1234..."
     * }
     * }</pre>
     * 
     * @param bookingId Booking ID to confirm
     * @param request Razorpay payment details
     * @return Success message
     */
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestParam Long bookingId,
            @Valid @RequestBody VerifyPaymentRequest request) {
        
        log.info("Verifying payment: bookingId={}, paymentId={}", 
                 bookingId, request.razorpayPaymentId());
        
        // Verify signature and update booking/slot/payment (idempotent)
        paymentService.verifyPayment(request, bookingId, request.razorpayPaymentId());
        
        // Trigger booking confirmation (sends WebSocket notification)
        // Note: This is safe to call even if already confirmed (idempotent)
        try {
            bookingService.updateBookingStatus(bookingId, BookingStatus.CONFIRMED, null);
        } catch (IllegalStateException e) {
            // Booking already confirmed, ignore
            log.debug("Booking already confirmed: bookingId={}", bookingId);
        }
        
        log.info("Payment verified successfully: bookingId={}", bookingId);
        
        return ResponseEntity.ok("Payment verified successfully");
    }
    
    /**
     * Razorpay webhook endpoint (future implementation).
     * 
     * <p>Razorpay sends webhooks for:
     * <ul>
     *   <li>payment.captured - Payment successful</li>
     *   <li>payment.failed - Payment failed</li>
     *   <li>refund.created - Refund initiated</li>
     * </ul>
     * 
     * <p>Not implemented in V1 (relying on client-side verification).
     * 
     * @param payload Webhook payload from Razorpay
     * @return Success response
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload) {
        
        log.warn("Razorpay webhook received but not implemented: payload={}", payload);
        
        // TODO: Implement webhook signature verification and processing
        // See: https://razorpay.com/docs/webhooks/validate-test/
        
        return ResponseEntity.ok("Webhook received");
    }
}
