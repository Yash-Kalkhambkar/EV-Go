package com.evgo.ai;

import com.evgo.ai.dto.ChatRequest;
import com.evgo.ai.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

/**
 * Claude API integration with basic error handling and conversation management.
 * V1: Simple try/catch fallback (no circuit breaker infrastructure).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private static final String CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
    private static final int MAX_MESSAGES = 50;

    @Value("${app.claude.api-key:}")
    private String claudeApiKey;

    @Value("${app.claude.model:claude-sonnet-4-20250514}")
    private String claudeModel;

    @Value("${app.claude.max-tokens:1000}")
    private int maxTokens;

    private final ConversationStore conversationStore;

    /**
     * Processes a chat message with basic error handling.
     * Falls back gracefully when Claude API is unavailable.
     */
    @Override
    public ChatResponse chat(Long userId, ChatRequest request) {
        try {
            List<Map<String, Object>> history = conversationStore.getHistory(userId);

            // Reject if conversation too long
            if (history.size() >= MAX_MESSAGES) {
                return ChatResponse.of("Conversation is too long. Please start a new chat.");
            }

            // Add user message
            history.add(Map.of("role", "user", "content", request.message()));

            // Trim if needed (keep last 20 messages)
            history = trimHistory(history);

            // Call Claude API
            String reply = callClaude(history);

            // Add assistant reply to history
            history.add(Map.of("role", "assistant", "content", reply));
            conversationStore.saveHistory(userId, history);

            return ChatResponse.of(reply);
        } catch (Exception ex) {
            log.warn("Claude API call failed: {}", ex.getMessage());
            return ChatResponse.fallback(
                    "I'm having trouble connecting right now. Please use the search bar to find stations.");
        }
    }

    /**
     * Trims oldest messages to keep conversation under control.
     * Simple approach: keep last 20 messages.
     */
    List<Map<String, Object>> trimHistory(List<Map<String, Object>> history) {
        while (history.size() > 20) {
            history.remove(0);
        }
        return history;
    }

    private String callClaude(List<Map<String, Object>> messages) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", claudeApiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> body = new HashMap<>();
            body.put("model", claudeModel);
            body.put("max_tokens", maxTokens);
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(CLAUDE_API_URL, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> content =
                        (List<Map<String, Object>>) response.getBody().get("content");
                if (content != null && !content.isEmpty()) {
                    return (String) content.get(0).get("text");
                }
            }
            return "I couldn't process your request. Please try again.";
        } catch (Exception e) {
            log.error("Claude API call failed: {}", e.getMessage());
            throw new RuntimeException("Claude API error: " + e.getMessage(), e);
        }
    }
}
