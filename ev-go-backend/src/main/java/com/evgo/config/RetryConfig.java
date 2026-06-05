package com.evgo.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.RetryContext;
import org.springframework.retry.RetryListener;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

import java.sql.SQLException;

/**
 * Retry configuration for database deadlock detection and recovery.
 *
 * <p>Configures a {@link RetryTemplate} with exponential backoff that retries
 * on PostgreSQL deadlock errors and Spring's lock-acquisition exceptions:
 * <ul>
 *   <li>{@link SQLException} with SQLState {@code 40P01} (PostgreSQL deadlock detected)</li>
 *   <li>{@link CannotAcquireLockException} – Spring wrapper for lock timeout errors</li>
 *   <li>{@link PessimisticLockingFailureException} – Spring wrapper for pessimistic lock failures</li>
 * </ul>
 *
 * <p>Backoff schedule: 100 ms → 200 ms → 400 ms (max 3 retries, multiplier 2.0).
 *
 * <p>Requirements: 2.4 (deadlock retry), 2.7 (exponential backoff)
 */
@Slf4j
@Configuration
@EnableRetry
public class RetryConfig {

    /** PostgreSQL SQLState code for deadlock detected. */
    private static final String PSQL_DEADLOCK_STATE = "40P01";

    /** Maximum number of retry attempts (initial attempt + 3 retries = 4 total calls). */
    private static final int MAX_ATTEMPTS = 3;

    /** Initial backoff interval in milliseconds. */
    private static final long INITIAL_INTERVAL_MS = 100L;

    /** Backoff multiplier applied after each retry. */
    private static final double BACKOFF_MULTIPLIER = 2.0;

    /** Maximum backoff interval cap in milliseconds. */
    private static final long MAX_INTERVAL_MS = 400L;

    /**
     * {@link RetryTemplate} configured for database deadlock recovery.
     *
     * <p>Retry policy covers:
     * <ul>
     *   <li>{@link PessimisticLockingFailureException} – Spring wraps PostgreSQL 40P01</li>
     *   <li>{@link CannotAcquireLockException} – lock wait timeout exceeded</li>
     *   <li>{@link SQLException} – raw JDBC deadlock; only retried when SQLState is {@code 40P01}</li>
     * </ul>
     *
     * Requirements: 2.4, 2.7
     */
    @Bean("deadlockRetryTemplate")
    public RetryTemplate deadlockRetryTemplate() {
        SimpleRetryPolicy retryPolicy = new DeadlockRetryPolicy(MAX_ATTEMPTS);

        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(INITIAL_INTERVAL_MS);
        backOffPolicy.setMultiplier(BACKOFF_MULTIPLIER);
        backOffPolicy.setMaxInterval(MAX_INTERVAL_MS);

        RetryTemplate template = new RetryTemplate();
        template.setRetryPolicy(retryPolicy);
        template.setBackOffPolicy(backOffPolicy);
        template.registerListener(new DeadlockRetryListener());

        return template;
    }

    /**
     * Custom retry policy that retries on deadlock-related exceptions only.
     *
     * <p>For {@link SQLException}, only retries when SQLState is {@code 40P01}
     * (PostgreSQL deadlock detected). Spring's {@link PessimisticLockingFailureException}
     * and {@link CannotAcquireLockException} are always retried.
     */
    private static class DeadlockRetryPolicy extends SimpleRetryPolicy {

        DeadlockRetryPolicy(int maxAttempts) {
            super(maxAttempts);
        }

        @Override
        public boolean canRetry(RetryContext context) {
            Throwable lastThrowable = context.getLastThrowable();
            if (lastThrowable == null) {
                return true;
            }

            // Always retry Spring's pessimistic lock / lock-acquisition wrappers
            if (lastThrowable instanceof PessimisticLockingFailureException
                    || lastThrowable instanceof CannotAcquireLockException) {
                return super.canRetry(context);
            }

            // For raw SQLException, only retry on PostgreSQL deadlock SQLState 40P01
            if (lastThrowable instanceof SQLException sqlEx) {
                return PSQL_DEADLOCK_STATE.equals(sqlEx.getSQLState()) && super.canRetry(context);
            }

            // Check cause chain for wrapped SQLExceptions
            Throwable cause = lastThrowable.getCause();
            while (cause != null) {
                if (cause instanceof SQLException sqlEx) {
                    return PSQL_DEADLOCK_STATE.equals(sqlEx.getSQLState()) && super.canRetry(context);
                }
                cause = cause.getCause();
            }

            return false;
        }
    }

    /**
     * Retry listener that logs each retry attempt with context information.
     * Requirements: 2.4
     */
    private static class DeadlockRetryListener implements RetryListener {

        @Override
        public <T, E extends Throwable> void onError(RetryContext context,
                                                      RetryCallback<T, E> callback,
                                                      Throwable throwable) {
            int attempt = context.getRetryCount();
            String exceptionType = throwable.getClass().getSimpleName();
            String sqlState = extractSqlState(throwable);
            Object isolationLevel = context.getAttribute("isolationLevel");
            String isolation = isolationLevel != null ? isolationLevel.toString() : "UNKNOWN";

            log.warn("Database lock/deadlock retry: attempt={}, exceptionType={}, sqlState={}, "
                            + "isolationLevel={}, message={}",
                    attempt, exceptionType, sqlState, isolation, throwable.getMessage());
        }

        @Override
        public <T, E extends Throwable> void onSuccess(RetryContext context,
                                                        RetryCallback<T, E> callback,
                                                        T result) {
            if (context.getRetryCount() > 0) {
                log.info("Database operation succeeded after {} retries", context.getRetryCount());
            }
        }

        private String extractSqlState(Throwable throwable) {
            if (throwable instanceof SQLException sqlEx) {
                return sqlEx.getSQLState() != null ? sqlEx.getSQLState() : "N/A";
            }
            Throwable cause = throwable.getCause();
            while (cause != null) {
                if (cause instanceof SQLException sqlEx) {
                    return sqlEx.getSQLState() != null ? sqlEx.getSQLState() : "N/A";
                }
                cause = cause.getCause();
            }
            return "N/A";
        }
    }
}
