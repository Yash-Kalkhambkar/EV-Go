package com.evgo.booking.dto;

import jakarta.validation.constraints.Size;

/**
 * Request payload for cancelling a booking.
 * 
 * @param reason Optional cancellation reason (for refund processing and analytics)
 */
public record CancelBookingRequest(
        
        @Size(max = 500, message = "Reason must be at most 500 characters")
        String reason
) {}
