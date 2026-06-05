package com.evgo.ai;

import com.evgo.ai.dto.ChatRequest;
import com.evgo.ai.dto.ChatResponse;

/**
 * Contract for AI chat operations.
 * Requirements: 14.1, 14.2, 15.1
 */
public interface AIService {
    /**
     * Processes a chat message with circuit breaker protection.
     * Falls back to a helpful message when Claude API is unavailable.
     */
    ChatResponse chat(Long userId, ChatRequest request);
}
