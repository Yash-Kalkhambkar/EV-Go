package com.evgo.shorturl.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

/**
 * Request to create a short URL.
 * 
 * @param originalUrl Full URL to redirect to (required)
 * @param bookingId Optional: link to booking
 * @param ttlDays Optional: TTL in days (null = never expires)
 */
public record CreateShortUrlRequest(
        
        @NotBlank(message = "Original URL is required")
        String originalUrl,
        
        Long bookingId,
        
        @Positive(message = "TTL must be positive")
        Integer ttlDays
) {}
