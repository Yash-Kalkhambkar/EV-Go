package com.evgo.payment.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/**
 * Request to create a Razorpay order.
 * 
 * @param bookingId Booking ID to create order for
 * @param amount Amount in INR (will be converted to paise: amount * 100)
 * @param currency Currency code (default: INR)
 */
public record CreateOrderRequest(
        
        @NotNull(message = "Booking ID is required")
        Long bookingId,
        
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
        BigDecimal amount,
        
        @Size(max = 10, message = "Currency must be at most 10 characters")
        String currency
) {
    /**
     * Default constructor with currency = INR.
     */
    public CreateOrderRequest {
        if (currency == null || currency.isBlank()) {
            currency = "INR";
        }
    }
}
