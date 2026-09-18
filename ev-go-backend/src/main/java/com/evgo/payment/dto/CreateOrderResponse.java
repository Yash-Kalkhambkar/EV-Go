package com.evgo.payment.dto;

/**
 * Response after creating a Razorpay order.
 * Contains order details needed for frontend Razorpay checkout.
 * 
 * @param orderId Razorpay order ID (e.g., "order_MxK1aB2cD3eF4g")
 * @param amount Amount in smallest currency unit (paise for INR)
 * @param currency Currency code (e.g., "INR")
 * @param keyId Razorpay key ID for checkout (e.g., "rzp_test_xxxxx")
 */
public record CreateOrderResponse(
        String orderId,
        Integer amount,
        String currency,
        String keyId
) {}
