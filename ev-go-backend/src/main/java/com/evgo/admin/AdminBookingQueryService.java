package com.evgo.admin;

import com.evgo.booking.dto.BookingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service for admin booking queries.
 *
 * <p>Admin-specific operations that allow viewing all users' bookings,
 * not just the authenticated user's own bookings.
 *
 * Requirements: 11.x (admin booking visibility)
 */
public interface AdminBookingQueryService {

    /**
     * List all bookings across all users (admin only).
     *
     * @param pageable Pagination and sorting
     * @param status Optional filter by booking status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
     * @return Paginated list of bookings
     */
    Page<BookingDto> listBookings(Pageable pageable, String status);

    /**
     * Get booking by ID (admin only — no user ownership check).
     *
     * @param bookingId Booking ID
     * @return Booking details
     * @throws com.evgo.exception.ResourceNotFoundException if booking not found
     */
    BookingDto getBookingById(Long bookingId);
}
