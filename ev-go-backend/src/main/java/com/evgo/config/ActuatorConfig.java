package com.evgo.config;

import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.config.MeterFilter;
import io.micrometer.core.instrument.distribution.DistributionStatisticConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Spring Boot Actuator and Micrometer metrics configuration.
 *
 * <p>Configures:
 * <ul>
 *   <li>Common tags applied to every metric: {@code application} and {@code environment}</li>
 *   <li>{@link TimedAspect} bean enabling {@code @Timed} annotation support on Spring beans</li>
 *   <li>HTTP server request metrics with percentile histograms (p50, p95, p99)</li>
 * </ul>
 *
 * <p>Metrics are exported to Prometheus via the {@code /actuator/prometheus} endpoint
 * (configured in {@code application.yml}).
 *
 * <p>Requirements: 21.1 (metrics collection), 21.7 (Micrometer integration)
 */
@Slf4j
@Configuration
public class ActuatorConfig {

    @Value("${spring.application.name:ev-go-backend}")
    private String applicationName;

    @Value("${APP_ENV:local}")
    private String environment;

    /**
     * Customises the {@link MeterRegistry} with common tags applied to every metric.
     *
     * <p>Common tags allow Prometheus / Grafana dashboards to filter metrics by
     * application name and deployment environment without requiring per-metric labels.
     *
     * <p>Tags added:
     * <ul>
     *   <li>{@code application} – value of {@code spring.application.name}</li>
     *   <li>{@code environment} – value of {@code APP_ENV} env variable (default: local)</li>
     * </ul>
     *
     * Requirements: 21.1, 21.7
     */
    @Bean
    public MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> {
            registry.config()
                    .commonTags("application", applicationName, "environment", environment)
                    .meterFilter(httpServerRequestPercentileFilter());

            log.info("MeterRegistry configured with common tags: application={}, environment={}",
                    applicationName, environment);
        };
    }

    /**
     * {@link TimedAspect} bean that enables the {@code @Timed} annotation on any
     * Spring-managed bean method.
     *
     * <p>Usage:
     * <pre>{@code
     * @Timed(value = "booking.create", description = "Time to create a booking")
     * public BookingDto createBooking(CreateBookingRequest request, Long userId) { ... }
     * }</pre>
     *
     * Requirements: 21.7
     */
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        log.info("TimedAspect registered – @Timed annotation support enabled");
        return new TimedAspect(registry);
    }

    /**
     * {@link MeterFilter} that configures HTTP server request metrics with
     * percentile histograms for p50, p95, and p99 latency tracking.
     *
     * <p>Percentile histograms allow Prometheus to compute accurate quantiles
     * across multiple instances (unlike client-side percentiles which cannot be
     * aggregated across instances).
     *
     * Requirements: 21.1
     */
    private MeterFilter httpServerRequestPercentileFilter() {
        return new MeterFilter() {
            @Override
            public DistributionStatisticConfig configure(
                    io.micrometer.core.instrument.Meter.Id id,
                    DistributionStatisticConfig config) {

                if (id.getName().startsWith("http.server.requests")) {
                    return DistributionStatisticConfig.builder()
                            // Publish histogram buckets for Prometheus histogram_quantile()
                            .percentilesHistogram(true)
                            // Client-side percentiles (useful for non-aggregated dashboards)
                            .percentiles(0.5, 0.95, 0.99)
                            // SLA buckets for latency distribution (ms)
                            .serviceLevelObjectives(
                                    Duration.ofMillis(50).toNanos(),
                                    Duration.ofMillis(100).toNanos(),
                                    Duration.ofMillis(250).toNanos(),
                                    Duration.ofMillis(500).toNanos(),
                                    Duration.ofSeconds(1).toNanos(),
                                    Duration.ofSeconds(2).toNanos()
                            )
                            // Expire histogram buckets after 2 minutes of inactivity
                            .expiry(Duration.ofMinutes(2))
                            .bufferLength(3)
                            .build()
                            .merge(config);
                }
                return config;
            }
        };
    }
}
