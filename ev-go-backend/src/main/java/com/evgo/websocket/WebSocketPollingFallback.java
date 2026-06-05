package com.evgo.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Fallback mechanism when Redis Pub/Sub is unavailable.
 *
 * <p>Monitors the Redis listener container health every 5 seconds.
 * When Redis is down, switches to polling mode — the SlotBroadcaster
 * broadcasts current slot state to all connected clients periodically.
 * Automatically resumes Redis Pub/Sub when the connection is restored.
 *
 * Requirements: 7.6
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketPollingFallback {

    private final RedisMessageListenerContainer listenerContainer;
    private final SlotBroadcaster slotBroadcaster;

    private final AtomicBoolean pollingMode = new AtomicBoolean(false);

    /**
     * Checks Redis Pub/Sub health every 5 seconds.
     * Switches to/from polling mode based on container running state.
     *
     * Requirements: 7.6
     */
    @Scheduled(fixedDelay = 5_000)
    public void checkRedisHealth() {
        boolean redisUp = listenerContainer.isRunning();

        if (!redisUp && pollingMode.compareAndSet(false, true)) {
            log.warn("Redis Pub/Sub unavailable — switching to polling mode");
        } else if (redisUp && pollingMode.compareAndSet(true, false)) {
            log.info("Redis Pub/Sub restored — resuming normal operation");
        }
    }

    /** Returns true when the system is operating in polling fallback mode. */
    public boolean isPollingMode() {
        return pollingMode.get();
    }
}
