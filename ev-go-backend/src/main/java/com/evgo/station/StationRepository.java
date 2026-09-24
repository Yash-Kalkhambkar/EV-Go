package com.evgo.station;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Spring Data JPA repository for {@link Station} entities.
 *
 * <p>Proximity search uses a bounding-box JPQL query on latitude/longitude.
 * After fetching results, Haversine distance is calculated in the application
 * layer and used to sort by actual distance. This avoids the PostGIS dependency
 * while being accurate enough for v1.
 *
 * Requirements: 9.1, 10.1
 */
@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    /**
     * Find station by ID with connector types eagerly loaded.
     */
    @Query("SELECT s FROM Station s LEFT JOIN FETCH s.connectorTypes WHERE s.id = :id")
    Station findByIdWithConnectors(@Param("id") Long id);

    /**
     * Returns all active stations within the given lat/lng bounding box.
     *
     * <p>The bounding box is computed from the user's location + search radius
     * in {@code StationService}. Results are then sorted by Haversine distance
     * in the application layer.
     *
     * @param minLat southern boundary latitude
     * @param maxLat northern boundary latitude
     * @param minLng western boundary longitude
     * @param maxLng eastern boundary longitude
     * @return active stations within the bounding box
     */
    @Query("""
            SELECT s FROM Station s
            LEFT JOIN FETCH s.connectorTypes
            WHERE s.latitude  BETWEEN :minLat AND :maxLat
              AND s.longitude BETWEEN :minLng AND :maxLng
              AND s.isActive = true
            """)
    List<Station> findWithinBoundingBox(
            @Param("minLat") BigDecimal minLat,
            @Param("maxLat") BigDecimal maxLat,
            @Param("minLng") BigDecimal minLng,
            @Param("maxLng") BigDecimal maxLng
    );
    
    /**
     * Find stations by active status with pagination.
     * Used by admin dashboard for filtering.
     */
    Page<Station> findByIsActive(boolean isActive, Pageable pageable);
}
