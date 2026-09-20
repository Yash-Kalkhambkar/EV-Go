package com.evgo.admin;

import com.evgo.station.Station;
import com.evgo.station.StationRepository;
import com.evgo.station.dto.StationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of {@link AdminStationQueryService}.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminStationQueryServiceImpl implements AdminStationQueryService {
    
    private final StationRepository stationRepository;
    
    @Override
    @Transactional(readOnly = true)
    public Page<StationDto> listStations(Pageable pageable, Boolean active) {
        
        log.debug("Admin querying stations: page={}, size={}, active={}", 
                  pageable.getPageNumber(), pageable.getPageSize(), active);
        
        Page<Station> stations;
        
        if (active != null) {
            stations = stationRepository.findByIsActive(active, pageable);
        } else {
            stations = stationRepository.findAll(pageable);
        }
        
        return stations.map(this::toDto);
    }
    
    /**
     * Convert Station entity to DTO.
     */
    private StationDto toDto(Station station) {
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
                station.getConnectorTypes().stream()
                        .sorted()
                        .toList(),
                null // No distance for admin list
        );
    }
}
