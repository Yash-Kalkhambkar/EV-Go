package com.evgo.auth.dto;

import java.time.Instant;

/**
 * Authentication response containing the access token and its expiry.
 * Requirements: 19.1
 */
public record AuthResponse(
        String accessToken,
        Instant expiresAt
) {}
