package com.evgo.monitoring;

import com.zaxxer.hikari.HikariDataSource;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Exports HikariCP connection pool metrics to Micrometer / Prometheus.
 *
 * <p>Registers four gauges that reflect the current state of the connection pool:
 * <ul>
 *   <li>{@code hikari.connections.active} – connections currently in use</li>
 *   <li>{@code hikari.connections.idle} – connections available in the pool</li>
 *   <li>{@code hikari.connections.total} – total connections (active + idle)</li>
 *   <li>{@code hikari.connections.waiting} – threads waiting for a connection</li>
 * </ul>
 *
 * <p>Gauges are registered once at startup and updated lazily by Micrometer when
 * scraped. The {@link #refreshMetrics()} method runs every 10 seconds to log a
 * human-readable summary for operational visibility.
 *
 * <p>Requirements: 3.7 (connection pool metrics)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class HikariMetricsExporter {

    private final HikariDataSource hikariDataSource;
    private final MeterRegistry meterRegistry;

    /**
     * Registers Micrometer gauges backed by live HikariCP pool MXBean values.
     *
     * <p>Gauges are registered once at startup. Micrometer calls the supplier
     * lambda on each scrape, so values are always current without polling.
     *
     * Requirements: 3.7
     */
    @PostConstruct
    public void registerGauges() {
        Gauge.builder("hikari.connections.active",
                        hikariDataSource,
                        ds -> ds.getHikariPoolMXBean() != null
                                ? ds.getHikariPoolMXBean().getActiveConnections() : 0)
                .description("Number of active (in-use) connections in the HikariCP pool")
                .tag("pool", hikariDataSource.getPoolName())
                .register(meterRegistry);

        Gauge.builder("hikari.connections.idle",
                        hikariDataSource,
                        ds -> ds.getHikariPoolMXBean() != null
                                ? ds.getHikariPoolMXBean().getIdleConnections() : 0)
                .description("Number of idle connections available in the HikariCP pool")
                .tag("pool", hikariDataSource.getPoolName())
                .register(meterRegistry);

        Gauge.builder("hikari.connections.total",
                        hikariDataSource,
                        ds -> ds.getHikariPoolMXBean() != null
                                ? ds.getHikariPoolMXBean().getTotalConnections() : 0)
                .description("Total number of connections (active + idle) in the HikariCP pool")
                .tag("pool", hikariDataSource.getPoolName())
                .register(meterRegistry);

        Gauge.builder("hikari.connections.waiting",
                        hikariDataSource,
                        ds -> ds.getHikariPoolMXBean() != null
                                ? ds.getHikariPoolMXBean().getThreadsAwaitingConnection() : 0)
                .description("Number of threads waiting to acquire a connection from the HikariCP pool")
                .tag("pool", hikariDataSource.getPoolName())
                .register(meterRegistry);

        log.info("HikariCP metrics gauges registered for pool: {}", hikariDataSource.getPoolName());
    }

    /**
     * Logs a periodic summary of pool statistics for operational visibility.
     *
     * <p>Runs every 10 seconds. Complements the Micrometer gauges with a
     * human-readable log entry that appears in structured JSON logs.
     *
     * Requirements: 3.7
     */
    @Scheduled(fixedDelay = 10_000)
    public void refreshMetrics() {
        if (hikariDataSource.getHikariPoolMXBean() == null) {
            log.debug("HikariCP pool MXBean not yet available");
            return;
        }

        int active  = hikariDataSource.getHikariPoolMXBean().getActiveConnections();
        int idle    = hikariDataSource.getHikariPoolMXBean().getIdleConnections();
        int total   = hikariDataSource.getHikariPoolMXBean().getTotalConnections();
        int waiting = hikariDataSource.getHikariPoolMXBean().getThreadsAwaitingConnection();
        int maxPool = hikariDataSource.getMaximumPoolSize();

        log.debug("HikariCP pool stats: pool={}, active={}, idle={}, total={}/{}, waiting={}",
                hikariDataSource.getPoolName(), active, idle, total, maxPool, waiting);
    }
}
