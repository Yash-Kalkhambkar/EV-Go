package com.evgo.websocket;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

/**
 * WebSocket message sent to clients.
 * 
 * <p>Message types:
 * <ul>
 *   <li>CONNECTED - Connection established</li>
 *   <li>BOOKING_CONFIRMED - Payment verified, booking confirmed</li>
 *   <li>BOOKING_CANCELLED - Booking cancelled</li>
 *   <li>BOOKING_EXPIRED - Payment timeout, auto-cancelled</li>
 *   <li>SLOT_RELEASED - Slot became available again</li>
 * </ul>
 * 
 * @param type Message type (enum-like string)
 * @param message Human-readable message
 * @param data Optional payload (booking details, slot info, etc.)
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record WebSocketMessage(
        String type,
        String message,
        Object data
) {
    /**
     * Create a simple message without data.
     */
    public static WebSocketMessage simple(String type, String message) {
        return new WebSocketMessage(type, message, null);
    }
    
    /**
     * Create a booking confirmed message.
     */
    public static WebSocketMessage bookingConfirmed(Long bookingId) {
        return new WebSocketMessage(
                "BOOKING_CONFIRMED",
                "Your booking has been confirmed!",
                new BookingEventData(bookingId, Instant.now())
        );
    }
    
    /**
     * Create a booking cancelled message.
     */
    public static WebSocketMessage bookingCancelled(Long bookingId, String reason) {
        return new WebSocketMessage(
                "BOOKING_CANCELLED",
                "Your booking has been cancelled. " + (reason != null ? "Reason: " + reason : ""),
                new BookingEventData(bookingId, Instant.now())
        );
    }
    
    /**
     * Create a booking expired message.
     */
    public static WebSocketMessage bookingExpired(Long bookingId) {
        return new WebSocketMessage(
                "BOOKING_EXPIRED",
                "Your booking has expired due to payment timeout.",
                new BookingEventData(bookingId, Instant.now())
        );
    }
    
    /**
     * Embedded data for booking events.
     */
    public record BookingEventData(
            Long bookingId,
            Instant timestamp
    ) {}
}
