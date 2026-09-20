package com.evgo.booking;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Booking} entities.
 *
 * Requirements: 1.1, 11.2, 11.5
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Returns all bookings for a given slot that are NOT in the specified statuses.
     * Used to check whether a slot already has an active (non-cancelled) booking.
     *
     * @param slotId   the slot to check
     * @param statuses statuses to exclude (e.g. {@code [CANCELLED]})
     * @return list of bookings in any status not in the exclusion list
     */
    List<Booking> findBySlotIdAndStatusNotIn(Long slotId, List<BookingStatus> statuses);

    /**
     * Looks up a booking by its Razorpay order ID.
     * Used during payment verification webhook processing.
     *
     * @param orderId the Razorpay order ID
     * @return the matching booking, if any
     */
    Optional<Booking> findByRazorpayOrderId(String orderId);

    /**
     * Returns a paginated list of bookings in a given status that were created
     * before the specified cutoff time. Used by the scheduler to expire stale
     * PENDING bookings.
     *
     * @param status   the booking status to filter on (typically {@code PENDING})
     * @param cutoff   bookings created before this instant are returned
     * @param pageable pagination parameters
     * @return page of matching bookings
     */
    Page<Booking> findByStatusAndBookedAtBefore(BookingStatus status, Instant cutoff, Pageable pageable);
    
    /**
     * Returns all bookings for a user, ordered by booking time (newest first).
     * Used for "My Bookings" view.
     *
     * @param userId the user ID
     * @return list of bookings ordered by booked_at DESC
     */
    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    /**
     * Returns paginated bookings filtered by status.
     * Used by admin to view bookings by status (PENDING, CONFIRMED, etc.).
     *
     * @param status booking status to filter by
     * @param pageable pagination parameters
     * @return page of bookings matching the status
     */
    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);
}
