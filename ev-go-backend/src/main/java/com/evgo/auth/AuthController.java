package com.evgo.auth;

import com.evgo.auth.dto.AuthResponse;
import com.evgo.auth.dto.LoginRequest;
import com.evgo.auth.dto.RegisterRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 * Authentication endpoints: register, login, refresh, logout.
 *
 * <p>Refresh tokens are stored in HttpOnly cookies (not returned in the body)
 * to prevent XSS access.
 *
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_COOKIE = "refresh_token";
    private static final int REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

    private final AuthService authService;
    private final com.evgo.config.JwtTokenService jwtTokenService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest req,
            HttpServletResponse response) {
        AuthResponse auth = authService.register(req);
        setRefreshCookie(response, jwtTokenService.generateRefreshToken(
                Long.parseLong(extractUserIdFromToken(auth.accessToken()))));
        return ResponseEntity.ok(auth);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest req,
            HttpServletResponse response) {
        AuthResponse auth = authService.login(req);
        setRefreshCookie(response, jwtTokenService.generateRefreshToken(
                Long.parseLong(extractUserIdFromToken(auth.accessToken()))));
        return ResponseEntity.ok(auth);
    }

    /**
     * Issues a new access token using the refresh token from the HttpOnly cookie.
     * Requirements: 19.3, 19.5
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = extractRefreshCookie(request);
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse auth = authService.refresh(refreshToken);
        // Rotate: set new refresh token cookie
        setRefreshCookie(response, jwtTokenService.generateRefreshToken(
                Long.parseLong(extractUserIdFromToken(auth.accessToken()))));
        return ResponseEntity.ok(auth);
    }

    /**
     * Invalidates the refresh token cookie on logout.
     * Requirements: 19.4
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshCookie(request);
        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        // Clear the cookie
        Cookie cookie = new Cookie(REFRESH_COOKIE, "");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void setRefreshCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie(REFRESH_COOKIE, refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(REFRESH_COOKIE_MAX_AGE);
        response.addCookie(cookie);
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_COOKIE.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private String extractUserIdFromToken(String token) {
        return jwtTokenService.extractUserId(token);
    }
}
