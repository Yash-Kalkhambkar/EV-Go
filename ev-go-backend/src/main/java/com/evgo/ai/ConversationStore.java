package com.evgo.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Redis-backed per-user conversation history store.
 * History expires after 2 hours of inactivity.
 * Requirements: 15.1
 */
@Slf4j
@Component
public class ConversationStore {

    private static final String KEY_PREFIX = "ai:history:";
    private static final Duration TTL = Duration.ofHours(2);

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public ConversationStore(
            @Qualifier("customStringRedisTemplate") RedisTemplate<String, String> redisTemplate,
            ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public List<Map<String, Object>> getHistory(Long userId) {
        try {
            String key = KEY_PREFIX + userId;
            String raw = redisTemplate.opsForValue().get(key);
            if (raw == null) return new ArrayList<>();
            return objectMapper.readValue(raw, new TypeReference<>() {});
        } catch (Exception e) {
            log.warn("Failed to load conversation history for userId={}: {}", userId, e.getMessage());
            return new ArrayList<>();
        }
    }

    public void saveHistory(Long userId, List<Map<String, Object>> history) {
        try {
            String key = KEY_PREFIX + userId;
            String json = objectMapper.writeValueAsString(history);
            redisTemplate.opsForValue().set(key, json, TTL);
        } catch (Exception e) {
            log.warn("Failed to save conversation history for userId={}: {}", userId, e.getMessage());
        }
    }

    public void clearHistory(Long userId) {
        redisTemplate.delete(KEY_PREFIX + userId);
    }
}
