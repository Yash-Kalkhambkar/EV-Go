package com.evgo.config;

import com.zaxxer.hikari.HikariDataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test for HikariCP connection pool configuration.
 *
 * <p>Verifies that the connection pool is configured according to requirements:
 * <ul>
 *   <li>Requirement 3.1: minimum-idle: 5, maximum-pool-size: 20</li>
 *   <li>Requirement 3.2: connection-timeout: 3000ms</li>
 *   <li>Requirement 3.5: prepared statement caching enabled</li>
 * </ul>
 *
 * <p>This test validates the configuration from {@code application.yml} is
 * correctly applied to the HikariCP data source bean.
 */
@SpringBootTest
@ActiveProfiles("test")
class HikariConfigTest {

    @Autowired
    private HikariDataSource hikariDataSource;

    /**
     * Verifies HikariCP pool size configuration.
     *
     * Requirements: 3.1
     */
    @Test
    void shouldConfigurePoolSizeCorrectly() {
        assertThat(hikariDataSource.getMinimumIdle())
                .as("Minimum idle connections should be 5")
                .isEqualTo(5);

        assertThat(hikariDataSource.getMaximumPoolSize())
                .as("Maximum pool size should be 20")
                .isEqualTo(20);
    }

    /**
     * Verifies HikariCP connection timeout configuration.
     *
     * Requirements: 3.2
     */
    @Test
    void shouldConfigureConnectionTimeoutCorrectly() {
        assertThat(hikariDataSource.getConnectionTimeout())
                .as("Connection timeout should be 3000ms (3 seconds)")
                .isEqualTo(3000);
    }

    /**
     * Verifies HikariCP idle timeout and max lifetime configuration.
     *
     * Requirements: 3.2
     */
    @Test
    void shouldConfigureConnectionLifetimeCorrectly() {
        assertThat(hikariDataSource.getIdleTimeout())
                .as("Idle timeout should be 600000ms (10 minutes)")
                .isEqualTo(600000);

        assertThat(hikariDataSource.getMaxLifetime())
                .as("Max lifetime should be 1800000ms (30 minutes)")
                .isEqualTo(1800000);
    }

    /**
     * Verifies HikariCP leak detection configuration.
     *
     * Requirements: 3.2
     */
    @Test
    void shouldConfigureLeakDetectionCorrectly() {
        assertThat(hikariDataSource.getLeakDetectionThreshold())
                .as("Leak detection threshold should be 60000ms (60 seconds)")
                .isEqualTo(60000);
    }

    /**
     * Verifies HikariCP connection validation configuration.
     *
     * Requirements: 3.3
     */
    @Test
    void shouldConfigureConnectionValidationCorrectly() {
        assertThat(hikariDataSource.getConnectionTestQuery())
                .as("Connection test query should be 'SELECT 1'")
                .isEqualTo("SELECT 1");

        assertThat(hikariDataSource.getValidationTimeout())
                .as("Validation timeout should be 5000ms (5 seconds)")
                .isEqualTo(5000);

        assertThat(hikariDataSource.getKeepaliveTime())
                .as("Keepalive time should be 30000ms (30 seconds)")
                .isEqualTo(30000);
    }

    /**
     * Verifies HikariCP prepared statement caching configuration.
     *
     * Requirements: 3.5
     */
    @Test
    void shouldConfigurePreparedStatementCachingCorrectly() {
        assertThat(hikariDataSource.getDataSourceProperties())
                .as("Prepared statement caching should be enabled")
                .containsEntry("cachePrepStmts", "true")
                .containsEntry("prepStmtCacheSize", "250")
                .containsEntry("prepStmtCacheSqlLimit", "2048")
                .containsEntry("useServerPrepStmts", "true");
    }

    /**
     * Verifies HikariCP pool name configuration.
     */
    @Test
    void shouldConfigurePoolNameCorrectly() {
        assertThat(hikariDataSource.getPoolName())
                .as("Pool name should be 'EVGoHikariPool'")
                .isEqualTo("EVGoHikariPool");
    }
}
