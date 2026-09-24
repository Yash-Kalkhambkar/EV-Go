package com.evgo.slot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

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
     * Find slot by ID with station eagerly loaded.
     */
    @Query("SELECT s FROM Slot s JOIN FETCH s.station WHERE s.id = :id")
    Optional<Slot> findByIdWithStation(@Param("id") Long id);

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
    @Query("SELECT s FROM Slot s JOIN FETCH s.station WHERE s.id = :id")
    Optional<Slot> findByIdWithLock(@Param("id") Long id);
    
    /**
     * Find all slots for a station on a specific date.
     * Used for availability queries and admin dashboards.
     * 
     * @param stationId Station ID
     * @param date Slot date
     * @return List of slots for this date
     */
    @Query("""
            SELECT s FROM Slot s
            JOIN FETCH s.station
            WHERE s.station.id = :stationId
              AND s.slotDate = :date
            ORDER BY s.startTime ASC
            """)
    List<Slot> findByStationAndDate(
            @Param("stationId") Long stationId,
            @Param("date") LocalDate date
    );
    
    /**
     * Find available slots (status = AVAILABLE) for a station on a date.
     * 
     * @param stationId Station ID
     * @param date Slot date
     * @return List of available slots
     */
    @Query("""
            SELECT s FROM Slot s
            JOIN FETCH s.station
            WHERE s.station.id = :stationId
              AND s.slotDate = :date
              AND s.status = com.evgo.slot.SlotStatus.AVAILABLE
            ORDER BY s.startTime ASC
            """)
    List<Slot> findAvailableByStationAndDate(
            @Param("stationId") Long stationId,
            @Param("date") LocalDate date
    );
    
    /**
     * Check if a slot already exists for a station at a specific date/time.
     * Used during slot generation to avoid duplicates (idempotency).
     * 
     * @param stationId Station ID
     * @param slotDate Slot date
     * @param startTime Start time
     * @return true if slot exists
     */
    boolean existsByStationIdAndSlotDateAndStartTime(Long stationId, LocalDate slotDate, LocalTime startTime);
}
