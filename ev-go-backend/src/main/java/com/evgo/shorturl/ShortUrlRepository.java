package com.evgo.shorturl;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link ShortUrl} entity.
 */
@Repository
public interface ShortUrlRepository extends JpaRepository<ShortUrl, Long> {
    
    /**
     * Find short URL by code.
     * Used for redirect lookup (GET /b/{code}).
     */
    Optional<ShortUrl> findByShortCode(String shortCode);
    
    /**
     * Find all short URLs for a booking.
     * Used for analytics (admin can see how many shares for a booking).
     */
    List<ShortUrl> findByBookingId(Long bookingId);
    
    /**
     * Find all short URLs created by a user.
     */
    List<ShortUrl> findByUserId(Long userId);
    
    /**
     * Increment click count atomically.
     * Used after successful redirect to avoid race conditions.
     * 
     * @param id Short URL ID
     */
    @Modifying
    @Query("UPDATE ShortUrl s SET s.clickCount = s.clickCount + 1 WHERE s.id = :id")
    void incrementClickCount(@Param("id") Long id);
    
    /**
     * Find expired short URLs (for cleanup job).
     * 
     * @param now Current timestamp
     * @return List of expired short URLs
     */
    @Query("SELECT s FROM ShortUrl s WHERE s.expiresAt IS NOT NULL AND s.expiresAt < :now")
    List<ShortUrl> findExpired(@Param("now") Instant now);
    
    /**
     * Delete expired short URLs.
     * Used by scheduled cleanup job.
     * 
     * @param now Current timestamp
     * @return Number of deleted records
     */
    @Modifying
    @Query("DELETE FROM ShortUrl s WHERE s.expiresAt IS NOT NULL AND s.expiresAt < :now")
    int deleteExpired(@Param("now") Instant now);
}
