package com.evgo.shorturl.dto;

import java.time.Instant;

/**
 * Short URL response DTO.
 * 
 * @param id Short URL ID
 * @param shortCode 7-character code (e.g., "abc123x")
 * @param shortUrl Full short URL (e.g., "https://evgo.in/b/abc123x")
 * @param originalUrl Original URL to redirect to
 * @param clickCount Number of times accessed
 * @param expiresAt Optional: expiry timestamp
 * @param createdAt When created
 */
public record ShortUrlDto(
        Long id,
        String shortCode,
        String shortUrl,
        String originalUrl,
        Integer clickCount,
        Instant expiresAt,
        Instant createdAt
) {}
