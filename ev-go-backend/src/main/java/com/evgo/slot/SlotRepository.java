package com.evgo.slot;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Slot} entities.
 *
 * <p>Provides a pessimistic-write lock variant of {@code findById} used during
 * booking creation to prevent concurrent modifications to the same slot row.
 *
 * Requirements: 1.1, 2.2, 12.1
 */
@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    /**
     * Loads a slot by ID with a {@code SELECT … FOR UPDATE} pessimistic write lock.
     *
     * <p>This is the second tier of the two-tier locking strategy:
     * <ol>
     *   <li>Redis distributed lock (first tier) – fast, cross-instance coordination</li>
     *   <li>DB pessimistic lock (second tier) – correctness guarantee at the DB level</li>
     * </ol>
     *
     * <p>Must be called within an active transaction.
     *
     * @param id the slot ID
     * @return the locked slot, or empty if not found
     *
     * Requirements: 1.1, 2.2
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdWithLock(@Param("id") Long id);
}
