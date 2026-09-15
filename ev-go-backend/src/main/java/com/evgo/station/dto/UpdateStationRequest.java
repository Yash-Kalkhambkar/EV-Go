package com.evgo.station.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request to update a charging station (admin only).
 * All fields are optional - only provided fields will be updated.
 * 
 * @param name Station name
 * @param address Full address
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @param description Description
 * @param totalSlots Total number of charging slots
 * @param pricePerHour Price in INR per hour
 * @param isActive Whether station is active
 * @param connectorTypes List of connector types
 */
public record UpdateStationRequest(
        
        @Size(max = 255, message = "Name must be at most 255 characters")
        String name,
        
        String address,
        
        @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
        @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
        Double latitude,
        
        @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
        @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
        Double longitude,
        
        String description,
        
        @Positive(message = "Total slots must be positive")
        Integer totalSlots,
        
        @DecimalMin(value = "0.01", message = "Price must be at least 0.01")
        BigDecimal pricePerHour,
        
        Boolean isActive,
        
        List<@NotBlank String> connectorTypes
) {}
