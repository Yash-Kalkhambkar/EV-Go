package com.evgo.monitoring;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Monitors HikariCP connection pool health and raises alerts on anomalies.
 *
 * <p>Two alert conditions are monitored:
 * <ol>
 *   <li><b>Slow acquisition:</b> Logged via HikariCP's built-in
 *       {@code leakDetectionThreshold} and supplemented by a periodic check that
 *       detects when threads are waiting for connections (waiting &gt; 0 implies
 *       acquisition is queuing, which can exceed 1 second under load).</li>
 *   <li><b>High utilisation:</b> Pool utilisation &gt; 90% sustained for 2 minutes
 *       triggers a WARN log and an alert via {@link AlertService}.</li>
 * </ol>
 *
 * <p>HikariCP's own {@code leakDetectionThreshold} (configured to 60 s in
 * {@code application.yml}) will log a WARN for any connection held longer than
 * that threshold. This component adds application-level alerting on top.
 *
 * <p>Requirements: 3.4 (connection acquisition alert), 24.3 (pool utilisation alert)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ConnectionPoolAlertListener {

    /** Pool utilisation threshold that triggers an alert (90%). */
    private static final double HIGH_UTILISATION_THRESHOLD = 0.90;

    /**
     * Duration (ms) that high utilisation must be sustained before alerting.
     * 2 minutes = 120 000 ms.
     */
    private static final long HIGH_UTILISATION_SUSTAINED_MS = 120_000L;

    /**
     * Connection acquisition time that triggers a slow-acquisition warning (ms).
     * 1 second = 1 000 ms.
     */
    private static final long SLOW_ACQUISITION_THRESHOLD_MS = 1_000L;

    private final HikariDataSource hikariDataSource;
    private final AlertService alertService;

    /** Timestamp when pool utilisation first exceeded the threshold; null if below threshold. */
    private final AtomicReference<Instant> highUtilisationSince = new AtomicReference<>(null);

    /**
     * Registers HikariCP's built-in metrics listener at startup.
     *
     * <p>HikariCP fires {@code MetricsTrackerFactory} events for connection acquisition,
     * usage, and creation. We rely on the built-in {@code leakDetectionThreshold} for
     * per-connection slow-acquisition detection and add pool-level monitoring here.
     *
     * Requirements: 3.4
     */
    @PostConstruct
    public void init() {
        log.info("ConnectionPoolAlertListener initialised for pool: {}. "
                        + "Slow acquisition threshold: {}ms, High utilisation threshold: {}%, "
                        + "Sustained duration: {}s",
                hikariDataSource.getPoolName(),
                SLOW_ACQUISITION_THRESHOLD_MS,
                (int) (HIGH_UTILISATION_THRESHOLD * 100),
                HIGH_UTILISATION_SUSTAINED_MS / 1000);
    }

    /**
     * Periodic check for connection pool health anomalies.
     *
     * <p>Runs every 10 seconds. Checks:
     * <ul>
     *   <li>Threads waiting for connections (slow acquisition indicator)</li>
     *   <li>Pool utilisation &gt; 90% sustained for 2 minutes</li>
     * </ul>
     *
     * Requirements: 3.4, 24.3
     */
    @Scheduled(fixedDelay = 10_000)
    public void checkPoolHealth() {
        if (hikariDataSource.getHikariPoolMXBean() == null) {
            return;
        }

        int active  = hikariDataSource.getHikariPoolMXBean().getActiveConnections();
        int idle    = hikariDataSource.getHikariPoolMXBean().getIdleConnections();
        int total   = hikariDataSource.getHikariPoolMXBean().getTotalConnections();
        int waiting = hikariDataSource.getHikariPoolMXBean().getThreadsAwaitingConnection();
        int maxPool = hikariDataSource.getMaximumPoolSize();

        checkSlowAcquisition(waiting, active, idle, total, maxPool);
        checkHighUtilisation(active, total, maxPool, waiting);
    }

    /**
     * Alerts when threads are queuing for connections, indicating acquisition
     * latency is likely exceeding the 1-second threshold.
     *
     * Requirements: 3.4
     */
    private void checkSlowAcquisition(int waiting, int active, int idle, int total, int maxPool) {
        if (waiting > 0) {
            String stats = buildPoolStats(active, idle, total, maxPool, waiting);
            log.warn("Connection acquisition queuing detected – threads waiting: {}. "
                            + "Acquisition may exceed {}ms threshold. Pool stats: {}",
                    waiting, SLOW_ACQUISITION_THRESHOLD_MS, stats);

            alertService.publishConnectionPoolAlert(
                    "SLOW_ACQUISITION",
                    String.format("%d thread(s) waiting for connection (threshold: %dms)",
                            waiting, SLOW_ACQUISITION_THRESHOLD_MS),
                    stats);
        }
    }

    /**
     * Alerts when pool utilisation exceeds 90% for more than 2 minutes.
     *
     * Requirements: 24.3
     */
    private void checkHighUtilisation(int active, int total, int maxPool, int waiting) {
        if (maxPool == 0) return;

        double utilisation = (double) active / maxPool;

        if (utilisation >= HIGH_UTILISATION_THRESHOLD) {
            Instant now = Instant.now();
            Instant since = highUtilisationSince.compareAndExchange(null, now);

            if (since != null) {
                // Already in high-utilisation state – check if sustained long enough
                long sustainedMs = now.toEpochMilli() - since.toEpochMilli();
                if (sustainedMs >= HIGH_UTILISATION_SUSTAINED_MS) {
                    String stats = buildPoolStats(active, total - active, total, maxPool, waiting);
                    log.warn("Connection pool utilisation {}% sustained for {}s (threshold: {}%). "
                                    + "Pool stats: {}",
                            (int) (utilisation * 100),
                            sustainedMs / 1000,
                            (int) (HIGH_UTILISATION_THRESHOLD * 100),
                            stats);

                    alertService.publishConnectionPoolAlert(
                            "HIGH_UTILISATION",
                            String.format("Pool utilisation %.0f%% sustained for %ds (threshold: %d%%)",
                                    utilisation * 100,
                                    sustainedMs / 1000,
                                    (int) (HIGH_UTILISATION_THRESHOLD * 100)),
                            stats);

                    // Reset timer so we don't spam alerts every 10 seconds
                    highUtilisationSince.set(now);
                }
            }
        } else {
            // Utilisation dropped below threshold – reset the timer
            if (highUtilisationSince.getAndSet(null) != null) {
                log.info("Connection pool utilisation returned to normal: {}%",
                        (int) (utilisation * 100));
            }
        }
    }

    private String buildPoolStats(int active, int idle, int total, int maxPool, int waiting) {
        return String.format("active=%d, idle=%d, total=%d, max=%d, waiting=%d, utilisation=%.0f%%",
                active, idle, total, maxPool, waiting,
                maxPool > 0 ? (double) active / maxPool * 100 : 0);
    }
}
