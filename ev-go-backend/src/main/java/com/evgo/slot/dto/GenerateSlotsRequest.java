package com.evgo.slot.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * Request to generate slots for a station (admin only).
 * Generates hourly slots for the specified date range.
 * 
 * @param stationId Station ID (required)
 * @param startDate Start date (inclusive)
 * @param endDate End date (inclusive)
 * @param slotDurationMinutes Duration of each slot in minutes (default: 60)
 * @param operatingHoursStart Operating hours start (0-23, default: 0)
 * @param operatingHoursEnd Operating hours end (1-24, default: 24)
 */
public record GenerateSlotsRequest(
        
        @NotNull(message = "Station ID is required")
        Long stationId,
        
        @NotNull(message = "Start date is required")
        LocalDate startDate,
        
        @NotNull(message = "End date is required")
        LocalDate endDate,
        
        @Positive(message = "Slot duration must be positive")
        Integer slotDurationMinutes,
        
        @Min(value = 0, message = "Operating hours start must be >= 0")
        @Max(value = 23, message = "Operating hours start must be <= 23")
        Integer operatingHoursStart,
        
        @Min(value = 1, message = "Operating hours end must be >= 1")
        @Max(value = 24, message = "Operating hours end must be <= 24")
        Integer operatingHoursEnd
) {
    /**
     * Default constructor with defaults.
     */
    public GenerateSlotsRequest {
        if (slotDurationMinutes == null) {
            slotDurationMinutes = 60; // 1 hour default
        }
        if (operatingHoursStart == null) {
            operatingHoursStart = 0; // 00:00
        }
        if (operatingHoursEnd == null) {
            operatingHoursEnd = 24; // 23:59
        }
    }
}
