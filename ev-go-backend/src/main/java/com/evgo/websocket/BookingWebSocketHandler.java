package com.evgo.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.evgo.config.JwtTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket handler for real-time booking notifications.
 * 
 * <p>Clients connect to /ws/bookings with JWT token in query param:
 * {@code ws://localhost:8080/ws/bookings?token=<jwt>}
 * 
 * <p>Messages sent to clients:
 * <ul>
 *   <li>BOOKING_CONFIRMED - Payment verified, booking confirmed</li>
 *   <li>BOOKING_CANCELLED - Booking cancelled by user or admin</li>
 *   <li>BOOKING_EXPIRED - Payment timeout, booking auto-cancelled</li>
 *   <li>SLOT_RELEASED - Slot became available again</li>
 * </ul>
 * 
 * <p>Session Management:
 * <ul>
 *   <li>Sessions stored in memory (ephemeral, cleared on restart)</li>
 *   <li>User can have multiple sessions (multiple browser tabs)</li>
 *   <li>Auto-cleanup on disconnect</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookingWebSocketHandler extends TextWebSocketHandler {
    
    private final JwtTokenService jwtTokenService;
    private final ObjectMapper objectMapper;
    
    /**
     * Map of userId -> Set of WebSocket sessions.
     * Allows multiple sessions per user (multiple devices/tabs).
     */
    private final Map<Long, Map<String, WebSocketSession>> userSessions = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        
        log.debug("WebSocket connection attempt: sessionId={}", session.getId());
        
        // Extract JWT token from query params
        String token = extractToken(session);
        if (token == null) {
            log.warn("WebSocket connection rejected: no token provided");
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Missing token"));
            return;
        }
        
        // Validate JWT and extract userId
        Long userId;
        try {
            userId = jwtTokenService.extractUserIdAsLong(token);
            if (userId == null) {
                throw new IllegalArgumentException("Token does not contain userId");
            }
        } catch (Exception e) {
            log.warn("WebSocket connection rejected: invalid token - {}", e.getMessage());
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Invalid token"));
            return;
        }
        
        // Store session
        userSessions
                .computeIfAbsent(userId, k -> new ConcurrentHashMap<>())
                .put(session.getId(), session);
        
        log.info("WebSocket connected: userId={}, sessionId={}, totalSessions={}",
                userId, session.getId(), userSessions.get(userId).size());
        
        // Send welcome message
        sendMessage(session, new WebSocketMessage(
                "CONNECTED",
                "Welcome! You will receive real-time booking updates.",
                null
        ));
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        
        // Remove session from all users (we don't store userId in session attributes)
        Long userId = null;
        for (Map.Entry<Long, Map<String, WebSocketSession>> entry : userSessions.entrySet()) {
            if (entry.getValue().remove(session.getId()) != null) {
                userId = entry.getKey();
                if (entry.getValue().isEmpty()) {
                    userSessions.remove(entry.getKey());
                }
                break;
            }
        }
        
        log.info("WebSocket disconnected: userId={}, sessionId={}, status={}",
                userId, session.getId(), status);
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Client messages not supported in this implementation
        // Could be extended for ping/pong or subscription management
        log.debug("Received message from client: sessionId={}, message={}",
                session.getId(), message.getPayload());
    }
    
    /**
     * Send notification to all sessions for a specific user.
     * 
     * @param userId User ID
     * @param message Message to send
     */
    public void sendToUser(Long userId, WebSocketMessage message) {
        
        Map<String, WebSocketSession> sessions = userSessions.get(userId);
        if (sessions == null || sessions.isEmpty()) {
            log.debug("No active sessions for userId={}, skipping notification", userId);
            return;
        }
        
        log.info("Sending WebSocket notification: userId={}, type={}, sessionCount={}",
                userId, message.type(), sessions.size());
        
        // Send to all user sessions
        sessions.values().forEach(session -> {
            try {
                sendMessage(session, message);
            } catch (Exception e) {
                log.error("Failed to send WebSocket message: userId={}, sessionId={}, error={}",
                        userId, session.getId(), e.getMessage());
            }
        });
    }
    
    /**
     * Send message to a specific session.
     */
    private void sendMessage(WebSocketSession session, WebSocketMessage message) throws IOException {
        if (session.isOpen()) {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
        }
    }
    
    /**
     * Extract JWT token from query parameters.
     * Expected format: ws://host/ws/bookings?token=<jwt>
     */
    private String extractToken(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query == null) {
            return null;
        }
        
        String[] params = query.split("&");
        for (String param : params) {
            String[] keyValue = param.split("=", 2);
            if (keyValue.length == 2 && "token".equals(keyValue[0])) {
                return keyValue[1];
            }
        }
        
        return null;
    }
    
    /**
     * Get count of active sessions for a user (for testing/monitoring).
     */
    public int getSessionCount(Long userId) {
        Map<String, WebSocketSession> sessions = userSessions.get(userId);
        return sessions != null ? sessions.size() : 0;
    }
    
    /**
     * Get total active sessions across all users (for monitoring).
     */
    public int getTotalSessionCount() {
        return userSessions.values().stream()
                .mapToInt(Map::size)
                .sum();
    }
}
