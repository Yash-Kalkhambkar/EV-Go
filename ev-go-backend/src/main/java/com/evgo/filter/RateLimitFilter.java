package com.evgo.filter;

import com.evgo.cache.RateLimiter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Rate limiting filter that checks request count before processing.
 * 
 * <p>Applied to all requests (Order 1 = runs early in filter chain).
 * Returns HTTP 429 (Too Many Requests) if limit exceeded.
 * 
 * <p>Exemptions:
 * <ul>
 *   <li>Actuator health checks (/actuator/health)</li>
 *   <li>Static resources</li>
 * </ul>
 * 
 * <p>Client IP extraction prioritizes X-Forwarded-For header (for Cloud Run)
 * and falls back to RemoteAddr.
 */
@Component
@RequiredArgsConstructor
@Order(1)
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {
    
    private final RateLimiter rateLimiter;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain chain) throws ServletException, IOException {
        
        String requestUri = request.getRequestURI();
        
        // Skip rate limiting for health checks and static resources
        if (shouldSkipRateLimiting(requestUri)) {
            chain.doFilter(request, response);
            return;
        }
        
        String clientIp = extractClientIp(request);
        
        // Check rate limit
        if (!rateLimiter.isAllowed(clientIp, requestUri)) {
            handleRateLimitExceeded(request, response, clientIp);
            return;
        }
        
        // Continue filter chain
        chain.doFilter(request, response);
    }
    
    /**
     * Determine if rate limiting should be skipped for this request.
     */
    private boolean shouldSkipRateLimiting(String requestUri) {
        return requestUri.startsWith("/actuator/health") ||
               requestUri.startsWith("/favicon.ico") ||
               requestUri.startsWith("/static/") ||
               requestUri.startsWith("/webjars/");
    }
    
    /**
     * Extract client IP address from request.
     * Prioritizes X-Forwarded-For header (set by Cloud Run load balancer).
     * Falls back to RemoteAddr if header not present.
     */
    private String extractClientIp(HttpServletRequest request) {
        // Check X-Forwarded-For header (format: client, proxy1, proxy2)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take first IP in chain (original client)
            return xForwardedFor.split(",")[0].trim();
        }
        
        // Check X-Real-IP header (alternative)
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp.trim();
        }
        
        // Fallback to remote address
        return request.getRemoteAddr();
    }
    
    /**
     * Send 429 Too Many Requests response with JSON error.
     */
    private void handleRateLimitExceeded(HttpServletRequest request, 
                                        HttpServletResponse response, 
                                        String clientIp) throws IOException {
        
        log.warn("Rate limit exceeded: ip={}, uri={}, method={}", 
                clientIp, request.getRequestURI(), request.getMethod());
        
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        // Send JSON error response
        String jsonError = """
            {
                "error": "Rate limit exceeded",
                "message": "Too many requests. Please try again later.",
                "statusCode": 429
            }
            """;
        
        response.getWriter().write(jsonError);
        response.getWriter().flush();
    }
}
