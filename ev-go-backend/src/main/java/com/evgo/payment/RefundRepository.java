package com.evgo.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link Refund} entities.
 *
 * Requirements: 6.6, 7.1
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
}
