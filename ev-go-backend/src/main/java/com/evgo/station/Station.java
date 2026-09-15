package com.evgo.station;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * JPA entity representing an EV charging station.
 *
 * <p>Maps to the {@code stations} table. Proximity search uses a bounding-box
 * query on {@code latitude}/{@code longitude} followed by Haversine distance
 * calculation in the application layer.
 *
 * Requirements: 9.1 (station caching), 10.1 (slot generation)
 */
@Entity
@Table(name = "stations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 300)
    private String address;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_slots", nullable = false)
    @Builder.Default
    private int totalSlots = 0;

    @Column(name = "price_per_hour", nullable = false, precision = 8, scale = 2)
    private BigDecimal pricePerHour;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    /**
     * Connector types supported by this station (many-to-many).
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "station_connectors",
            joinColumns = @JoinColumn(name = "station_id"),
            inverseJoinColumns = @JoinColumn(name = "connector_type_id")
    )
    @Builder.Default
    private Set<ConnectorType> connectorTypes = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
