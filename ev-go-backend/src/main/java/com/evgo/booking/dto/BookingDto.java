package com.evgo.booking.dto;

import com.evgo.booking.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Read-only projection of a {@link com.evgo.booking.Booking} entity
 * returned to API callers.
 *
 * Requirements: 1.1, 11.2
 */
public record BookingDto(
        Long id,
        Long userId,
        Long slotId,
        Long stationId,
        BookingStatus status,
        BigDecimal totalAmount,
        String razorpayOrderId,
        Instant bookedAt
) {}
