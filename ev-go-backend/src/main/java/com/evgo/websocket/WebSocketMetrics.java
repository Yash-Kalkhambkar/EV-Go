package com.evgo.websocket;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Tracks WebSocket connection metrics.
 *
 * <p>Registers Micrometer gauges and counters for:
 * <ul>
 *   <li>Active WebSocket connections per instance</li>
 *   <li>Total connections established</li>
 *   <li>Total disconnections</li>
 * </ul>
 *
 * Requirements: 7.7, 21.4
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketMetrics {

    private final MeterRegistry meterRegistry;
    private final AtomicInteger activeConnections = new AtomicInteger(0);

    @PostConstruct
    public void registerGauges() {
        Gauge.builder("websocket.connections.active", activeConnections, AtomicInteger::get)
                .description("Number of active WebSocket connections on this instance")
                .register(meterRegistry);
    }

    @EventListener
    public void onConnect(SessionConnectedEvent event) {
        int count = activeConnections.incrementAndGet();
        meterRegistry.counter("websocket.connections.total").increment();
        log.debug("WebSocket connected, active={}", count);
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        int count = activeConnections.decrementAndGet();
        meterRegistry.counter("websocket.disconnections.total").increment();
        log.debug("WebSocket disconnected, active={}", count);
    }
}
