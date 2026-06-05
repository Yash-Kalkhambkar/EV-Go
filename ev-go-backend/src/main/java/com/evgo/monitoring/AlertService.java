package com.evgo.monitoring;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Placeholder alert service for operational notifications.
 *
 * <p>In production this would integrate with PagerDuty, Cloud Monitoring alerting
 * policies, or a Slack webhook. For now it logs at ERROR level so that log-based
 * alerting in Cloud Logging can trigger notifications.
 *
 * <p>Requirements: 3.4, 24.3
 */
@Slf4j
@Service
public class AlertService {

    /**
     * Publishes a connection pool alert.
     *
     * @param alertType  short identifier for the alert type (e.g. {@code "SLOW_ACQUISITION"})
     * @param message    human-readable description of the alert condition
     * @param details    additional structured details (e.g. pool statistics)
     */
    public void publishConnectionPoolAlert(String alertType, String message, String details) {
        // TODO: integrate with PagerDuty / Cloud Monitoring / Slack in production
        log.error("CONNECTION_POOL_ALERT type={} message={} details={}", alertType, message, details);
    }

    /**
     * Publishes a general operational alert.
     *
     * <p>In production this would integrate with PagerDuty, Cloud Monitoring alerting
     * policies, or a Slack webhook. For now it logs at ERROR level so that log-based
     * alerting in Cloud Logging can trigger notifications.
     *
     * @param alertType  short identifier for the alert type (e.g. {@code "WEBHOOK_RETRY_EXHAUSTED"})
     * @param message    human-readable description of the alert condition
     * @param details    additional structured details (e.g. {@code "orderId=xyz"})
     *
     * Requirements: 4.4
     */
    public void publishAlert(String alertType, String message, String details) {
        // TODO: integrate with PagerDuty / Cloud Monitoring / Slack in production
        log.error("ALERT type={} message={} details={}", alertType, message, details);
    }
}
