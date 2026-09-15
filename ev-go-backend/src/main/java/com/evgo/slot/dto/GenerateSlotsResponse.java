package com.evgo.slot.dto;

/**
 * Response after generating slots.
 * 
 * @param stationId Station ID
 * @param slotsCreated Number of new slots created
 * @param slotsSkipped Number of slots skipped (already exist)
 * @param message Success message
 */
public record GenerateSlotsResponse(
        Long stationId,
        Integer slotsCreated,
        Integer slotsSkipped,
        String message
) {}
