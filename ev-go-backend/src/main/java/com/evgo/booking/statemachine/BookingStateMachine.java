package com.evgo.booking.statemachine;

import com.evgo.booking.BookingStatus;
import com.evgo.exception.InvalidStateTransitionException;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Validates booking status transitions.
 *
 * <p>Enforces the booking lifecycle state machine:
 * <pre>
 *   PENDING   → CONFIRMED  (payment verified)
 *   PENDING   → CANCELLED  (payment failed, timeout, or user cancelled before paying)
 *   CONFIRMED → CANCELLED  (user cancelled within policy window)
 *   CONFIRMED → COMPLETED  (slot time has passed)
 *   CANCELLED → (terminal – no further transitions)
 *   COMPLETED → (terminal – no further transitions)
 * </pre>
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */
@Component
public class BookingStateMachine {

    /**
     * Terminal states from which no further transitions are allowed.
     *
     * Requirements: 11.3, 11.4
     */
    public static final Set<BookingStatus> TERMINAL_STATES =
            EnumSet.of(BookingStatus.CANCELLED, BookingStatus.COMPLETED);

    /**
     * Allowed transitions for each booking status.
     *
     * Requirements: 11.1, 11.2
     */
    public static final Map<BookingStatus, Set<BookingStatus>> VALID_TRANSITIONS;

    static {
        Map<BookingStatus, Set<BookingStatus>> map = new EnumMap<>(BookingStatus.class);
        map.put(BookingStatus.PENDING,   EnumSet.of(BookingStatus.CONFIRMED, BookingStatus.CANCELLED));
        map.put(BookingStatus.CONFIRMED, EnumSet.of(BookingStatus.CANCELLED, BookingStatus.COMPLETED));
        map.put(BookingStatus.CANCELLED, EnumSet.noneOf(BookingStatus.class));
        map.put(BookingStatus.COMPLETED, EnumSet.noneOf(BookingStatus.class));
        VALID_TRANSITIONS = Map.copyOf(map);
    }

    /**
     * Validates that transitioning a booking from {@code from} to {@code to} is allowed.
     *
     * @param from the current booking status
     * @param to   the desired target status
     * @throws InvalidStateTransitionException if the transition is not permitted
     *
     * Requirements: 11.2
     */
    public void validate(BookingStatus from, BookingStatus to) {
        Set<BookingStatus> allowed = VALID_TRANSITIONS.getOrDefault(from, EnumSet.noneOf(BookingStatus.class));
        if (!allowed.contains(to)) {
            throw new InvalidStateTransitionException(
                    "Cannot transition booking from " + from + " to " + to);
        }
    }
}
