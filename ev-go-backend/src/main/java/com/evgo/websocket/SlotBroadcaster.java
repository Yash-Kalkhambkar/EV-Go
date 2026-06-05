package com.evgo.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Broadcasts slot availability updates to WebSocket clients via Redis Pub/Sub.
 *
 * <p>When a slot status changes, {@link #broadcast} publishes to the Redis topic
 * {@code slot:updates:{stationId}}. All Cloud Run instances subscribed to that
 * topic receive the message and forward it to their local WebSocket clients.
 *
 * Requirements: 7.2, 7.3
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SlotBroadcaster {

    private static final String TOPIC_PREFIX = "slot:updates:";
    private static final String WS_DESTINATION = "/topic/stations/%d/slots";

    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    /**
     * Publishes a slot update to the Redis Pub/Sub topic for the given station.
     * All instances will receive this and broadcast to their local WebSocket clients.
     *
     * Requirements: 7.2
     */
    public void broadcast(Long stationId) {
        try {
            SlotUpdateMessage message = new SlotUpdateMessage(stationId, Instant.now());
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.convertAndSend(TOPIC_PREFIX + stationId, json);
            log.debug("Slot update published to Redis: stationId={}", stationId);
            meterRegistry.counter("websocket.messages.published",
                    "stationId", String.valueOf(stationId)).increment();
        } catch (Exception e) {
            log.error("Failed to publish slot update for stationId={}: {}", stationId, e.getMessage());
        }
    }

    /**
     * Handles a Redis Pub/Sub message and broadcasts to local WebSocket subscribers.
     * Called by {@link SlotUpdateListener} when a message arrives on any slot topic.
     *
     * Requirements: 7.3
     */
    public void handleRedisMessage(String messageJson, Long stationId) {
        try {
            String destination = String.format(WS_DESTINATION, stationId);
            messagingTemplate.convertAndSend(destination, messageJson);
            log.debug("Slot update broadcast to WebSocket: stationId={}", stationId);
            meterRegistry.counter("websocket.messages.delivered",
                    "stationId", String.valueOf(stationId)).increment();
        } catch (Exception e) {
            log.error("Failed to broadcast slot update to WebSocket: stationId={}: {}",
                    stationId, e.getMessage());
        }
    }

    /** Payload published to Redis and forwarded to WebSocket clients. */
    public record SlotUpdateMessage(Long stationId, Instant updatedAt) {}
}
