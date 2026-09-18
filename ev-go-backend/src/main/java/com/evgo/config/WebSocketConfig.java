package com.evgo.config;

import com.evgo.websocket.BookingWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket configuration for real-time booking notifications.
 *
 * <p>Endpoints:
 * <ul>
 *   <li>/ws/bookings - User booking notifications (JWT auth required)</li>
 * </ul>
 * 
 * <p>Connection: {@code ws://host/ws/bookings?token=<jwt>}
 *
 * Requirements: 7.1, 7.2, 7.3
 */
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final BookingWebSocketHandler bookingWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(bookingWebSocketHandler, "/ws/bookings")
                .setAllowedOriginPatterns("*");
    }
}
