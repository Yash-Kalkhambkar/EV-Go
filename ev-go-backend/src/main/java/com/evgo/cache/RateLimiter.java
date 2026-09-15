package com.evgo.cache;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Redis-backed rate limiter using token bucket algorithm.
 * 
 * <p>Limits requests per IP address per endpoint:
 * <ul>
 *   <li>100 requests per minute per IP (default)</li>
 *   <li>Sliding window via Redis key expiry</li>
 *   <li>Returns 429 Too Many Requests when limit exceeded</li>
 * </ul>
 * 
 * <p>Implementation uses Redis INCR + EXPIRE for atomic counting.
 * Key pattern: {@code rate_limit:{endpoint}:{clientIp}}
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimiter {
    
    private final RedisTemplate<String, String> stringRedisTemplate;
    
    private static final int MAX_REQUESTS_PER_MINUTE = 100;
    private static final Duration WINDOW_DURATION = Duration.ofMinutes(1);
    
    /**
     * Check if request is allowed under rate limit.
     * 
     * @param clientIp Client IP address (from X-Forwarded-For or RemoteAddr)
     * @param endpoint Request URI (e.g., /api/stations/search)
     * @return true if request is allowed, false if rate limit exceeded
     */
    public boolean isAllowed(String clientIp, String endpoint) {
        String key = buildKey(endpoint, clientIp);
        
        try {
            // Increment counter atomically
            Long count = stringRedisTemplate.opsForValue().increment(key);
            
            if (count == null) {
                log.warn("Redis increment returned null for key={}", key);
                return true; // Fail open (allow request if Redis unavailable)
            }
            
            // Set expiry on first request in window
            if (count == 1) {
                stringRedisTemplate.expire(key, WINDOW_DURATION);
            }
            
            boolean allowed = count <= MAX_REQUESTS_PER_MINUTE;
            
            if (!allowed) {
                log.debug("Rate limit exceeded: ip={}, endpoint={}, count={}", 
                         clientIp, endpoint, count);
            }
            
            return allowed;
            
        } catch (Exception e) {
            // Fail open: allow request if Redis is unavailable
            log.error("Rate limiter error for ip={}, endpoint={}: {}", 
                     clientIp, endpoint, e.getMessage());
            return true;
        }
    }
    
    /**
     * Get current request count for client/endpoint.
     * Used for debugging and monitoring.
     * 
     * @param clientIp Client IP address
     * @param endpoint Request URI
     * @return current count, or 0 if no requests in current window
     */
    public int getCurrentCount(String clientIp, String endpoint) {
        String key = buildKey(endpoint, clientIp);
        
        try {
            String value = stringRedisTemplate.opsForValue().get(key);
            return value != null ? Integer.parseInt(value) : 0;
        } catch (Exception e) {
            log.warn("Failed to get rate limit count for key={}: {}", key, e.getMessage());
            return 0;
        }
    }
    
    /**
     * Reset rate limit for specific client/endpoint.
     * Used for testing or manual admin intervention.
     * 
     * @param clientIp Client IP address
     * @param endpoint Request URI
     */
    public void reset(String clientIp, String endpoint) {
        String key = buildKey(endpoint, clientIp);
        stringRedisTemplate.delete(key);
        log.info("Rate limit reset for ip={}, endpoint={}", clientIp, endpoint);
    }
    
    /**
     * Build Redis key for rate limiting.
     * Pattern: rate_limit:{endpoint}:{clientIp}
     */
    private String buildKey(String endpoint, String clientIp) {
        // Sanitize endpoint to avoid Redis key injection
        String sanitizedEndpoint = endpoint.replaceAll("[^a-zA-Z0-9/_-]", "_");
        return "rate_limit:" + sanitizedEndpoint + ":" + clientIp;
    }
}
