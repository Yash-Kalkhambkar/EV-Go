package com.evgo.shorturl;

import com.evgo.shorturl.dto.CreateShortUrlRequest;
import com.evgo.shorturl.dto.ShortUrlDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

/**
 * REST controller for short URL management (authenticated endpoints).
 * 
 * <p>Endpoints:
 * <ul>
 *   <li>POST /api/short-urls - Create short URL</li>
 *   <li>GET /api/short-urls/booking/{id} - Get URLs for booking</li>
 *   <li>GET /api/short-urls/qr/{code} - Get QR code image</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/short-urls")
@RequiredArgsConstructor
@Slf4j
public class ShortUrlController {
    
    private final ShortUrlService shortUrlService;
    
    /**
     * Create a short URL for sharing.
     * 
     * <p>Example request:
     * <pre>{@code
     * POST /api/short-urls
     * {
     *   "originalUrl": "https://evgo.in/bookings/123",
     *   "bookingId": 123,
     *   "ttlDays": 30
     * }
     * }</pre>
     * 
     * <p>Example response:
     * <pre>{@code
     * {
     *   "id": 1,
     *   "shortCode": "abc123x",
     *   "shortUrl": "https://evgo.in/b/abc123x",
     *   "originalUrl": "https://evgo.in/bookings/123",
     *   "clickCount": 0,
     *   "expiresAt": "2026-10-15T...",
     *   "createdAt": "2026-09-15T..."
     * }
     * }</pre>
     * 
     * @param request Create request
     * @param user Current user (from JWT)
     * @return Created short URL DTO
     */
    @PostMapping
    public ResponseEntity<ShortUrlDto> createShortUrl(
            @Valid @RequestBody CreateShortUrlRequest request,
            @AuthenticationPrincipal UserDetails user) {
        
        Long userId = Long.parseLong(user.getUsername());
        
        Duration ttl = request.ttlDays() != null 
                ? Duration.ofDays(request.ttlDays())
                : null;
        
        ShortUrlDto shortUrl = shortUrlService.createShortUrl(
                request.originalUrl(),
                request.bookingId(),
                userId,
                ttl
        );
        
        log.info("Short URL created: code={}, userId={}", shortUrl.shortCode(), userId);
        
        return ResponseEntity.ok(shortUrl);
    }
    
    /**
     * Get all short URLs for a booking.
     * 
     * <p>Example: GET /api/short-urls/booking/123
     * 
     * @param bookingId Booking ID
     * @param user Current user (ownership verified in service layer)
     * @return List of short URLs
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<ShortUrlDto>> getByBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails user) {
        
        List<ShortUrlDto> shortUrls = shortUrlService.getUrlsByBooking(bookingId);
        return ResponseEntity.ok(shortUrls);
    }
    
    /**
     * Get QR code image for a short URL.
     * 
     * <p>Returns PNG image (300x300 pixels).
     * <p>Example: GET /api/short-urls/qr/abc123x
     * 
     * @param shortCode 7-character short code
     * @return PNG image bytes
     */
    @GetMapping("/qr/{shortCode}")
    public ResponseEntity<byte[]> getQrCode(@PathVariable String shortCode) {
        
        byte[] qrCode = shortUrlService.generateQrCode(shortCode);
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }
}
