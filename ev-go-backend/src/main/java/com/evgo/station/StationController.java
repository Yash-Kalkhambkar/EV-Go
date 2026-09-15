package com.evgo.station;

import com.evgo.station.dto.CreateStationRequest;
import com.evgo.station.dto.StationDto;
import com.evgo.station.dto.UpdateStationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for charging station management.
 * 
 * <p>Endpoints:
 * <ul>
 *   <li>GET /api/stations/search - Search nearby stations (public)</li>
 *   <li>GET /api/stations/{id} - Get station by ID (public)</li>
 *   <li>GET /api/stations - Get all active stations (admin)</li>
 *   <li>POST /api/stations - Create station (admin)</li>
 *   <li>PUT /api/stations/{id} - Update station (admin)</li>
 *   <li>DELETE /api/stations/{id} - Soft-delete station (admin)</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
@Slf4j
public class StationController {
    
    private final StationService stationService;
    
    /**
     * Search for stations near a location.
     * 
     * <p>Example: GET /api/stations/search?latitude=28.6139&longitude=77.2090&radius=5
     * 
     * @param latitude User's latitude (-90 to 90)
     * @param longitude User's longitude (-180 to 180)
     * @param radius Search radius in kilometers (default: 10km, max: 100km)
     * @return List of stations with distance, sorted by nearest first
     */
    @GetMapping("/search")
    public ResponseEntity<List<StationDto>> searchNearby(
            @RequestParam 
            @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
            @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
            double latitude,
            
            @RequestParam
            @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
            @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
            double longitude,
            
            @RequestParam(defaultValue = "10")
            @Positive(message = "Radius must be positive")
            @DecimalMax(value = "100.0", message = "Radius must be <= 100km")
            double radius) {
        
        log.debug("Searching stations: lat={}, lng={}, radius={}km", latitude, longitude, radius);
        
        List<StationDto> stations = stationService.searchNearby(latitude, longitude, radius);
        
        return ResponseEntity.ok(stations);
    }
    
    /**
     * Get station by ID.
     * 
     * <p>Example: GET /api/stations/123
     * 
     * @param id Station ID
     * @return Station DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<StationDto> getById(@PathVariable Long id) {
        
        log.debug("Fetching station: id={}", id);
        
        StationDto station = stationService.getById(id);
        
        return ResponseEntity.ok(station);
    }
    
    /**
     * Get all active stations (admin only).
     * 
     * <p>Example: GET /api/stations
     * 
     * @return List of all active stations
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StationDto>> getAllActive() {
        
        log.debug("Fetching all active stations (admin)");
        
        List<StationDto> stations = stationService.getAllActive();
        
        return ResponseEntity.ok(stations);
    }
    
    /**
     * Create a new charging station (admin only).
     * 
     * <p>Example request:
     * <pre>{@code
     * POST /api/stations
     * {
     *   "name": "Delhi Central Mall",
     *   "address": "Connaught Place, New Delhi",
     *   "latitude": 28.6304,
     *   "longitude": 77.2177,
     *   "description": "Fast charging station with 4 slots",
     *   "totalSlots": 4,
     *   "pricePerHour": 50.00,
     *   "connectorTypes": ["CCS2", "CHAdeMO"]
     * }
     * }</pre>
     * 
     * @param request Create request
     * @return Created station DTO
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationDto> createStation(@Valid @RequestBody CreateStationRequest request) {
        
        log.info("Creating station: name={}", request.name());
        
        StationDto station = stationService.createStation(request);
        
        return ResponseEntity.ok(station);
    }
    
    /**
     * Update a charging station (admin only).
     * Partial update: only provided fields are updated.
     * 
     * <p>Example request:
     * <pre>{@code
     * PUT /api/stations/123
     * {
     *   "pricePerHour": 60.00,
     *   "isActive": true
     * }
     * }</pre>
     * 
     * @param id Station ID
     * @param request Update request
     * @return Updated station DTO
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StationDto> updateStation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStationRequest request) {
        
        log.info("Updating station: id={}", id);
        
        StationDto station = stationService.updateStation(id, request);
        
        return ResponseEntity.ok(station);
    }
    
    /**
     * Soft-delete a station (admin only).
     * Sets isActive = false, clears cache.
     * 
     * <p>Example: DELETE /api/stations/123
     * 
     * @param id Station ID
     * @return No content
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
        
        log.info("Deleting station: id={}", id);
        
        stationService.deleteStation(id);
        
        return ResponseEntity.noContent().build();
    }
}
