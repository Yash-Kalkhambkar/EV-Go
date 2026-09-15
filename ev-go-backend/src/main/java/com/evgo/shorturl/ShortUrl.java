package com.evgo.shorturl;

import com.evgo.booking.Booking;
import com.evgo.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Short URL entity for booking link sharing.
 * 
 * <p>Pattern: evgo.in/b/{shortCode}
 * <p>Example: evgo.in/b/abc123x → redirects to booking detail page
 * 
 * <p>Features:
 * <ul>
 *   <li>7-character alphanumeric code (62^7 = 3.5 trillion combinations)</li>
 *   <li>Click tracking (incremented on each redirect)</li>
 *   <li>Optional expiry (TTL)</li>
 *   <li>Optional booking linkage (for analytics)</li>
 * </ul>
 */
@Entity
@Table(name = "short_urls")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShortUrl {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Unique 7-character code (alphanumeric).
     * Example: "abc123x"
     */
    @Column(nullable = false, unique = true, length = 10)
    private String shortCode;
    
    /**
     * Full URL to redirect to.
     * Example: "https://evgo.in/bookings/123"
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String originalUrl;
    
    /**
     * Optional: Link to booking for analytics.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    /**
     * Optional: User who created this short URL.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    /**
     * Number of times this short URL was accessed.
     * Incremented atomically on each redirect.
     */
    @Builder.Default
    @Column(nullable = false)
    private Integer clickCount = 0;
    
    /**
     * Optional: When this short URL expires (NULL = never expires).
     */
    private Instant expiresAt;
    
    /**
     * When this short URL was created.
     */
    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (clickCount == null) {
            clickCount = 0;
        }
    }
}
