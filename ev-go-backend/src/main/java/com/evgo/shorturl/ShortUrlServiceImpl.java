package com.evgo.shorturl;

import com.evgo.booking.Booking;
import com.evgo.booking.BookingRepository;
import com.evgo.exception.ResourceNotFoundException;
import com.evgo.shorturl.dto.ShortUrlDto;
import com.evgo.user.User;
import com.evgo.user.UserRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Implementation of {@link ShortUrlService}.
 * 
 * <p>Uses Redis cache for fast lookups:
 * <ul>
 *   <li>Cache key: short_url:{code}</li>
 *   <li>Cache value: original URL</li>
 *   <li>TTL: same as short URL expiry (or 1 day default)</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ShortUrlServiceImpl implements ShortUrlService {
    
    private final ShortUrlRepository shortUrlRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> stringRedisTemplate;
    
    @Value("${app.base-url:https://evgo.in}")
    private String baseUrl;
    
    private static final String SHORT_CODE_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int SHORT_CODE_LENGTH = 7;
    private static final String CACHE_KEY_PREFIX = "short_url:";
    private static final int QR_CODE_SIZE = 300;
    
    @Override
    @Transactional
    public ShortUrlDto createShortUrl(String originalUrl, Long bookingId, Long userId, Duration ttl) {
        
        // Generate unique short code
        String shortCode = generateUniqueShortCode();
        
        // Build entity
        ShortUrl shortUrl = ShortUrl.builder()
                .shortCode(shortCode)
                .originalUrl(originalUrl)
                .clickCount(0)
                .createdAt(Instant.now())
                .build();
        
        // Link booking if provided
        if (bookingId != null) {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));
            shortUrl.setBooking(booking);
        }
        
        // Link user if provided
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            shortUrl.setUser(user);
        }
        
        // Set expiry if TTL provided
        if (ttl != null) {
            shortUrl.setExpiresAt(Instant.now().plus(ttl));
        }
        
        // Save to database
        shortUrlRepository.save(shortUrl);
        
        // Cache in Redis for fast lookup
        String cacheKey = CACHE_KEY_PREFIX + shortCode;
        Duration cacheTtl = ttl != null ? ttl : Duration.ofDays(1);
        stringRedisTemplate.opsForValue().set(cacheKey, originalUrl, cacheTtl);
        
        log.info("Created short URL: code={}, originalUrl={}, bookingId={}, userId={}", 
                 shortCode, originalUrl, bookingId, userId);
        
        return toDto(shortUrl);
    }
    
    @Override
    @Transactional
    public String resolveShortCode(String shortCode) {
        
        // Check Redis cache first (fast path)
        String cacheKey = CACHE_KEY_PREFIX + shortCode;
        String cachedUrl = stringRedisTemplate.opsForValue().get(cacheKey);
        
        if (cachedUrl != null) {
            // Increment click count asynchronously (don't block redirect)
            CompletableFuture.runAsync(() -> incrementClickCount(shortCode));
            return cachedUrl;
        }
        
        // Cache miss - fetch from database
        ShortUrl shortUrl = shortUrlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found: " + shortCode));
        
        // Check expiry
        if (shortUrl.getExpiresAt() != null && Instant.now().isAfter(shortUrl.getExpiresAt())) {
            log.warn("Short URL expired: code={}, expiresAt={}", shortCode, shortUrl.getExpiresAt());
            throw new IllegalStateException("Short URL expired");
        }
        
        // Increment click count
        shortUrlRepository.incrementClickCount(shortUrl.getId());
        
        // Refresh cache
        Duration ttl = shortUrl.getExpiresAt() != null 
                ? Duration.between(Instant.now(), shortUrl.getExpiresAt())
                : Duration.ofDays(1);
        stringRedisTemplate.opsForValue().set(cacheKey, shortUrl.getOriginalUrl(), ttl);
        
        return shortUrl.getOriginalUrl();
    }
    
    @Override
    public List<ShortUrlDto> getUrlsByBooking(Long bookingId) {
        return shortUrlRepository.findByBookingId(bookingId).stream()
                .map(this::toDto)
                .toList();
    }
    
    @Override
    public List<ShortUrlDto> getUrlsByUser(Long userId) {
        return shortUrlRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .toList();
    }
    
    @Override
    public byte[] generateQrCode(String shortCode) {
        try {
            String url = baseUrl + "/b/" + shortCode;
            
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            return outputStream.toByteArray();
            
        } catch (Exception e) {
            log.error("Failed to generate QR code for shortCode={}: {}", shortCode, e.getMessage(), e);
            throw new RuntimeException("QR code generation failed", e);
        }
    }
    
    @Override
    @Transactional
    public int cleanupExpired() {
        int deleted = shortUrlRepository.deleteExpired(Instant.now());
        if (deleted > 0) {
            log.info("Cleaned up {} expired short URLs", deleted);
        }
        return deleted;
    }
    
    /**
     * Generate unique 7-character alphanumeric short code.
     * Retries until a unique code is found.
     */
    private String generateUniqueShortCode() {
        SecureRandom random = new SecureRandom();
        String shortCode;
        int attempts = 0;
        int maxAttempts = 10;
        
        do {
            StringBuilder sb = new StringBuilder(SHORT_CODE_LENGTH);
            for (int i = 0; i < SHORT_CODE_LENGTH; i++) {
                sb.append(SHORT_CODE_CHARS.charAt(random.nextInt(SHORT_CODE_CHARS.length())));
            }
            shortCode = sb.toString();
            
            attempts++;
            if (attempts >= maxAttempts) {
                log.error("Failed to generate unique short code after {} attempts", maxAttempts);
                throw new RuntimeException("Failed to generate unique short code");
            }
            
        } while (shortUrlRepository.findByShortCode(shortCode).isPresent());
        
        return shortCode;
    }
    
    /**
     * Increment click count asynchronously (background operation).
     */
    private void incrementClickCount(String shortCode) {
        try {
            shortUrlRepository.findByShortCode(shortCode).ifPresent(shortUrl -> 
                shortUrlRepository.incrementClickCount(shortUrl.getId())
            );
        } catch (Exception e) {
            log.warn("Failed to increment click count for shortCode={}: {}", shortCode, e.getMessage());
            // Don't throw - this is best-effort analytics
        }
    }
    
    /**
     * Convert entity to DTO.
     */
    private ShortUrlDto toDto(ShortUrl shortUrl) {
        String shortUrlFull = baseUrl + "/b/" + shortUrl.getShortCode();
        
        return new ShortUrlDto(
                shortUrl.getId(),
                shortUrl.getShortCode(),
                shortUrlFull,
                shortUrl.getOriginalUrl(),
                shortUrl.getClickCount(),
                shortUrl.getExpiresAt(),
                shortUrl.getCreatedAt()
        );
    }
}
