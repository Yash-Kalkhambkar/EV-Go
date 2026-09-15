package com.evgo.station;

import com.evgo.station.dto.CreateStationRequest;
import com.evgo.station.dto.StationDto;
import com.evgo.station.dto.UpdateStationRequest;

import java.util.List;

/**
 * Service for managing charging stations.
 */
public interface StationService {
    
    /**
     * Search for stations near a location (proximity search).
     * Uses bounding box query + Haversine distance calculation.
     * Results are cached in Redis (5 min TTL, rounded coordinates).
     * 
     * @param latitude User's latitude
     * @param longitude User's longitude
     * @param radiusKm Search radius in kilometers
     * @return List of stations with distance, sorted by nearest first
     */
    List<StationDto> searchNearby(double latitude, double longitude, double radiusKm);
    
    /**
     * Get station by ID.
     * 
     * @param id Station ID
     * @return Station DTO
     * @throws com.evgo.exception.ResourceNotFoundException if not found
     */
    StationDto getById(Long id);
    
    /**
     * Get all active stations (admin endpoint).
     * 
     * @return List of all active stations
     */
    List<StationDto> getAllActive();
    
    /**
     * Create a new charging station (admin only).
     * 
     * @param request Create request
     * @return Created station DTO
     */
    StationDto createStation(CreateStationRequest request);
    
    /**
     * Update a charging station (admin only).
     * Only provided fields are updated (partial update).
     * Clears cache after update.
     * 
     * @param id Station ID
     * @param request Update request
     * @return Updated station DTO
     * @throws com.evgo.exception.ResourceNotFoundException if not found
     */
    StationDto updateStation(Long id, UpdateStationRequest request);
    
    /**
     * Soft-delete a station (admin only).
     * Sets isActive = false, clears cache.
     * 
     * @param id Station ID
     * @throws com.evgo.exception.ResourceNotFoundException if not found
     */
    void deleteStation(Long id);
}
