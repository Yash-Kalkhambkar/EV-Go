package com.evgo.ai.dto;

/**
 * Chat response returned to the frontend.
 */
public record ChatResponse(String reply, boolean fallback) {
    public static ChatResponse of(String reply) {
        return new ChatResponse(reply, false);
    }
    public static ChatResponse fallback(String reply) {
        return new ChatResponse(reply, true);
    }
}
