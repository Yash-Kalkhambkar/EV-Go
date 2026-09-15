package com.evgo.slot.dto;

import com.evgo.slot.SlotStatus;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Slot response DTO.
 * 
 * @param id Slot ID
 * @param stationId Station ID
 * @param stationName Station name
 * @param slotDate Slot date
 * @param startTime Slot start time
 * @param endTime Slot end time
 * @param status Slot status (AVAILABLE, RESERVED, BOOKED, UNAVAILABLE)
 */
public record SlotDto(
        Long id,
        Long stationId,
        String stationName,
        LocalDate slotDate,
        LocalTime startTime,
        LocalTime endTime,
        SlotStatus status
) {}
