package com.evgo.slot;

import com.evgo.slot.dto.GenerateSlotsRequest;
import com.evgo.slot.dto.GenerateSlotsResponse;
import com.evgo.slot.dto.SlotDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for charging slot management.
 * 
 * <p>Endpoints:
 * <ul>
 *   <li>GET /api/slots?stationId={id}&date={date} - Get available slots (public)</li>
 *   <li>GET /api/slots/{id} - Get slot by ID (public)</li>
 *   <li>GET /api/slots/all?stationId={id}&date={date} - Get all slots (admin)</li>
 *   <li>POST /api/slots/generate - Generate slots (admin)</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@Slf4j
public class SlotController {
    
    private final SlotService slotService;
    
    /**
     * Get available slots for a station on a specific date.
     * 
     * <p>Example: GET /api/slots?stationId=123&date=2026-09-20
     * 
     * @param stationId Station ID (required)
     * @param date Date to check (required, format: yyyy-MM-dd)
     * @return List of available slots, sorted by start time
     */
    @GetMapping
    public ResponseEntity<List<SlotDto>> getAvailableSlots(
            @RequestParam @NotNull(message = "Station ID is required") Long stationId,
            @RequestParam @NotNull(message = "Date is required") 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.debug("Fetching available slots: stationId={}, date={}", stationId, date);
        
        List<SlotDto> slots = slotService.getAvailableSlots(stationId, date);
        
        return ResponseEntity.ok(slots);
    }
    
    /**
     * Get all slots (available + booked) for a station on a date (admin only).
     * 
     * <p>Example: GET /api/slots/all?stationId=123&date=2026-09-20
     * 
     * @param stationId Station ID (required)
     * @param date Date to check (required, format: yyyy-MM-dd)
     * @return List of all slots, sorted by start time
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SlotDto>> getAllSlots(
            @RequestParam @NotNull(message = "Station ID is required") Long stationId,
            @RequestParam @NotNull(message = "Date is required") 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        log.debug("Fetching all slots: stationId={}, date={} (admin)", stationId, date);
        
        List<SlotDto> slots = slotService.getAllSlots(stationId, date);
        
        return ResponseEntity.ok(slots);
    }
    
    /**
     * Get slot by ID.
     * 
     * <p>Example: GET /api/slots/456
     * 
     * @param id Slot ID
     * @return Slot DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<SlotDto> getById(@PathVariable Long id) {
        
        log.debug("Fetching slot: id={}", id);
        
        SlotDto slot = slotService.getById(id);
        
        return ResponseEntity.ok(slot);
    }
    
    /**
     * Generate slots for a station (admin only).
     * Idempotent: skips existing slots, creates only missing ones.
     * 
     * <p>Example request:
     * <pre>{@code
     * POST /api/slots/generate
     * {
     *   "stationId": 123,
     *   "startDate": "2026-09-15",
     *   "endDate": "2026-09-30",
     *   "slotDurationMinutes": 60,
     *   "operatingHoursStart": 8,
     *   "operatingHoursEnd": 20
     * }
     * }</pre>
     * 
     * <p>Example response:
     * <pre>{@code
     * {
     *   "stationId": 123,
     *   "slotsCreated": 192,
     *   "slotsSkipped": 0,
     *   "message": "Generated 192 slots for station Delhi Central Mall (0 skipped, already exist)"
     * }
     * }</pre>
     * 
     * @param request Generate request
     * @return Generation result with counts
     */
    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GenerateSlotsResponse> generateSlots(
            @Valid @RequestBody GenerateSlotsRequest request) {
        
        log.info("Generating slots: stationId={}, startDate={}, endDate={}",
                 request.stationId(), request.startDate(), request.endDate());
        
        GenerateSlotsResponse response = slotService.generateSlots(request);
        
        return ResponseEntity.ok(response);
    }
}
