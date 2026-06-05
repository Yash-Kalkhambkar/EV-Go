package com.evgo.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Spring Data JPA repository for {@link Refund} entities.
 *
 * Requirements: 6.6, 6.7, 7.1
 */
@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {

    /**
     * Returns all refund attempts for a given payment.
     * Multiple entries may exist if earlier attempts failed and were retried.
     *
     * @param paymentId the payment ID
     * @return list of refund records, ordered by creation time (ascending)
     */
    List<Refund> findByPaymentId(Long paymentId);

    /**
     * Counts refund records with the given status whose {@code createdAt}
     * timestamp is strictly after {@code after}.
     *
     * <p>Used by the refund failure-rate monitor to count failed refunds in a
     * rolling time window.
     *
     * @param status the refund status string (e.g. {@code "FAILED"})
     * @param after  the lower bound (exclusive) for {@code createdAt}
     * @return number of matching refund records
     *
     * Requirements: 6.7
     */
    long countByStatusAndCreatedAtAfter(String status, Instant after);

    /**
     * Counts all refund records whose {@code createdAt} timestamp is strictly
     * after {@code after}.
     *
     * <p>Used by the refund failure-rate monitor to compute the denominator of
     * the failure rate.
     *
     * @param after the lower bound (exclusive) for {@code createdAt}
     * @return total number of refund records in the time window
     *
     * Requirements: 6.7
     */
    long countByCreatedAtAfter(Instant after);
}
