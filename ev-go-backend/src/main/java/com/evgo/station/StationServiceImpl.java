package com.evgo.station;

import com.evgo.exception.ResourceNotFoundException;
import com.evgo.station.dto.CreateStationRequest;
import com.evgo.station.dto.StationDto;
import com.evgo.station.dto.UpdateStationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of {@link StationService}.
 * 
 * <p>Proximity search strategy:
 * <ol>
 *   <li>Calculate bounding box from user location + radius</li>
 *   <li>Query DB for stations within bounding box (fast index scan)</li>
 *   <li>Calculate Haversine distance for each result</li>
 *   <li>Filter by radius and sort by distance</li>
 *   <li>Cache results (rounded coordinates for better cache hit rate)</li>
 * </ol>
 * 
 * <p>Cache strategy:
 * <ul>
 *   <li>Cache key: stations:{roundedLat}_{roundedLng}_{radius}</li>
 *   <li>Coordinates rounded to 2 decimals (≈1.1km buckets)</li>
 *   <li>TTL: 5 minutes</li>
 *   <li>Evicted on station create/update/delete</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StationServiceImpl implements StationService {
    
    private final StationRepository stationRepository;
    private final ConnectorTypeRepository connectorTypeRepository;
    
    private static final double EARTH_RADIUS_KM = 6371.0;
    
    @Override
    @Cacheable(
            value = "stations",
            key = "T(java.lang.Math).round(#latitude * 100) + '_' + " +
                  "T(java.lang.Math).round(#longitude * 100) + '_' + " +
                  "T(java.lang.Math).round(#radiusKm)"
    )
    public List<StationDto> searchNearby(double latitude, double longitude, double radiusKm) {
        
        log.debug("Searching stations near ({}, {}) within {}km", latitude, longitude, radiusKm);
        
        // Calculate bounding box (approximate, but fast)
        double latDelta = radiusKm / 111.0; // 1 degree lat ≈ 111km
        double lngDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(latitude)));
        
        BigDecimal minLat = BigDecimal.valueOf(latitude - latDelta);
        BigDecimal maxLat = BigDecimal.valueOf(latitude + latDelta);
        BigDecimal minLng = BigDecimal.valueOf(longitude - lngDelta);
        BigDecimal maxLng = BigDecimal.valueOf(longitude + lngDelta);
        
        // Query DB for stations in bounding box
        List<Station> candidates = stationRepository.findWithinBoundingBox(minLat, maxLat, minLng, maxLng);
        
        log.debug("Found {} candidates in bounding box", candidates.size());
        
        // Calculate Haversine distance, filter, and sort
        List<StationDto> results = candidates.stream()
                .map(station -> {
                    double distance = calculateDistance(
                            latitude, longitude,
                            station.getLatitude().doubleValue(),
                            station.getLongitude().doubleValue()
                    );
                    return toDto(station, distance);
                })
                .filter(dto -> dto.distanceKm() <= radiusKm) // Filter by actual distance
                .sorted((a, b) -> Double.compare(a.distanceKm(), b.distanceKm())) // Sort by nearest
                .toList();
        
        log.info("Found {} stations within {}km of ({}, {})", results.size(), radiusKm, latitude, longitude);
        
        return results;
    }
    
    @Override
    @Transactional(readOnly = true)
    public StationDto getById(Long id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station", id));
        return toDto(station, null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StationDto> getAllActive() {
        return stationRepository.findAll().stream()
                .filter(Station::isActive)
                .map(station -> toDto(station, null))
                .toList();
    }
    
    @Override
    @Transactional
    @CacheEvict(value = "stations", allEntries = true)
    public StationDto createStation(CreateStationRequest request) {
        
        log.info("Creating station: name={}, location=({}, {})", 
                 request.name(), request.latitude(), request.longitude());
        
        // Fetch or create connector types
        Set<ConnectorType> connectors = request.connectorTypes().stream()
                .map(code -> connectorTypeRepository.findByCode(code)
                        .orElseGet(() -> createConnectorType(code)))
                .collect(Collectors.toSet());
        
        // Build station entity
        Station station = Station.builder()
                .name(request.name())
                .address(request.address())
                .latitude(BigDecimal.valueOf(request.latitude()))
                .longitude(BigDecimal.valueOf(request.longitude()))
                .description(request.description())
                .totalSlots(request.totalSlots())
                .pricePerHour(request.pricePerHour())
                .isActive(true)
                .connectorTypes(connectors)
                .build();
        
        station = stationRepository.save(station);
        
        log.info("Station created: id={}, name={}", station.getId(), station.getName());
        
        return toDto(station, null);
    }
    
    @Override
    @Transactional
    @CacheEvict(value = "stations", allEntries = true)
    public StationDto updateStation(Long id, UpdateStationRequest request) {
        
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station", id));
        
        log.info("Updating station: id={}, name={}", id, station.getName());
        
        // Update only provided fields
        if (request.name() != null) {
            station.setName(request.name());
        }
        if (request.address() != null) {
            station.setAddress(request.address());
        }
        if (request.latitude() != null) {
            station.setLatitude(BigDecimal.valueOf(request.latitude()));
        }
        if (request.longitude() != null) {
            station.setLongitude(BigDecimal.valueOf(request.longitude()));
        }
        if (request.description() != null) {
            station.setDescription(request.description());
        }
        if (request.totalSlots() != null) {
            station.setTotalSlots(request.totalSlots());
        }
        if (request.pricePerHour() != null) {
            station.setPricePerHour(request.pricePerHour());
        }
        if (request.isActive() != null) {
            station.setActive(request.isActive());
        }
        if (request.connectorTypes() != null && !request.connectorTypes().isEmpty()) {
            Set<ConnectorType> connectors = request.connectorTypes().stream()
                    .map(code -> connectorTypeRepository.findByCode(code)
                            .orElseGet(() -> createConnectorType(code)))
                    .collect(Collectors.toSet());
            station.setConnectorTypes(connectors);
        }
        
        station = stationRepository.save(station);
        
        log.info("Station updated: id={}", id);
        
        return toDto(station, null);
    }
    
    @Override
    @Transactional
    @CacheEvict(value = "stations", allEntries = true)
    public void deleteStation(Long id) {
        
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station", id));
        
        station.setActive(false);
        stationRepository.save(station);
        
        log.info("Station soft-deleted: id={}, name={}", id, station.getName());
    }
    
    /**
     * Calculate Haversine distance between two points (in kilometers).
     * 
     * @param lat1 Latitude of point 1
     * @param lng1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lng2 Longitude of point 2
     * @return Distance in kilometers
     */
    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
    
    /**
     * Convert Station entity to DTO.
     * 
     * @param station Station entity
     * @param distanceKm Distance from search point (null if not searched)
     * @return StationDto
     */
    private StationDto toDto(Station station, Double distanceKm) {
        List<String> connectorCodes = station.getConnectorTypes().stream()
                .map(ConnectorType::getCode)
                .sorted()
                .toList();
        
        return new StationDto(
                station.getId(),
                station.getName(),
                station.getAddress(),
                station.getLatitude().doubleValue(),
                station.getLongitude().doubleValue(),
                station.getDescription(),
                station.getTotalSlots(),
                station.getPricePerHour(),
                station.isActive(),
                connectorCodes,
                distanceKm
        );
    }
    
    /**
     * Create a new connector type if it doesn't exist.
     * 
     * @param code Connector type code
     * @return Created or existing connector type
     */
    private ConnectorType createConnectorType(String code) {
        ConnectorType connector = ConnectorType.builder()
                .code(code)
                .name(code) // Use code as name for now
                .isActive(true)
                .build();
        
        connectorTypeRepository.save(connector);
        
        log.info("Created connector type: code={}", code);
        
        return connector;
    }
}
