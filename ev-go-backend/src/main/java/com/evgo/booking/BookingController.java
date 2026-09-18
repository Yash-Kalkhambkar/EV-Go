package com.evgo.booking;

import com.evgo.booking.dto.BookingDto;
import com.evgo.booking.dto.CancelBookingRequest;
import com.evgo.booking.dto.CreateBookingRequest;
import com.evgo.booking.dto.UserBookingsResponse;
import com.evgo.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for booking management.
 * 
 * <p>Endpoints:
 * <ul>
 *   <li>POST /api/bookings - Create a new booking (authenticated)</li>
 *   <li>GET /api/bookings/{id} - Get booking by ID (authenticated)</li>
 *   <li>GET /api/bookings/my - Get current user's bookings (authenticated)</li>
 *   <li>POST /api/bookings/{id}/cancel - Cancel a booking (authenticated)</li>
 * </ul>
 * 
 * <p>Authentication: All endpoints require JWT authentication.
 * User ID is extracted from the security context.
 * 
 * Requirements: 1.1, 1.6, 2.2, 11.2, 11.5
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {
    
    private final BookingService bookingService;
    private final BookingQueryService bookingQueryService;
    
    /**
     * Create a new booking for a charging slot.
     * 
     * <p>Flow:
     * <ol>
     *   <li>Acquire Redis distributed lock on the slot</li>
     *   <li>Check slot availability (status = AVAILABLE)</li>
     *   <li>Create booking with status = PENDING</li>
     *   <li>Update slot status = RESERVED</li>
     *   <li>Return booking with Razorpay order ID for payment</li>
     * </ol>
     * 
     * <p>Example request:
     * <pre>{@code
     * POST /api/bookings
     * Authorization: Bearer {jwt}
     * 
     * {
     *   "slotId": 1001
     * }
     * }</pre>
     * 
     * <p>Example response:
     * <pre>{@code
     * {
     *   "id": 5001,
     *   "userId": 123,
     *   "slotId": 1001,
     *   "stationId": 1,
     *   "status": "PENDING",
     *   "totalAmount": 50.00,
     *   "razorpayOrderId": "order_MxK1aB2cD3eF4g",
     *   "bookedAt": "2026-09-15T10:30:00Z"
     * }
     * }</pre>
     * 
     * @param request Create booking request (contains slotId)
     * @param user Authenticated user (from JWT)
     * @return Created booking DTO
     */
    @PostMapping
    public ResponseEntity<BookingDto> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal User user) {
        
        log.info("Creating booking: slotId={}, userId={}", request.slotId(), user.getId());
        
        BookingDto booking = bookingService.createBooking(request, user.getId());
        
        log.info("Booking created: bookingId={}, status={}", booking.id(), booking.status());
        
        return ResponseEntity.ok(booking);
    }
    
    /**
     * Get booking by ID.
     * User can only view their own bookings (unless admin).
     * 
     * <p>Example: GET /api/bookings/5001
     * 
     * @param id Booking ID
     * @param user Authenticated user (from JWT)
     * @return Booking DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingDto> getBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        
        log.debug("Fetching booking: bookingId={}, userId={}", id, user.getId());
        
        BookingDto booking = bookingQueryService.getBookingById(id, user.getId());
        
        return ResponseEntity.ok(booking);
    }
    
    /**
     * Get all bookings for the current user.
     * 
     * <p>Returns bookings grouped by status for easy UI rendering:
     * <ul>
     *   <li>Upcoming: CONFIRMED bookings with future slot times</li>
     *   <li>Pending: PENDING bookings awaiting payment</li>
     *   <li>Past: COMPLETED bookings</li>
     *   <li>Cancelled: CANCELLED bookings</li>
     * </ul>
     * 
     * <p>Example: GET /api/bookings/my
     * 
     * <p>Example response:
     * <pre>{@code
     * {
     *   "upcoming": [
     *     {
     *       "id": 5001,
     *       "slotId": 1001,
     *       "stationId": 1,
     *       "stationName": "Delhi Central Mall",
     *       "slotDate": "2026-09-20",
     *       "startTime": "14:00:00",
     *       "endTime": "15:00:00",
     *       "status": "CONFIRMED",
     *       "totalAmount": 50.00,
     *       "bookedAt": "2026-09-15T10:30:00Z"
     *     }
     *   ],
     *   "pending": [...],
     *   "past": [...],
     *   "cancelled": [...]
     * }
     * }</pre>
     * 
     * @param user Authenticated user (from JWT)
     * @return Bookings grouped by status
     */
    @GetMapping("/my")
    public ResponseEntity<UserBookingsResponse> getMyBookings(
            @AuthenticationPrincipal User user) {
        
        log.debug("Fetching user bookings: userId={}", user.getId());
        
        UserBookingsResponse bookings = bookingQueryService.getUserBookings(user.getId());
        
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * Cancel a booking.
     * 
     * <p>Flow:
     * <ol>
     *   <li>Validate booking belongs to user</li>
     *   <li>Check cancellation is allowed (status = PENDING or CONFIRMED)</li>
     *   <li>Update booking status = CANCELLED</li>
     *   <li>Update slot status = AVAILABLE</li>
     *   <li>Initiate refund if payment was confirmed</li>
     *   <li>Send WebSocket notification to user</li>
     * </ol>
     * 
     * <p>Example request:
     * <pre>{@code
     * POST /api/bookings/5001/cancel
     * Authorization: Bearer {jwt}
     * 
     * {
     *   "reason": "Change of plans"
     * }
     * }</pre>
     * 
     * @param id Booking ID
     * @param request Cancel request (contains optional reason)
     * @param user Authenticated user (from JWT)
     * @return No content (204)
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            @RequestBody(required = false) CancelBookingRequest request,
            @AuthenticationPrincipal User user) {
        
        String reason = request != null ? request.reason() : null;
        
        log.info("Cancelling booking: bookingId={}, userId={}, reason={}", id, user.getId(), reason);
        
        bookingService.cancelBooking(id, user.getId(), reason);
        
        log.info("Booking cancelled: bookingId={}", id);
        
        return ResponseEntity.noContent().build();
    }
}
