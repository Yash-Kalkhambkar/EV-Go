package com.evgo.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit test for {@link TransactionConfig}.
 *
 * <p>Verifies that the two {@link TransactionTemplate} beans are configured
 * with the isolation levels and timeout required by the spec:
 * <ul>
 *   <li>Requirement 2.1 – READ_COMMITTED for read-only queries</li>
 *   <li>Requirement 2.2 – REPEATABLE_READ for booking write operations</li>
 *   <li>Requirement 2.3 – 5-second transaction timeout</li>
 * </ul>
 *
 * <p>Uses plain Mockito without a Spring Boot application context to keep
 * the test lightweight and free of infrastructure dependencies (database, Redis).
 */
@ExtendWith(MockitoExtension.class)
class TransactionConfigTest {

    @Mock
    private PlatformTransactionManager txManager;

    private TransactionConfig transactionConfig;

    @BeforeEach
    void setUp() throws Exception {
        transactionConfig = new TransactionConfig();
        // Inject the default timeout value (5 seconds) via the @Value field using reflection
        var timeoutField = TransactionConfig.class.getDeclaredField("transactionTimeoutSeconds");
        timeoutField.setAccessible(true);
        timeoutField.set(transactionConfig, 5);
    }

    // ── Isolation level constants ──────────────────────────────────────────────

    /**
     * ISOLATION_READ_ONLY constant must equal READ_COMMITTED.
     *
     * Requirements: 2.1
     */
    @Test
    void isolationReadOnlyConstantShouldBeReadCommitted() {
        assertThat(TransactionConfig.ISOLATION_READ_ONLY)
                .as("ISOLATION_READ_ONLY should be READ_COMMITTED")
                .isEqualTo(TransactionDefinition.ISOLATION_READ_COMMITTED);
    }

    /**
     * ISOLATION_BOOKING constant must equal REPEATABLE_READ.
     *
     * Requirements: 2.2
     */
    @Test
    void isolationBookingConstantShouldBeRepeatableRead() {
        assertThat(TransactionConfig.ISOLATION_BOOKING)
                .as("ISOLATION_BOOKING should be REPEATABLE_READ")
                .isEqualTo(TransactionDefinition.ISOLATION_REPEATABLE_READ);
    }

    // ── Read-only template ────────────────────────────────────────────────────

    /**
     * readOnlyTransactionTemplate must use READ_COMMITTED isolation.
     *
     * Requirements: 2.1
     */
    @Test
    void readOnlyTemplateShouldUseReadCommittedIsolation() {
        TransactionTemplate template = transactionConfig.readOnlyTransactionTemplate(txManager);

        assertThat(template.getIsolationLevel())
                .as("Read-only template should use READ_COMMITTED isolation")
                .isEqualTo(TransactionDefinition.ISOLATION_READ_COMMITTED);
    }

    /**
     * readOnlyTransactionTemplate must be marked read-only.
     *
     * Requirements: 2.1
     */
    @Test
    void readOnlyTemplateShouldBeReadOnly() {
        TransactionTemplate template = transactionConfig.readOnlyTransactionTemplate(txManager);

        assertThat(template.isReadOnly())
                .as("Read-only template should have readOnly=true")
                .isTrue();
    }

    /**
     * readOnlyTransactionTemplate must have a 5-second timeout.
     *
     * Requirements: 2.3
     */
    @Test
    void readOnlyTemplateShouldHaveFiveSecondTimeout() {
        TransactionTemplate template = transactionConfig.readOnlyTransactionTemplate(txManager);

        assertThat(template.getTimeout())
                .as("Read-only template timeout should be 5 seconds")
                .isEqualTo(5);
    }

    // ── Booking template ──────────────────────────────────────────────────────

    /**
     * bookingTransactionTemplate must use REPEATABLE_READ isolation.
     *
     * Requirements: 2.2
     */
    @Test
    void bookingTemplateShouldUseRepeatableReadIsolation() {
        TransactionTemplate template = transactionConfig.bookingTransactionTemplate(txManager);

        assertThat(template.getIsolationLevel())
                .as("Booking template should use REPEATABLE_READ isolation")
                .isEqualTo(TransactionDefinition.ISOLATION_REPEATABLE_READ);
    }

    /**
     * bookingTransactionTemplate must NOT be marked read-only (write operations).
     *
     * Requirements: 2.2
     */
    @Test
    void bookingTemplateShouldNotBeReadOnly() {
        TransactionTemplate template = transactionConfig.bookingTransactionTemplate(txManager);

        assertThat(template.isReadOnly())
                .as("Booking template should have readOnly=false (write operations)")
                .isFalse();
    }

    /**
     * bookingTransactionTemplate must have a 5-second timeout.
     *
     * Requirements: 2.3
     */
    @Test
    void bookingTemplateShouldHaveFiveSecondTimeout() {
        TransactionTemplate template = transactionConfig.bookingTransactionTemplate(txManager);

        assertThat(template.getTimeout())
                .as("Booking template timeout should be 5 seconds")
                .isEqualTo(5);
    }

    // ── Consistency between constant and template ────────────────────────────

    /**
     * The ISOLATION_BOOKING constant and the booking template must agree on the
     * isolation level, ensuring @Transactional annotations and template-based
     * usage are consistent.
     *
     * Requirements: 2.2
     */
    @Test
    void bookingIsolationConstantShouldMatchTemplateIsolationLevel() {
        TransactionTemplate template = transactionConfig.bookingTransactionTemplate(txManager);

        assertThat(TransactionConfig.ISOLATION_BOOKING)
                .as("Constant and template should use the same isolation level value")
                .isEqualTo(template.getIsolationLevel());
    }
}
