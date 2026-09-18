package com.evgo.booking;

import com.evgo.booking.dto.BookingDetailDto;
import com.evgo.booking.dto.BookingDto;
import com.evgo.booking.dto.UserBookingsResponse;
import com.evgo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of {@link BookingQueryService}.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingQueryServiceImpl implements BookingQueryService {
    
    private final BookingRepository bookingRepository;
    
    @Override
    @Transactional(readOnly = true)
    public BookingDto getBookingById(Long bookingId, Long userId) {
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));
        
        // Authorization check: user can only view their own bookings
        if (!booking.getUser().getId().equals(userId)) {
            log.warn("Unauthorized booking access: bookingId={}, userId={}, ownerId={}",
                    bookingId, userId, booking.getUser().getId());
            throw new AccessDeniedException("You are not authorized to view this booking");
        }
        
        return toDto(booking);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserBookingsResponse getUserBookings(Long userId) {
        
        log.debug("Fetching bookings for userId={}", userId);
        
        List<Booking> allBookings = bookingRepository.findByUserIdOrderByBookedAtDesc(userId);
        
        LocalDate today = LocalDate.now();
        
        List<BookingDetailDto> upcoming = new ArrayList<>();
        List<BookingDetailDto> pending = new ArrayList<>();
        List<BookingDetailDto> past = new ArrayList<>();
        List<BookingDetailDto> cancelled = new ArrayList<>();
        
        for (Booking booking : allBookings) {
            BookingDetailDto dto = toDetailDto(booking);
            
            switch (booking.getStatus()) {
                case CONFIRMED:
                    // Check if slot is in the future
                    if (!booking.getSlot().getSlotDate().isBefore(today)) {
                        upcoming.add(dto);
                    } else {
                        past.add(dto);
                    }
                    break;
                    
                case PENDING:
                    pending.add(dto);
                    break;
                    
                case COMPLETED:
                    past.add(dto);
                    break;
                    
                case CANCELLED:
                    cancelled.add(dto);
                    break;
            }
        }
        
        log.debug("User bookings: userId={}, upcoming={}, pending={}, past={}, cancelled={}",
                userId, upcoming.size(), pending.size(), past.size(), cancelled.size());
        
        return new UserBookingsResponse(upcoming, pending, past, cancelled);
    }
    
    /**
     * Convert Booking entity to simple DTO.
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
    
    /**
     * Convert Booking entity to detailed DTO (with station and slot info).
     */
    private BookingDetailDto toDetailDto(Booking booking) {
        return new BookingDetailDto(
                booking.getId(),
                booking.getSlot().getId(),
                booking.getStation().getId(),
                booking.getStation().getName(),
                booking.getStation().getAddress(),
                booking.getSlot().getSlotDate(),
                booking.getSlot().getStartTime(),
                booking.getSlot().getEndTime(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getBookedAt(),
                booking.getCancelledAt(),
                booking.getCancellationReason()
        );
    }
}
