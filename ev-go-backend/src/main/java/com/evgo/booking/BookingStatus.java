package com.evgo.booking;

/**
 * Lifecycle states for a booking.
 *
 * <p>Valid transitions (enforced by {@link com.evgo.booking.statemachine.BookingStateMachine}):
 * <pre>
 *   PENDING → CONFIRMED  (payment verified)
 *   PENDING → CANCELLED  (payment failed, timeout, or user cancelled before paying)
 *   CONFIRMED → CANCELLED (user cancelled within policy window)
 *   CONFIRMED → COMPLETED (slot time has passed)
 *   CANCELLED → (terminal – no further transitions)
 *   COMPLETED → (terminal – no further transitions)
 * </pre>
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */
public enum BookingStatus {

    /** Booking created; payment not yet confirmed. */
    PENDING,

    /** Payment verified; slot is booked. */
    CONFIRMED,

    /** Booking cancelled by user or due to payment failure. */
    CANCELLED,

    /** Slot time has passed; booking is complete. */
    COMPLETED
}
