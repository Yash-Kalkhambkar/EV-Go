package com.evgo.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Restrictive CORS configuration.
 *
 * <p>Only allows requests from configured frontend origins (production + staging).
 * Credentials (cookies, Authorization headers) are permitted only for allowed origins.
 *
 * Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6
 */
@Slf4j
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOriginsRaw;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allowed origins from config (comma-separated) — Req 20.1, 20.6
        List<String> origins = Arrays.asList(allowedOriginsRaw.split(","));
        config.setAllowedOrigins(origins);
        log.info("CORS allowed origins: {}", origins);

        // Allow credentials (cookies, Authorization header) — Req 20.2
        config.setAllowCredentials(true);

        // Restrict methods — Req 20.3
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Restrict headers — Req 20.4
        config.setAllowedHeaders(List.of(
                "Content-Type",
                "Authorization",
                "X-Idempotency-Key",
                "X-Correlation-ID"
        ));

        // Expose correlation ID header to clients
        config.setExposedHeaders(List.of("X-Correlation-ID"));

        // Preflight cache — Req 20.5
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
