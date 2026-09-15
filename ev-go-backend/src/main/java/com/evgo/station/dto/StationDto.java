package com.evgo.station.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Station response DTO with distance calculation.
 * 
 * @param id Station ID
 * @param name Station name
 * @param address Full address
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @param description Optional description
 * @param totalSlots Total number of charging slots
 * @param pricePerHour Price in INR per hour
 * @param isActive Whether station is active (soft delete flag)
 * @param connectorTypes List of supported connector types (e.g., CCS2, CHAdeMO)
 * @param distanceKm Distance from search point in kilometers (null if not searched)
 */
public record StationDto(
        Long id,
        String name,
        String address,
        Double latitude,
        Double longitude,
        String description,
        Integer totalSlots,
        BigDecimal pricePerHour,
        Boolean isActive,
        List<String> connectorTypes,
        Double distanceKm
) {}
