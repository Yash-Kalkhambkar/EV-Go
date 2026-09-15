package com.evgo.shorturl;

import com.evgo.shorturl.dto.ShortUrlDto;

import java.time.Duration;
import java.util.List;

/**
 * Service for managing short URLs.
 */
public interface ShortUrlService {
    
    /**
     * Create a short URL.
     * 
     * @param originalUrl Full URL to redirect to
     * @param bookingId Optional: link to booking
     * @param userId Optional: user who created this
     * @param ttl Optional: time-to-live (null = never expires)
     * @return Created short URL DTO
     */
    ShortUrlDto createShortUrl(String originalUrl, Long bookingId, Long userId, Duration ttl);
    
    /**
     * Resolve short code to original URL.
     * Increments click count and checks expiry.
     * 
     * @param shortCode 7-character code
     * @return Original URL to redirect to
     * @throws com.evgo.exception.ResourceNotFoundException if code not found
     * @throws IllegalStateException if expired
     */
    String resolveShortCode(String shortCode);
    
    /**
     * Get all short URLs for a booking.
     * 
     * @param bookingId Booking ID
     * @return List of short URLs
     */
    List<ShortUrlDto> getUrlsByBooking(Long bookingId);
    
    /**
     * Get all short URLs created by a user.
     * 
     * @param userId User ID
     * @return List of short URLs
     */
    List<ShortUrlDto> getUrlsByUser(Long userId);
    
    /**
     * Generate QR code image for short URL.
     * 
     * @param shortCode 7-character code
     * @return PNG image bytes (300x300 pixels)
     * @throws RuntimeException if QR generation fails
     */
    byte[] generateQrCode(String shortCode);
    
    /**
     * Delete expired short URLs (scheduled cleanup).
     * 
     * @return Number of deleted URLs
     */
    int cleanupExpired();
}
