package com.evgo.booking;

import com.evgo.booking.dto.BookingDto;
import com.evgo.booking.dto.UserBookingsResponse;

/**
 * Service for querying booking data (read-only operations).
 * Separated from {@link BookingService} to follow CQRS pattern.
 * 
 * <p>This service handles:
 * <ul>
 *   <li>Fetching bookings by ID with authorization checks</li>
 *   <li>Fetching user's bookings grouped by status</li>
 *   <li>Admin queries (future)</li>
 * </ul>
 */
public interface BookingQueryService {
    
    /**
     * Get booking by ID.
     * Validates that the booking belongs to the requesting user.
     * 
     * @param bookingId Booking ID
     * @param userId User ID (for authorization)
     * @return Booking DTO
     * @throws com.evgo.exception.ResourceNotFoundException if booking not found
     * @throws org.springframework.security.access.AccessDeniedException if user doesn't own the booking
     */
    BookingDto getBookingById(Long bookingId, Long userId);
    
    /**
     * Get all bookings for a user, grouped by status.
     * 
     * <p>Grouping logic:
     * <ul>
     *   <li>Upcoming: CONFIRMED bookings with slot.slotDate >= today</li>
     *   <li>Pending: PENDING bookings (awaiting payment)</li>
     *   <li>Past: COMPLETED bookings</li>
     *   <li>Cancelled: CANCELLED bookings</li>
     * </ul>
     * 
     * @param userId User ID
     * @return Bookings grouped by status
     */
    UserBookingsResponse getUserBookings(Long userId);
}
