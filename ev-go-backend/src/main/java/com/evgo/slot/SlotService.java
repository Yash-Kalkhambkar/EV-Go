package com.evgo.slot;

import com.evgo.slot.dto.GenerateSlotsRequest;
import com.evgo.slot.dto.GenerateSlotsResponse;
import com.evgo.slot.dto.SlotDto;

import java.time.LocalDate;
import java.util.List;

/**
 * Service for managing charging slots.
 */
public interface SlotService {
    
    /**
     * Get available slots for a station on a specific date.
     * Results are cached (1 min TTL).
     * 
     * @param stationId Station ID
     * @param date Date to check
     * @return List of available slots, sorted by start time
     */
    List<SlotDto> getAvailableSlots(Long stationId, LocalDate date);
    
    /**
     * Get all slots (available + booked) for a station on a date (admin).
     * 
     * @param stationId Station ID
     * @param date Date to check
     * @return List of all slots, sorted by start time
     */
    List<SlotDto> getAllSlots(Long stationId, LocalDate date);
    
    /**
     * Get slot by ID.
     * 
     * @param id Slot ID
     * @return Slot DTO
     * @throws com.evgo.exception.ResourceNotFoundException if not found
     */
    SlotDto getById(Long id);
    
    /**
     * Generate slots for a station (admin only).
     * Idempotent: skips existing slots, creates only missing ones.
     * 
     * @param request Generate request
     * @return Generation result with counts
     * @throws com.evgo.exception.ResourceNotFoundException if station not found
     */
    GenerateSlotsResponse generateSlots(GenerateSlotsRequest request);
}
