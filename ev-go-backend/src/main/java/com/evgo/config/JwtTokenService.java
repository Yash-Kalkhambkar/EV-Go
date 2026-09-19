package com.evgo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

/**
 * Issues and validates JWT access tokens and refresh tokens.
 *
 * <p>Access tokens expire after 24 hours. Refresh tokens expire after 30 days
 * and are stored in HttpOnly cookies. Revoked tokens are tracked in Redis.
 *
 * Requirements: 19.1, 19.3, 19.4, 19.5, 19.6
 */
@Slf4j
@Service
public class JwtTokenService {

    private static final String REVOKED_PREFIX = "jwt:revoked:";

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.access-token-expiry-ms:86400000}")
    private long accessTokenExpiryMs;

    @Value("${app.jwt.refresh-token-expiry-ms:2592000000}")
    private long refreshTokenExpiryMs;

    private final RedisTemplate<String, String> redisTemplate;

    public JwtTokenService(@Qualifier("customStringRedisTemplate") RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /** Generates a signed JWT access token for the given user. */
    public String generateAccessToken(Long userId, String role) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("role", role)
                .claim("type", "access")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(accessTokenExpiryMs)))
                .signWith(signingKey())
                .compact();
    }

    /** Generates a signed JWT refresh token for the given user. */
    public String generateRefreshToken(Long userId) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("type", "refresh")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(refreshTokenExpiryMs)))
                .signWith(signingKey())
                .compact();
    }

    /** Returns true if the token has a valid signature, is not expired, and is not revoked. */
    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            if (claims.getExpiration().before(Date.from(Instant.now()))) {
                return false;
            }
            // Check revocation list in Redis
            String revocationKey = REVOKED_PREFIX + token.hashCode();
            return redisTemplate.opsForValue().get(revocationKey) == null;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /** Extracts the user ID (subject) from a token. */
    public String extractUserId(String token) {
        return parseClaims(token).getSubject();
    }
    
    /** Extracts the user ID (subject) from a token as Long. */
    public Long extractUserIdAsLong(String token) {
        String userId = extractUserId(token);
        return userId != null ? Long.parseLong(userId) : null;
    }

    /** Extracts the role claim from a token. */
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /** Extracts the expiry instant from a token. */
    public Instant extractExpiry(String token) {
        return parseClaims(token).getExpiration().toInstant();
    }

    /**
     * Revokes a token by storing its hash in Redis until its natural expiry.
     * Requirements: 19.4
     */
    public void revokeToken(String token) {
        try {
            Instant expiry = extractExpiry(token);
            long ttlSeconds = Duration.between(Instant.now(), expiry).getSeconds();
            if (ttlSeconds > 0) {
                String revocationKey = REVOKED_PREFIX + token.hashCode();
                redisTemplate.opsForValue().set(revocationKey, "revoked", Duration.ofSeconds(ttlSeconds));
                log.info("Token revoked, ttlSeconds={}", ttlSeconds);
            }
        } catch (Exception e) {
            log.warn("Could not revoke token: {}", e.getMessage());
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}
