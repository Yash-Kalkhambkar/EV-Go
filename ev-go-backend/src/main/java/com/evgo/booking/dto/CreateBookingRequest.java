package com.evgo.booking.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Request payload for creating a new booking.
 *
 * Requirements: 1.1
 */
public record CreateBookingRequest(

        /** ID of the slot to book. Must not be null. */
        @NotNull(message = "slotId is required")
        Long slotId
) {}
