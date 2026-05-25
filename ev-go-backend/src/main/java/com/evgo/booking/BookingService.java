package com.evgo.booking;

import com.evgo.booking.dto.BookingDto;
import com.evgo.booking.dto.CreateBookingRequest;

/**
 * Core booking operations for the EV GO system.
 *
 * <p>Implementations must enforce:
 * <ul>
 *   <li>Two-tier locking (Redis distributed lock + DB pessimistic lock) during creation</li>
 *   <li>State machine validation for all status transitions</li>
 *   <li>Slot status synchronisation on every booking state change</li>
 * </ul>
 *
 * Requirements: 1.1, 1.6, 2.2, 2.4, 2.5, 2.7, 11.2, 11.5, 11.6
 */
public interface BookingService {

    /**
     * Creates a new booking for the given slot on behalf of the specified user.
     *
     * <p>Acquires a Redis distributed lock on the slot before entering the
     * database transaction. The slot is marked {@code RESERVED} and the booking
     * is persisted in {@code PENDING} status. Payment must be completed separately.
     *
     * @param request contains the slot ID to book
     * @param userId  the authenticated user making the booking
     * @return the created booking as a DTO
     *
     * Requirements: 1.1, 1.6, 2.2, 2.4, 2.7
     */
    BookingDto createBooking(CreateBookingRequest request, Long userId);

    /**
     * Transitions a booking to a new status, synchronising the associated slot
     * status accordingly.
     *
     * <p>Validates the transition via {@link com.evgo.booking.statemachine.BookingStateMachine}
     * and the corresponding slot transition via {@link com.evgo.slot.statemachine.SlotStateMachine}.
     *
     * @param bookingId the booking to update
     * @param newStatus the target status
     * @param userId    the user requesting the transition (for authorisation checks)
     * @return the updated booking as a DTO
     *
     * Requirements: 11.2, 11.5, 11.6
     */
    BookingDto updateBookingStatus(Long bookingId, BookingStatus newStatus, Long userId);

    /**
     * Cancels a booking, releasing the slot back to {@code AVAILABLE}.
     *
     * <p>Delegates to {@link #updateBookingStatus} with {@link BookingStatus#CANCELLED}.
     * Refund initiation is handled separately by the payment service.
     *
     * @param bookingId the booking to cancel
     * @param userId    the user requesting cancellation
     *
     * Requirements: 11.5
     */
    void cancelBooking(Long bookingId, Long userId);
}
