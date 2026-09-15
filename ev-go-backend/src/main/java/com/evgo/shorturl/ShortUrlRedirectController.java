package com.evgo.shorturl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

/**
 * Public redirect controller for short URLs.
 * 
 * <p>Pattern: GET /b/{shortCode}
 * <p>Example: GET /b/abc123x → 302 redirect to original URL
 * 
 * <p>No authentication required (public endpoint).
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class ShortUrlRedirectController {
    
    private final ShortUrlService shortUrlService;
    
    /**
     * Redirect short URL to original URL.
     * 
     * <p>Returns HTTP 302 (Found) with Location header.
     * <p>Increments click count asynchronously.
     * 
     * <p>Example:
     * <pre>
     * GET /b/abc123x
     * 
     * Response:
     * HTTP/1.1 302 Found
     * Location: https://evgo.in/bookings/123
     * </pre>
     * 
     * @param shortCode 7-character short code
     * @return Redirect response (302)
     */
    @GetMapping("/b/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        
        log.debug("Short URL redirect requested: code={}", shortCode);
        
        try {
            String originalUrl = shortUrlService.resolveShortCode(shortCode);
            
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(originalUrl))
                    .build();
            
        } catch (Exception e) {
            log.warn("Short URL redirect failed: code={}, error={}", shortCode, e.getMessage());
            
            // Return 404 if not found or expired
            return ResponseEntity.notFound().build();
        }
    }
}
