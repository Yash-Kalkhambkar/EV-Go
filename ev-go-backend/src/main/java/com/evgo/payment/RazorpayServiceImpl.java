package com.evgo.payment;

import com.evgo.booking.Booking;
import com.evgo.booking.BookingRepository;
import com.evgo.exception.PaymentFailedException;
import com.evgo.exception.ResourceNotFoundException;
import com.evgo.payment.dto.CreateOrderRequest;
import com.evgo.payment.dto.CreateOrderResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Implementation of {@link RazorpayService}.
 * 
 * <p>Uses Razorpay Java SDK to create orders and handle payments.
 * 
 * <p>Configuration:
 * <ul>
 *   <li>app.razorpay.key-id - Razorpay key ID (public)</li>
 *   <li>app.razorpay.key-secret - Razorpay key secret (private)</li>
 * </ul>
 */
@Service
@Slf4j
public class RazorpayServiceImpl implements RazorpayService {
    
    @Value("${app.razorpay.key-id}")
    private String keyId;
    
    @Value("${app.razorpay.key-secret}")
    private String keySecret;
    
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    
    public RazorpayServiceImpl(BookingRepository bookingRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }
    
    @Override
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        
        log.info("Creating Razorpay order: bookingId={}, amount={}", 
                 request.bookingId(), request.amount());
        
        // Validate booking exists
        Booking booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", request.bookingId()));
        
        // Check if order already exists for this booking
        return paymentRepository.findByBookingId(request.bookingId())
                .map(existingPayment -> {
                    log.info("Razorpay order already exists: orderId={}, bookingId={}", 
                             existingPayment.getRazorpayOrderId(), request.bookingId());
                    
                    // Return existing order (idempotent)
                    return new CreateOrderResponse(
                            existingPayment.getRazorpayOrderId(),
                            existingPayment.getAmount().multiply(BigDecimal.valueOf(100)).intValue(),
                            existingPayment.getCurrency(),
                            keyId
                    );
                })
                .orElseGet(() -> createNewOrder(request, booking));
    }
    
    /**
     * Create a new Razorpay order and persist Payment record.
     */
    private CreateOrderResponse createNewOrder(CreateOrderRequest request, Booking booking) {
        
        try {
            // Initialize Razorpay client
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            
            // Convert amount to paise (smallest currency unit)
            int amountInPaise = request.amount().multiply(BigDecimal.valueOf(100)).intValue();
            
            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", request.currency());
            orderRequest.put("receipt", "booking_" + request.bookingId());
            orderRequest.put("notes", new JSONObject()
                    .put("booking_id", request.bookingId())
                    .put("user_id", booking.getUser().getId())
                    .put("station_id", booking.getStation().getId()));
            
            // Create order via Razorpay API
            Order order = razorpay.orders.create(orderRequest);
            
            String orderId = order.get("id");
            log.info("Razorpay order created successfully: orderId={}, bookingId={}", 
                     orderId, request.bookingId());
            
            // Persist Payment record with status = CREATED
            Payment payment = Payment.builder()
                    .booking(booking)
                    .razorpayOrderId(orderId)
                    .amount(request.amount())
                    .currency(request.currency())
                    .status(PaymentStatus.CREATED)
                    .build();
            
            paymentRepository.save(payment);
            
            // Update booking with Razorpay order ID
            booking.setRazorpayOrderId(orderId);
            bookingRepository.save(booking);
            
            return new CreateOrderResponse(orderId, amountInPaise, request.currency(), keyId);
            
        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order: bookingId={}, error={}", 
                      request.bookingId(), e.getMessage(), e);
            throw new PaymentFailedException("Failed to create payment order: " + e.getMessage());
        }
    }
}
