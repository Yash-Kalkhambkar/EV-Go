package com.evgo.admin;

import com.evgo.station.StationService;
import com.evgo.station.dto.CreateStationRequest;
import com.evgo.station.dto.StationDto;
import com.evgo.station.dto.UpdateStationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin controller for station management.
 * All endpoints require ADMIN role.
 * 
 * <p>Endpoints:
 * <ul>
 *   <li>GET /api/admin/stations - List all stations (paginated)</li>
 *   <li>GET /api/admin/stations/{id} - Get station details</li>
 *   <li>POST /api/admin/stations - Create station</li>
 *   <li>PUT /api/admin/stations/{id} - Update station</li>
 *   <li>DELETE /api/admin/stations/{id} - Soft-delete station</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/admin/stations")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminStationController {
    
    private final StationService stationService;
    private final AdminStationQueryService adminStationQueryService;
    
    /**
     * List all stations with pagination and filtering.
     * 
     * <p>Example: GET /api/admin/stations?page=0&size=20&sort=createdAt,desc&active=true
     * 
     * @param pageable Pagination parameters
     * @param active Filter by active status (optional)
     * @return Paginated list of stations
     */
    @GetMapping
    public ResponseEntity<Page<StationDto>> listStations(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) Boolean active) {
        
        log.debug("Admin listing stations: page={}, size={}, active={}", 
                  pageable.getPageNumber(), pageable.getPageSize(), active);
        
        Page<StationDto> stations = adminStationQueryService.listStations(pageable, active);
        
        return ResponseEntity.ok(stations);
    }
    
    /**
     * Get station details by ID.
     * 
     * @param id Station ID
     * @return Station DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<StationDto> getStation(@PathVariable Long id) {
        
        log.debug("Admin getting station: id={}", id);
        
        StationDto station = stationService.getById(id);
        
        return ResponseEntity.ok(station);
    }
    
    /**
     * Create a new station.
     * 
     * @param request Create station request
     * @return Created station
     */
    @PostMapping
    public ResponseEntity<StationDto> createStation(@Valid @RequestBody CreateStationRequest request) {
        
        log.info("Admin creating station: name={}", request.name());
        
        StationDto station = stationService.createStation(request);
        
        return ResponseEntity.ok(station);
    }
    
    /**
     * Update a station.
     * 
     * @param id Station ID
     * @param request Update request
     * @return Updated station
     */
    @PutMapping("/{id}")
    public ResponseEntity<StationDto> updateStation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStationRequest request) {
        
        log.info("Admin updating station: id={}", id);
        
        StationDto station = stationService.updateStation(id, request);
        
        return ResponseEntity.ok(station);
    }
    
    /**
     * Soft-delete a station (sets isActive = false).
     * 
     * @param id Station ID
     * @return No content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
        
        log.info("Admin deleting station: id={}", id);
        
        stationService.deleteStation(id);
        
        return ResponseEntity.noContent().build();
    }
}
