package com.evgo.admin;

import com.evgo.station.dto.StationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Query service for admin station operations.
 * Provides paginated and filtered views for admin dashboard.
 */
public interface AdminStationQueryService {
    
    /**
     * List all stations with pagination and optional active filter.
     * 
     * @param pageable Pagination parameters
     * @param active Filter by active status (null = all stations)
     * @return Paginated list of stations
     */
    Page<StationDto> listStations(Pageable pageable, Boolean active);
}
