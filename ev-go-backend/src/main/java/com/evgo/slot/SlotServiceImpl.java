package com.evgo.slot;

import com.evgo.exception.ResourceNotFoundException;
import com.evgo.slot.dto.GenerateSlotsRequest;
import com.evgo.slot.dto.GenerateSlotsResponse;
import com.evgo.slot.dto.SlotDto;
import com.evgo.station.Station;
import com.evgo.station.StationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of {@link SlotService}.
 * 
 * <p>Slot generation strategy:
 * <ul>
 *   <li>Idempotent: checks if slot exists before creating</li>
 *   <li>Respects operating hours (default: 00:00 - 23:59)</li>
 *   <li>Configurable slot duration (default: 60 minutes)</li>
 *   <li>Clears cache after generation</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SlotServiceImpl implements SlotService {
    
    private final SlotRepository slotRepository;
    private final StationRepository stationRepository;
    
    @Override
    @Cacheable(
            value = "slots",
            key = "#stationId + '_' + #date.toString()"
    )
    @Transactional(readOnly = true)
    public List<SlotDto> getAvailableSlots(Long stationId, LocalDate date) {
        
        log.debug("Fetching available slots: stationId={}, date={}", stationId, date);
        
        List<Slot> slots = slotRepository.findAvailableByStationAndDate(stationId, date);
        
        log.debug("Found {} available slots", slots.size());
        
        return slots.stream()
                .map(this::toDto)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SlotDto> getAllSlots(Long stationId, LocalDate date) {
        
        List<Slot> slots = slotRepository.findByStationAndDate(stationId, date);
        
        return slots.stream()
                .map(this::toDto)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public SlotDto getById(Long id) {
        Slot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Slot", id));
        return toDto(slot);
    }
    
    @Override
    @Transactional
    @CacheEvict(value = "slots", allEntries = true)
    public GenerateSlotsResponse generateSlots(GenerateSlotsRequest request) {
        
        log.info("Generating slots: stationId={}, startDate={}, endDate={}, duration={}min",
                 request.stationId(), request.startDate(), request.endDate(), 
                 request.slotDurationMinutes());
        
        // Validate station exists
        Station station = stationRepository.findById(request.stationId())
                .orElseThrow(() -> new ResourceNotFoundException("Station", request.stationId()));
        
        // Validate date range
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        
        // Validate operating hours
        if (request.operatingHoursEnd() <= request.operatingHoursStart()) {
            throw new IllegalArgumentException("Operating hours end must be after start");
        }
        
        int slotsCreated = 0;
        int slotsSkipped = 0;
        
        List<Slot> newSlots = new ArrayList<>();
        
        // Iterate through each date
        LocalDate currentDate = request.startDate();
        while (!currentDate.isAfter(request.endDate())) {
            
            // Generate slots for this date
            LocalTime slotTime = LocalTime.of(request.operatingHoursStart(), 0);
            LocalTime endTime = LocalTime.of(
                    request.operatingHoursEnd() == 24 ? 23 : request.operatingHoursEnd(),
                    request.operatingHoursEnd() == 24 ? 59 : 0
            );
            
            while (slotTime.isBefore(endTime)) {
                
                // Check if slot already exists (idempotency)
                if (slotRepository.existsByStationIdAndSlotDateAndStartTime(
                        station.getId(), currentDate, slotTime)) {
                    slotsSkipped++;
                } else {
                    LocalTime slotEndTime = slotTime.plusMinutes(request.slotDurationMinutes());
                    
                    Slot slot = Slot.builder()
                            .station(station)
                            .slotDate(currentDate)
                            .startTime(slotTime)
                            .endTime(slotEndTime)
                            .status(SlotStatus.AVAILABLE)
                            .build();
                    
                    newSlots.add(slot);
                    slotsCreated++;
                }
                
                // Move to next slot
                slotTime = slotTime.plusMinutes(request.slotDurationMinutes());
            }
            
            currentDate = currentDate.plusDays(1);
        }
        
        // Batch save for efficiency
        if (!newSlots.isEmpty()) {
            slotRepository.saveAll(newSlots);
        }
        
        log.info("Slot generation complete: stationId={}, created={}, skipped={}", 
                 request.stationId(), slotsCreated, slotsSkipped);
        
        String message = String.format(
                "Generated %d slots for station %s (%d skipped, already exist)",
                slotsCreated, station.getName(), slotsSkipped
        );
        
        return new GenerateSlotsResponse(
                station.getId(),
                slotsCreated,
                slotsSkipped,
                message
        );
    }
    
    /**
     * Convert Slot entity to DTO.
     */
    private SlotDto toDto(Slot slot) {
        return new SlotDto(
                slot.getId(),
                slot.getStation().getId(),
                slot.getStation().getName(),
                slot.getSlotDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getStatus()
        );
    }
}
