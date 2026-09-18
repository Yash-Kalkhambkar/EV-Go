package com.evgo.booking.dto;

import java.util.List;

/**
 * Response containing user's bookings grouped by status.
 * Makes it easy for frontend to render different sections.
 * 
 * @param upcoming CONFIRMED bookings with future slot times
 * @param pending PENDING bookings awaiting payment
 * @param past COMPLETED bookings
 * @param cancelled CANCELLED bookings
 */
public record UserBookingsResponse(
        List<BookingDetailDto> upcoming,
        List<BookingDetailDto> pending,
        List<BookingDetailDto> past,
        List<BookingDetailDto> cancelled
) {}
