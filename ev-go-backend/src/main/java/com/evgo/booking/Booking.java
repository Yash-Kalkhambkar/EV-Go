package com.evgo.booking;

import com.evgo.slot.Slot;
import com.evgo.station.Station;
import com.evgo.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * JPA entity representing a booking for a charging slot.
 *
 * <p>Maps to the {@code bookings} table. A booking ties a user to a specific slot
 * at a station and tracks the full payment lifecycle via {@link BookingStatus}.
 *
 * <p>Booking status lifecycle:
 * <pre>
 *   PENDING   → CONFIRMED  (Razorpay payment verified)
 *   PENDING   → CANCELLED  (payment failed, timeout, or user cancelled before paying)
 *   CONFIRMED → CANCELLED  (user cancelled within policy window)
 *   CONFIRMED → COMPLETED  (slot time has passed)
 *   CANCELLED → (terminal)
 *   COMPLETED → (terminal)
 * </pre>
 *
 * Requirements: 1.1, 1.6, 2.2, 11.1, 11.2, 11.3, 11.4
 */
@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "total_amount", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @CreationTimestamp
    @Column(name = "booked_at", nullable = false, updatable = false)
    private Instant bookedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /** Set when the booking is cancelled; null otherwise. */
    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    /** Human-readable reason for cancellation; null if not cancelled. */
    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    /** Amount to be refunded; null if no refund applies. */
    @Column(name = "refund_amount", precision = 8, scale = 2)
    private BigDecimal refundAmount;
}
