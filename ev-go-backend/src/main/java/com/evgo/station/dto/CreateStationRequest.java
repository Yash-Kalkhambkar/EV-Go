package com.evgo.station.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request to create a new charging station (admin only).
 * 
 * @param name Station name (required)
 * @param address Full address (required)
 * @param latitude Latitude coordinate (required, -90 to 90)
 * @param longitude Longitude coordinate (required, -180 to 180)
 * @param description Optional description
 * @param totalSlots Total number of charging slots (required, positive)
 * @param pricePerHour Price in INR per hour (required, positive)
 * @param connectorTypes List of connector types (required, at least one)
 */
public record CreateStationRequest(
        
        @NotBlank(message = "Station name is required")
        @Size(max = 255, message = "Name must be at most 255 characters")
        String name,
        
        @NotBlank(message = "Address is required")
        String address,
        
        @NotNull(message = "Latitude is required")
        @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
        @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
        Double latitude,
        
        @NotNull(message = "Longitude is required")
        @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
        @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
        Double longitude,
        
        String description,
        
        @NotNull(message = "Total slots is required")
        @Positive(message = "Total slots must be positive")
        Integer totalSlots,
        
        @NotNull(message = "Price per hour is required")
        @DecimalMin(value = "0.01", message = "Price must be at least 0.01")
        BigDecimal pricePerHour,
        
        @NotEmpty(message = "At least one connector type is required")
        List<@NotBlank String> connectorTypes
) {}
