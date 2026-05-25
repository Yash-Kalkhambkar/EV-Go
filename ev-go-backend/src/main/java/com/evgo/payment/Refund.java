package com.evgo.payment;

import com.evgo.booking.Booking;
import com.evgo.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * JPA entity representing a refund record for a payment.
 *
 * <p>Maps to the {@code refunds} table. A refund is initiated when a confirmed
 * booking is cancelled. Multiple refund attempts may exist for the same payment
 * (tracked via {@code retryCount}).
 *
 * Requirements: 6.6, 7.1, 7.2
 */
@Entity
@Table(name = "refunds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    /** Razorpay refund ID returned after a successful refund initiation. */
    @Column(name = "razorpay_refund_id", length = 100)
    private String razorpayRefundId;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal amount;

    @Column(length = 500)
    private String reason;

    /** Refund processing status (e.g. PENDING, PROCESSED, FAILED). */
    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING";

    /** Admin or system user who initiated the refund; null for automated refunds. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiated_by")
    private User initiatedBy;

    /** Number of times this refund has been retried after failure. */
    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private int retryCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
