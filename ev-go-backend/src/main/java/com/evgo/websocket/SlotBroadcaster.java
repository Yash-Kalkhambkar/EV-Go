package com.evgo.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Broadcasts slot availability updates to WebSocket clients.
 * V1: Simple in-memory broker (single instance only).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SlotBroadcaster {

    private static final String WS_DESTINATION = "/topic/stations/%d/slots";

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Broadcasts a slot update to local WebSocket clients.
     * V1: Direct broadcast (no Redis Pub/Sub).
     */
    public void broadcast(Long stationId) {
        try {
            SlotUpdateMessage message = new SlotUpdateMessage(stationId, Instant.now());
            String json = objectMapper.writeValueAsString(message);
            String destination = String.format(WS_DESTINATION, stationId);
            messagingTemplate.convertAndSend(destination, json);
            log.debug("Slot update broadcast to WebSocket: stationId={}", stationId);
        } catch (Exception e) {
            log.error("Failed to broadcast slot update for stationId={}: {}", stationId, e.getMessage());
        }
    }

    /** Payload sent to WebSocket clients. */
    public record SlotUpdateMessage(Long stationId, Instant updatedAt) {}
}
