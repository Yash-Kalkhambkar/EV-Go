package com.evgo.admin;

import com.evgo.booking.dto.BookingDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for admin booking management.
 *
 * <p>Endpoints:
 * <ul>
 *   <li>GET /api/admin/bookings - List all bookings (paginated, filterable by status)</li>
 *   <li>GET /api/admin/bookings/{id} - Get booking details by ID</li>
 * </ul>
 *
 * <p>Authentication: Requires ROLE_ADMIN.
 *
 * Requirements: 11.x (admin booking visibility)
 */
@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@Slf4j
public class AdminBookingController {

    private final AdminBookingQueryService adminBookingQueryService;

    /**
     * List all bookings across all users (admin only).
     *
     * <p>Supports pagination and filtering by booking status.
     *
     * <p>Example: GET /api/admin/bookings?page=0&size=20&status=CONFIRMED
     *
     * @param pageable Pagination params (default: page 0, size 20, sort by bookedAt desc)
     * @param status Optional filter by booking status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
     * @return Paginated list of bookings
     */
    @GetMapping
    public ResponseEntity<Page<BookingDto>> listBookings(
            @PageableDefault(size = 20, sort = "bookedAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String status) {

        log.info("Admin fetching bookings: page={}, size={}, status={}", 
                 pageable.getPageNumber(), pageable.getPageSize(), status);

        Page<BookingDto> bookings = adminBookingQueryService.listBookings(pageable, status);

        return ResponseEntity.ok(bookings);
    }

    /**
     * Get booking details by ID (admin only).
     *
     * <p>Returns full booking details including user info, slot info, station info.
     *
     * <p>Example: GET /api/admin/bookings/123
     *
     * @param id Booking ID
     * @return Booking details
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBooking(@PathVariable Long id) {

        log.debug("Admin fetching booking: bookingId={}", id);

        BookingDto booking = adminBookingQueryService.getBookingById(id);

        return ResponseEntity.ok(booking);
    }
}
