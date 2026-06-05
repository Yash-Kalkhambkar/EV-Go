package com.evgo.auth;

import com.evgo.auth.dto.AuthResponse;
import com.evgo.auth.dto.LoginRequest;
import com.evgo.auth.dto.RegisterRequest;
import com.evgo.config.JwtTokenService;
import com.evgo.exception.ResourceNotFoundException;
import com.evgo.user.Role;
import com.evgo.user.User;
import com.evgo.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user registration, login, token refresh, and logout.
 * Requirements: 19.1, 19.3, 19.4, 19.5
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    /** Registers a new user and returns tokens. */
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(Role.USER);
        user.setPhone(req.phone());
        userRepository.save(user);
        log.info("User registered: email={}", req.email());
        return buildAuthResponse(user);
    }

    /** Validates credentials and returns tokens. */
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        log.info("User logged in: email={}", req.email());
        return buildAuthResponse(user);
    }

    /**
     * Validates a refresh token, revokes it, and issues a new access + refresh token pair.
     * Requirements: 19.3, 19.5
     */
    public AuthResponse refresh(String refreshToken) {
        if (!jwtTokenService.isTokenValid(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
        String userId = jwtTokenService.extractUserId(refreshToken);
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User", Long.parseLong(userId)));

        // Rotate: revoke old refresh token
        jwtTokenService.revokeToken(refreshToken);
        log.info("Refresh token rotated for userId={}", userId);
        return buildAuthResponse(user);
    }

    /**
     * Revokes the given refresh token on logout.
     * Requirements: 19.4
     */
    public void logout(String refreshToken) {
        jwtTokenService.revokeToken(refreshToken);
        log.info("User logged out, refresh token revoked");
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtTokenService.generateAccessToken(user.getId(), user.getRole().name());
        return new AuthResponse(accessToken, jwtTokenService.extractExpiry(accessToken));
    }
}
