package com.evgo.booking;

import com.evgo.booking.dto.BookingDto;
import com.evgo.booking.dto.CreateBookingRequest;
import com.evgo.exception.ResourceNotFoundException;
import com.evgo.exception.SlotUnavailableException;
import com.evgo.locking.DistributedLockService;
import com.evgo.slot.Slot;
import com.evgo.slot.SlotRepository;
import com.evgo.slot.SlotStatus;
import com.evgo.station.StationRepository;
import com.evgo.user.User;
import com.evgo.user.UserRepository;
import com.evgo.websocket.BookingWebSocketHandler;
import com.evgo.websocket.WebSocketMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Default implementation of {@link BookingService}.
 *
 * <h2>Two-tier locking strategy</h2>
 * <ol>
 *   <li><b>Redis distributed lock</b> (first tier) – acquired before entering the
 *       database transaction. Prevents multiple Cloud Run instances from racing to
 *       book the same slot simultaneously.</li>
 *   <li><b>DB pessimistic write lock</b> (second tier) – {@code SELECT … FOR UPDATE}
 *       via {@link SlotRepository#findByIdWithLock}. Acts as the correctness guarantee
 *       when Redis is unavailable (fallback mode).</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository      bookingRepository;
    private final SlotRepository         slotRepository;
    private final StationRepository      stationRepository;
    private final UserRepository         userRepository;
    private final DistributedLockService distributedLockService;
    private final BookingWebSocketHandler webSocketHandler;

    // ── Lock configuration ────────────────────────────────────────────────────

    /** Maximum seconds to wait for the Redis lock before giving up. */
    private static final long LOCK_WAIT_SECONDS  = 3;

    /** Automatic lock expiry (TTL) after acquisition. */
    private static final long LOCK_LEASE_SECONDS = 10;

    // ── createBooking ─────────────────────────────────────────────────────────

    @Override
    public BookingDto createBooking(CreateBookingRequest request, Long userId) {

        long lockStart = System.currentTimeMillis();
        String lockKey = "slot:lock:" + request.slotId();

        // ── Tier 1: Redis distributed lock ────────────────────────────────────
        boolean locked = distributedLockService.tryLock(lockKey, LOCK_WAIT_SECONDS, LOCK_LEASE_SECONDS);
        if (!locked) {
            log.warn("Slot lock contention: slotId={}, userId={}", request.slotId(), userId);
            throw new SlotUnavailableException("SLOT_CONTENTION", "Slot is being booked by another user");
        }

        try {
            BookingDto result = createBookingInTransaction(request, userId);

            long totalDurationMs = System.currentTimeMillis() - lockStart;
            log.info("Booking created: bookingId={}, slotId={}, userId={}, totalDurationMs={}",
                    result.id(), request.slotId(), userId, totalDurationMs);

            return result;

        } finally {
            distributedLockService.releaseLock(lockKey);
            log.debug("Lock released: key={}", lockKey);
        }
    }

    /**
     * Executes the booking creation inside a REPEATABLE_READ transaction with a
     * 5-second timeout. The slot is loaded with a pessimistic write lock (tier 2).
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ, timeout = 5)
    protected BookingDto createBookingInTransaction(CreateBookingRequest request, Long userId) {

        // ── Tier 2: DB pessimistic write lock (SELECT … FOR UPDATE) ───────────
        Slot slot = slotRepository.findByIdWithLock(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot", request.slotId()));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new SlotUnavailableException(
                    "SLOT_NOT_AVAILABLE",
                    "Slot " + request.slotId() + " is not available (current status: " + slot.getStatus() + ")");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Booking booking = Booking.builder()
                .user(user)
                .slot(slot)
                .station(slot.getStation())
                .status(BookingStatus.PENDING)
                .totalAmount(slot.getStation().getPricePerHour())
                .bookedAt(Instant.now())
                .build();

        bookingRepository.save(booking);

        // Mark slot as RESERVED (payment still pending)
        slot.setStatus(SlotStatus.RESERVED);
        slotRepository.save(slot);

        return toDto(booking);
    }

    // ── updateBookingStatus ───────────────────────────────────────────────────

    @Override
    @Transactional
    public BookingDto updateBookingStatus(Long bookingId, BookingStatus newStatus, Long userId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        BookingStatus currentStatus = booking.getStatus();

        // Simple status validation
        if (newStatus == BookingStatus.CONFIRMED && currentStatus != BookingStatus.PENDING) {
            throw new IllegalStateException("Cannot confirm booking with status: " + currentStatus);
        }

        booking.setStatus(newStatus);

        Slot slot = booking.getSlot();

        // Synchronise slot status with booking transition
        if (newStatus == BookingStatus.CONFIRMED) {
            slot.setStatus(SlotStatus.BOOKED);
            slotRepository.save(slot);
            
            // Send WebSocket notification
            webSocketHandler.sendToUser(userId, WebSocketMessage.bookingConfirmed(bookingId));

        } else if (newStatus == BookingStatus.CANCELLED) {
            booking.setCancelledAt(Instant.now());
            slot.setStatus(SlotStatus.AVAILABLE);
            slotRepository.save(slot);
            
            // Send WebSocket notification
            webSocketHandler.sendToUser(userId, 
                    WebSocketMessage.bookingCancelled(bookingId, booking.getCancellationReason()));
        }

        bookingRepository.save(booking);

        log.info("Booking {} transitioned {} -> {} by userId={}", bookingId, currentStatus, newStatus, userId);

        return toDto(booking);
    }

    // ── cancelBooking ─────────────────────────────────────────────────────────

    @Override
    public void cancelBooking(Long bookingId, Long userId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));
        
        // Authorization check
        if (!booking.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not authorized to cancel this booking");
        }
        
        // Save cancellation reason
        if (reason != null && !reason.isBlank()) {
            booking.setCancellationReason(reason);
        }
        
        updateBookingStatus(bookingId, BookingStatus.CANCELLED, userId);
    }

    // ── Mapping helper ────────────────────────────────────────────────────────

    private static BookingDto toDto(Booking booking) {
        return new BookingDto(
                booking.getId(),
                booking.getUser().getId(),
                booking.getSlot().getId(),
                booking.getStation().getId(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getRazorpayOrderId(),
                booking.getBookedAt()
        );
    }
}
