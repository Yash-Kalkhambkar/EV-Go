package com.evgo.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Payment} entities.
 *
 * Requirements: 5.1, 6.2
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Finds the payment record associated with a booking.
     *
     * @param bookingId the booking ID
     * @return the payment for the booking, if any
     */
    Optional<Payment> findByBookingId(Long bookingId);
}
