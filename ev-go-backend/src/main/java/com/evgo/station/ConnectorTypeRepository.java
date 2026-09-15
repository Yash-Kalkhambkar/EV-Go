package com.evgo.station;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link ConnectorType} entity.
 */
@Repository
public interface ConnectorTypeRepository extends JpaRepository<ConnectorType, Long> {
    
    /**
     * Find connector type by code (e.g., "CCS2").
     */
    Optional<ConnectorType> findByCode(String code);
    
    /**
     * Find all active connector types.
     */
    List<ConnectorType> findByIsActiveTrue();
    
    /**
     * Find connector types by codes (bulk lookup).
     */
    List<ConnectorType> findByCodeIn(List<String> codes);
}
