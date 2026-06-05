package com.evgo.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Tracks WebSocket subscriptions per station and manages Redis Pub/Sub topics.
 *
 * <p>When the first client subscribes to a station, this component subscribes
 * to the Redis topic {@code slot:updates:{stationId}}. When the last client
 * unsubscribes, it unsubscribes from Redis to avoid unnecessary traffic.
 *
 * Requirements: 7.4
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SlotUpdateListener {

    private static final Pattern STATION_PATTERN =
            Pattern.compile("/topic/stations/(\\d+)/slots");

    /** Active subscription count per stationId. */
    private final ConcurrentHashMap<Long, AtomicInteger> subscriptionCounts =
            new ConcurrentHashMap<>();

    /** Redis listener references keyed by stationId for cleanup. */
    private final ConcurrentHashMap<Long, MessageListener> redisListeners =
            new ConcurrentHashMap<>();

    private final RedisMessageListenerContainer listenerContainer;
    private final SlotBroadcaster slotBroadcaster;

    @EventListener
    public void handleSubscribe(SessionSubscribeEvent event) {
        Long stationId = extractStationId(event.getMessage().getHeaders());
        if (stationId == null) return;

        int newCount = subscriptionCounts
                .computeIfAbsent(stationId, k -> new AtomicInteger(0))
                .incrementAndGet();

        log.debug("WebSocket subscribe: stationId={}, totalSubscribers={}", stationId, newCount);

        if (newCount == 1) {
            subscribeToRedis(stationId);
        }
    }

    @EventListener
    public void handleUnsubscribe(SessionUnsubscribeEvent event) {
        Long stationId = extractStationId(event.getMessage().getHeaders());
        if (stationId == null) return;

        AtomicInteger counter = subscriptionCounts.get(stationId);
        if (counter == null) return;

        int newCount = counter.decrementAndGet();
        log.debug("WebSocket unsubscribe: stationId={}, totalSubscribers={}", stationId, newCount);

        if (newCount <= 0) {
            subscriptionCounts.remove(stationId);
            unsubscribeFromRedis(stationId);
        }
    }

    private void subscribeToRedis(Long stationId) {
        String topic = "slot:updates:" + stationId;
        MessageListener listener = (message, pattern) ->
                slotBroadcaster.handleRedisMessage(new String(message.getBody()), stationId);

        redisListeners.put(stationId, listener);
        listenerContainer.addMessageListener(listener, new PatternTopic(topic));
        log.info("Subscribed to Redis topic: {}", topic);
    }

    private void unsubscribeFromRedis(Long stationId) {
        MessageListener listener = redisListeners.remove(stationId);
        if (listener != null) {
            listenerContainer.removeMessageListener(listener);
            log.info("Unsubscribed from Redis topic: slot:updates:{}", stationId);
        }
    }

    private Long extractStationId(org.springframework.messaging.MessageHeaders headers) {
        try {
            StompHeaderAccessor accessor = StompHeaderAccessor.wrap(
                    new org.springframework.messaging.support.GenericMessage<>("", headers));
            String destination = accessor.getDestination();
            if (destination == null) return null;
            Matcher m = STATION_PATTERN.matcher(destination);
            return m.matches() ? Long.parseLong(m.group(1)) : null;
        } catch (Exception e) {
            return null;
        }
    }
}
