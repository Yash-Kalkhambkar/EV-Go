package com.evgo.station;

import jakarta.persistence.*;
import lombok.*;

/**
 * Connector type entity (e.g., CCS2, CHAdeMO, Type 2).
 * 
 * <p>Many-to-many relationship with Station.
 * Each station can have multiple connector types.
 * 
 * <p>Standard connector types:
 * <ul>
 *   <li>CCS2 (Combined Charging System) - Most common in Europe/India</li>
 *   <li>CHAdeMO - Japanese standard</li>
 *   <li>Type 2 (IEC 62196) - AC charging</li>
 *   <li>GB/T - Chinese standard</li>
 * </ul>
 */
@Entity
@Table(name = "connector_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ConnectorType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    
    /**
     * Connector type code (e.g., "CCS2", "CHAdeMO").
     * Unique identifier.
     */
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    
    /**
     * Display name (e.g., "CCS2 (Combined Charging System)").
     */
    @Column(nullable = false, length = 100)
    private String name;
    
    /**
     * Optional description.
     */
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * Whether this connector type is active (soft delete).
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
