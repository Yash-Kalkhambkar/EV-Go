package com.evgo.booking.dto;

import com.evgo.booking.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Detailed booking DTO with station and slot information.
 * Used for "My Bookings" view where we need full context.
 * 
 * @param id Booking ID
 * @param slotId Slot ID
 * @param stationId Station ID
 * @param stationName Station name
 * @param stationAddress Station address
 * @param slotDate Slot date
 * @param startTime Slot start time
 * @param endTime Slot end time
 * @param status Booking status
 * @param totalAmount Total amount paid/to be paid
 * @param bookedAt Booking timestamp
 * @param cancelledAt Cancellation timestamp (null if not cancelled)
 * @param cancellationReason Cancellation reason (null if not cancelled)
 */
public record BookingDetailDto(
        Long id,
        Long slotId,
        Long stationId,
        String stationName,
        String stationAddress,
        LocalDate slotDate,
        LocalTime startTime,
        LocalTime endTime,
        BookingStatus status,
        BigDecimal totalAmount,
        Instant bookedAt,
        Instant cancelledAt,
        String cancellationReason
) {}
