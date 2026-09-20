package com.evgo.admin;

import com.evgo.booking.Booking;
import com.evgo.booking.BookingRepository;
import com.evgo.booking.BookingStatus;
import com.evgo.booking.dto.BookingDto;
import com.evgo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of {@link AdminBookingQueryService}.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminBookingQueryServiceImpl implements AdminBookingQueryService {

    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<BookingDto> listBookings(Pageable pageable, String status) {

        log.debug("Admin querying bookings: page={}, size={}, status={}",
                  pageable.getPageNumber(), pageable.getPageSize(), status);

        Page<Booking> bookings;

        if (status != null && !status.isBlank()) {
            try {
                BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
                bookings = bookingRepository.findByStatus(bookingStatus, pageable);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid booking status filter: {}", status);
                // Return empty page for invalid status
                bookings = Page.empty(pageable);
            }
        } else {
            bookings = bookingRepository.findAll(pageable);
        }

        return bookings.map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingDto getBookingById(Long bookingId) {

        log.debug("Admin fetching booking: bookingId={}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        return toDto(booking);
    }

    /**
     * Convert Booking entity to DTO.
     *
     * <p>Admin view includes all fields without user ownership checks.
     */
    private BookingDto toDto(Booking booking) {
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
