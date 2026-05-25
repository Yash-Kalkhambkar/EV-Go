package com.evgo.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.util.StringUtils;

/**
 * Redis configuration providing:
 * <ul>
 *   <li>{@link RedissonClient} – distributed locking via Redisson (Req 1.1, 1.3)</li>
 *   <li>{@link RedisTemplate} – general-purpose caching operations (Req 9.1)</li>
 *   <li>{@link RedisMessageListenerContainer} – Pub/Sub for WebSocket backplane (Req 7.1)</li>
 * </ul>
 */
@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    // ── Redisson ──────────────────────────────────────────────────────────────

    /**
     * Redisson client used for distributed locking (RLock) and Bucket4j rate limiting.
     *
     * <p>Connection pool is sized to match the HikariCP pool so that lock operations
     * never queue behind cache operations:
     * <ul>
     *   <li>connectionPoolSize: 20 – matches HikariCP maximum-pool-size</li>
     *   <li>connectionMinimumIdleSize: 5 – matches HikariCP minimum-idle</li>
     * </ul>
     *
     * Requirements: 1.1 (distributed lock), 1.3 (Redis connection pool)
     */
    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() {
        Config config = new Config();

        String address = "redis://" + redisHost + ":" + redisPort;

        var serverConfig = config.useSingleServer()
                .setAddress(address)
                .setConnectionPoolSize(20)
                .setConnectionMinimumIdleSize(5)
                .setConnectTimeout(3000)
                .setTimeout(2000)
                .setRetryAttempts(3)
                .setRetryInterval(1500);

        if (StringUtils.hasText(redisPassword)) {
            serverConfig.setPassword(redisPassword);
        }

        return Redisson.create(config);
    }

    // ── RedisTemplate ─────────────────────────────────────────────────────────

    /**
     * General-purpose {@link RedisTemplate} with String keys and String values.
     *
     * <p>Using String serializers throughout keeps stored data human-readable and
     * avoids Java serialization issues across deployments.
     *
     * <p>Used by:
     * <ul>
     *   <li>Station cache (Req 9.1, 9.2)</li>
     *   <li>Payment idempotency cache (Req 5.2)</li>
     *   <li>Webhook deduplication cache (Req 4.2)</li>
     *   <li>AI conversation history (Req 15.7)</li>
     *   <li>WebSocket Pub/Sub publishing (Req 7.2)</li>
     * </ul>
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        template.setKeySerializer(stringSerializer);
        template.setValueSerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setHashValueSerializer(stringSerializer);
        template.setDefaultSerializer(stringSerializer);

        template.setEnableTransactionSupport(false); // Managed at service layer
        template.afterPropertiesSet();

        return template;
    }

    /**
     * Lettuce connection factory used by {@link RedisTemplate}.
     *
     * <p>Redisson manages its own connection pool; this factory is for Spring Data Redis
     * operations (caching, Pub/Sub publishing).
     */
    @Bean
    public LettuceConnectionFactory lettuceConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        if (StringUtils.hasText(redisPassword)) {
            config.setPassword(redisPassword);
        }
        return new LettuceConnectionFactory(config);
    }

    // ── Redis Pub/Sub ─────────────────────────────────────────────────────────

    /**
     * Container that manages Redis Pub/Sub message listeners.
     *
     * <p>The {@code SlotBroadcaster} registers listeners at runtime for each station
     * topic ({@code slot:updates:{stationId}}) as WebSocket clients subscribe.
     * The container handles reconnection automatically on Redis failover.
     *
     * Requirements: 7.1 (Redis Pub/Sub backplane), 7.4 (subscription management)
     */
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // Allow the container to recover from connection failures automatically
        container.setRecoveryInterval(5000L);

        // Use a dedicated thread pool so Pub/Sub processing does not block
        // the main application thread pool
        container.setTaskExecutor(pubSubTaskExecutor());

        return container;
    }

    /**
     * Dedicated task executor for Redis Pub/Sub message processing.
     *
     * <p>Sized to handle concurrent messages from multiple station topics without
     * blocking WebSocket broadcast operations.
     */
    @Bean
    public java.util.concurrent.Executor pubSubTaskExecutor() {
        var executor = new org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("redis-pubsub-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(10);
        executor.initialize();
        return executor;
    }
}
