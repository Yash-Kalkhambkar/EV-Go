package com.evgo.booking;

import com.evgo.booking.dto.BookingDto;
import com.evgo.booking.dto.CreateBookingRequest;
import com.evgo.booking.statemachine.BookingStateMachine;
import com.evgo.exception.ResourceNotFoundException;
import com.evgo.exception.SlotUnavailableException;
import com.evgo.locking.DistributedLockService;
import com.evgo.slot.Slot;
import com.evgo.slot.SlotRepository;
import com.evgo.slot.SlotStatus;
import com.evgo.slot.statemachine.SlotStateMachine;
import com.evgo.station.StationRepository;
import com.evgo.user.User;
import com.evgo.user.UserRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.DeadlockLoserDataAccessException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.concurrent.TimeUnit;

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
 *
 * <h2>Retry policy</h2>
 * {@link #createBooking} is annotated with {@code @Retryable} to handle transient
 * database deadlocks with exponential back-off (100 ms → 200 ms → 400 ms, max 3 attempts).
 *
 * Requirements: 1.1, 1.6, 2.2, 2.4, 2.5, 2.7, 11.2, 11.5, 11.6
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
    private final MeterRegistry          meterRegistry;
    private final BookingStateMachine    bookingStateMachine;
    private final SlotStateMachine       slotStateMachine;

    // ── Lock configuration ────────────────────────────────────────────────────

    /** Maximum seconds to wait for the Redis lock before giving up. */
    private static final long LOCK_WAIT_SECONDS  = 3;

    /** Automatic lock expiry (TTL) after acquisition. */
    private static final long LOCK_LEASE_SECONDS = 10;

    // ── createBooking ─────────────────────────────────────────────────────────

    /**
     * {@inheritDoc}
     *
     * <p>Retries up to 3 times on deadlock with exponential back-off.
     *
     * Requirements: 1.1, 1.6, 2.2, 2.4, 2.7
     */
    @Override
    @Retryable(
            retryFor  = {DeadlockLoserDataAccessException.class, CannotAcquireLockException.class},
            maxAttempts = 3,
            backoff   = @Backoff(delay = 100, multiplier = 2, maxDelay = 400)
    )
    public BookingDto createBooking(CreateBookingRequest request, Long userId) {

        long lockStart = System.currentTimeMillis();
        String lockKey = "slot:lock:" + request.slotId();

        // ── Tier 1: Redis distributed lock ────────────────────────────────────
        boolean locked = distributedLockService.tryLock(lockKey, LOCK_WAIT_SECONDS, LOCK_LEASE_SECONDS);
        if (!locked) {
            log.warn("Slot lock contention: slotId={}, userId={}", request.slotId(), userId);
            meterRegistry.counter("booking.lock.contention", "slotId", String.valueOf(request.slotId())).increment();
            throw new SlotUnavailableException("SLOT_CONTENTION", "Slot is being booked by another user");
        }

        try {
            long lockAcquisitionMs = System.currentTimeMillis() - lockStart;
            long txStart = System.currentTimeMillis();

            BookingDto result = createBookingInTransaction(request, userId);

            long txDurationMs = System.currentTimeMillis() - txStart;

            log.info("Booking created: bookingId={}, slotId={}, userId={}, lockAcquisitionMs={}, txDurationMs={}",
                    result.id(), request.slotId(), userId, lockAcquisitionMs, txDurationMs);

            // ── Metrics ───────────────────────────────────────────────────────
            meterRegistry.counter("booking.created").increment();
            meterRegistry.timer("booking.lock.acquisition.time")
                    .record(lockAcquisitionMs, TimeUnit.MILLISECONDS);
            meterRegistry.timer("booking.transaction.duration")
                    .record(txDurationMs, TimeUnit.MILLISECONDS);

            return result;

        } finally {
            long totalDurationMs = System.currentTimeMillis() - lockStart;
            distributedLockService.releaseLock(lockKey);
            log.info("Lock released: key={}, totalDurationMs={}", lockKey, totalDurationMs);
        }
    }

    /**
     * Executes the booking creation inside a REPEATABLE_READ transaction with a
     * 5-second timeout. The slot is loaded with a pessimistic write lock (tier 2).
     *
     * Requirements: 2.2, 2.3
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
        slotStateMachine.validate(slot.getStatus(), SlotStatus.RESERVED);
        slot.setStatus(SlotStatus.RESERVED);
        slotRepository.save(slot);

        return toDto(booking);
    }

    // ── updateBookingStatus ───────────────────────────────────────────────────

    /**
     * {@inheritDoc}
     *
     * Requirements: 11.2, 11.5, 11.6
     */
    @Override
    @Transactional
    public BookingDto updateBookingStatus(Long bookingId, BookingStatus newStatus, Long userId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        BookingStatus currentStatus = booking.getStatus();

        // Validate booking state transition
        bookingStateMachine.validate(currentStatus, newStatus);

        booking.setStatus(newStatus);

        Slot slot = booking.getSlot();

        // Synchronise slot status with booking transition
        if (newStatus == BookingStatus.CONFIRMED) {
            slotStateMachine.validate(slot.getStatus(), SlotStatus.BOOKED);
            slot.setStatus(SlotStatus.BOOKED);
            slotRepository.save(slot);

        } else if (newStatus == BookingStatus.CANCELLED) {
            booking.setCancelledAt(Instant.now());
            slotStateMachine.validate(slot.getStatus(), SlotStatus.AVAILABLE);
            slot.setStatus(SlotStatus.AVAILABLE);
            slotRepository.save(slot);
        }

        bookingRepository.save(booking);

        // Audit log (placeholder – will be replaced by a dedicated audit service)
        log.info("AUDIT: booking {} transitioned {} -> {} by userId={}",
                bookingId, currentStatus, newStatus, userId);

        return toDto(booking);
    }

    // ── cancelBooking ─────────────────────────────────────────────────────────

    /**
     * {@inheritDoc}
     *
     * Requirements: 11.5
     */
    @Override
    public void cancelBooking(Long bookingId, Long userId) {
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
