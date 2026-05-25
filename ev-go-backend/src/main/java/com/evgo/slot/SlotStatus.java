package com.evgo.slot;

/**
 * Lifecycle states for a charging slot.
 *
 * <p>Valid transitions (enforced by {@link com.evgo.slot.statemachine.SlotStateMachine}):
 * <pre>
 *   AVAILABLE   → RESERVED    (booking created, payment pending)
 *   AVAILABLE   → UNAVAILABLE (admin marks slot unavailable)
 *   RESERVED    → BOOKED      (payment confirmed)
 *   RESERVED    → AVAILABLE   (payment failed or timeout)
 *   BOOKED      → AVAILABLE   (booking cancelled or completed)
 *   UNAVAILABLE → AVAILABLE   (admin re-enables slot)
 * </pre>
 *
 * <p>Note: AVAILABLE → BOOKED is NOT a valid direct transition.
 * The slot must pass through RESERVED first.
 *
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */
public enum SlotStatus {

    /** Slot is open for booking. */
    AVAILABLE,

    /** Slot is held pending payment confirmation. */
    RESERVED,

    /** Payment confirmed; slot is fully booked. */
    BOOKED,

    /** Slot disabled by admin; not bookable. */
    UNAVAILABLE
}
