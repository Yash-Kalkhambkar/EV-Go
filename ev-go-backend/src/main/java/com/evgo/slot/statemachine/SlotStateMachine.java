package com.evgo.slot.statemachine;

import com.evgo.exception.InvalidStateTransitionException;
import com.evgo.slot.SlotStatus;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Validates slot status transitions.
 *
 * <p>Enforces the slot lifecycle state machine:
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
@Component
public class SlotStateMachine {

    /**
     * Allowed transitions for each slot status.
     *
     * Requirements: 12.1, 12.2, 12.3, 12.4
     */
    public static final Map<SlotStatus, Set<SlotStatus>> VALID_TRANSITIONS;

    static {
        Map<SlotStatus, Set<SlotStatus>> map = new EnumMap<>(SlotStatus.class);
        map.put(SlotStatus.AVAILABLE,   EnumSet.of(SlotStatus.RESERVED, SlotStatus.UNAVAILABLE));
        map.put(SlotStatus.RESERVED,    EnumSet.of(SlotStatus.BOOKED, SlotStatus.AVAILABLE));
        map.put(SlotStatus.BOOKED,      EnumSet.of(SlotStatus.AVAILABLE));
        map.put(SlotStatus.UNAVAILABLE, EnumSet.of(SlotStatus.AVAILABLE));
        VALID_TRANSITIONS = Map.copyOf(map);
    }

    /**
     * Validates that transitioning a slot from {@code from} to {@code to} is allowed.
     *
     * @param from the current slot status
     * @param to   the desired target status
     * @throws InvalidStateTransitionException if the transition is not permitted
     *
     * Requirements: 12.1
     */
    public void validate(SlotStatus from, SlotStatus to) {
        Set<SlotStatus> allowed = VALID_TRANSITIONS.getOrDefault(from, EnumSet.noneOf(SlotStatus.class));
        if (!allowed.contains(to)) {
            throw new InvalidStateTransitionException(
                    "Cannot transition slot from " + from + " to " + to);
        }
    }
}
