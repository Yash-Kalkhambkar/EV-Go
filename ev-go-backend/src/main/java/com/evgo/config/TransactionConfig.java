package com.evgo.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Transaction configuration for the EV GO booking system.
 *
 * <p>Defines two isolation levels used throughout the application:
 * <ul>
 *   <li>{@link #ISOLATION_READ_ONLY} – {@code READ_COMMITTED} for read-only queries
 *       (station search, slot availability). Prevents dirty reads while allowing
 *       maximum concurrency.</li>
 *   <li>{@link #ISOLATION_BOOKING} – {@code REPEATABLE_READ} for booking operations.
 *       Prevents non-repeatable reads so that slot status cannot change between the
 *       initial availability check and the booking write within the same transaction.</li>
 * </ul>
 *
 * <p>Transaction timeout defaults to 5 seconds and is configurable via
 * {@code app.booking.transaction-timeout-seconds}.
 *
 * <p>Requirements: 2.1 (READ_COMMITTED for reads), 2.2 (REPEATABLE_READ for bookings),
 * 2.3 (transaction timeout)
 */
@Slf4j
@Configuration
@EnableTransactionManagement
public class TransactionConfig {

    // ── Isolation level constants ──────────────────────────────────────────────

    /**
     * Isolation level for read-only queries.
     *
     * <p>READ_COMMITTED prevents dirty reads while allowing concurrent writes to
     * proceed without blocking readers. Suitable for station search, slot listing,
     * and any query that does not need to see a consistent snapshot across multiple
     * reads within the same transaction.
     *
     * Requirements: 2.1
     */
    public static final int ISOLATION_READ_ONLY = TransactionDefinition.ISOLATION_READ_COMMITTED;

    /**
     * Isolation level for booking operations.
     *
     * <p>REPEATABLE_READ ensures that once a slot's status is read as AVAILABLE,
     * it cannot be changed by another transaction until the current transaction
     * completes. This is the second line of defence after the Redis distributed lock.
     *
     * Requirements: 2.2
     */
    public static final int ISOLATION_BOOKING = TransactionDefinition.ISOLATION_REPEATABLE_READ;

    @Value("${app.booking.transaction-timeout-seconds:5}")
    private int transactionTimeoutSeconds;

    // ── TransactionTemplate beans ──────────────────────────────────────────────

    /**
     * {@link TransactionTemplate} for read-only operations.
     *
     * <p>Configured with:
     * <ul>
     *   <li>Isolation: READ_COMMITTED</li>
     *   <li>Read-only: true (allows JDBC driver / Hibernate optimisations)</li>
     *   <li>Timeout: {@code app.booking.transaction-timeout-seconds} (default 5 s)</li>
     * </ul>
     *
     * Requirements: 2.1, 2.3
     */
    @Bean("readOnlyTransactionTemplate")
    public TransactionTemplate readOnlyTransactionTemplate(PlatformTransactionManager txManager) {
        TransactionTemplate template = new TransactionTemplate(txManager);
        template.setIsolationLevel(ISOLATION_READ_ONLY);
        template.setReadOnly(true);
        template.setTimeout(transactionTimeoutSeconds);
        log.info("Configured readOnlyTransactionTemplate: isolation=READ_COMMITTED, timeout={}s",
                transactionTimeoutSeconds);
        return template;
    }

    /**
     * {@link TransactionTemplate} for booking write operations.
     *
     * <p>Configured with:
     * <ul>
     *   <li>Isolation: REPEATABLE_READ</li>
     *   <li>Read-only: false</li>
     *   <li>Timeout: {@code app.booking.transaction-timeout-seconds} (default 5 s)</li>
     * </ul>
     *
     * Requirements: 2.2, 2.3
     */
    @Bean("bookingTransactionTemplate")
    public TransactionTemplate bookingTransactionTemplate(PlatformTransactionManager txManager) {
        TransactionTemplate template = new TransactionTemplate(txManager);
        template.setIsolationLevel(ISOLATION_BOOKING);
        template.setReadOnly(false);
        template.setTimeout(transactionTimeoutSeconds);
        log.info("Configured bookingTransactionTemplate: isolation=REPEATABLE_READ, timeout={}s",
                transactionTimeoutSeconds);
        return template;
    }
}
