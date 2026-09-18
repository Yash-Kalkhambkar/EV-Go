package com.evgo.payment;

import com.evgo.payment.dto.CreateOrderRequest;
import com.evgo.payment.dto.CreateOrderResponse;

/**
 * Service for Razorpay API operations.
 * Handles order creation and other Razorpay SDK interactions.
 */
public interface RazorpayService {
    
    /**
     * Create a Razorpay order for a booking.
     * 
     * <p>Razorpay requires creating an order before payment.
     * The order ID is used to initialize the checkout on frontend.
     * 
     * @param request Create order request
     * @return Razorpay order details
     * @throws com.evgo.exception.PaymentFailedException if order creation fails
     */
    CreateOrderResponse createOrder(CreateOrderRequest request);
}
