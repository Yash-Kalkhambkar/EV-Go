# EV GO — Backend Architecture

## Stack

- Java 21
- Spring Boot 3.x
- Spring Security (JWT-based auth)
- Spring Data JPA (PostgreSQL)
- Spring Data Redis
- Spring WebSocket (STOMP over SockJS)
- Maven (build tool)
- Docker (containerization for Cloud Run)

---

## Project Structure

```
ev-go-backend/
├── src/
│   └── main/
│       ├── java/com/evgo/
│       │   ├── EvGoApplication.java
│       │   │
│       │   ├── config/
│       │   │   ├── SecurityConfig.java          # JWT filter chain, CORS
│       │   │   ├── WebSocketConfig.java          # STOMP broker + endpoints
│       │   │   ├── RedisConfig.java
│       │   │   └── CorsConfig.java
│       │   │
│       │   ├── auth/
│       │   │   ├── AuthController.java           # /api/auth/*
│       │   │   ├── AuthService.java
│       │   │   ├── JwtTokenProvider.java
│       │   │   ├── JwtAuthFilter.java
│       │   │   └── dto/
│       │   │       ├── LoginRequest.java
│       │   │       ├── RegisterRequest.java
│       │   │       └── AuthResponse.java
│       │   │
│       │   ├── user/
│       │   │   ├── UserController.java           # /api/users/*
│       │   │   ├── UserService.java
│       │   │   ├── UserRepository.java
│       │   │   ├── User.java                     # JPA entity
│       │   │   └── dto/
│       │   │       └── UserProfileDto.java
│       │   │
│       │   ├── station/
│       │   │   ├── StationController.java        # /api/stations/*
│       │   │   ├── StationService.java
│       │   │   ├── StationRepository.java
│       │   │   ├── Station.java                  # JPA entity
│       │   │   └── dto/
│       │   │       ├── StationDto.java
│       │   │       ├── StationSearchRequest.java
│       │   │       └── NearbyStationsResponse.java
│       │   │
│       │   ├── slot/
│       │   │   ├── SlotController.java           # /api/slots/*
│       │   │   ├── SlotService.java
│       │   │   ├── SlotRepository.java
│       │   │   ├── Slot.java                     # JPA entity
│       │   │   └── dto/
│       │   │       └── SlotDto.java
│       │   │
│       │   ├── booking/
│       │   │   ├── BookingController.java        # /api/bookings/*
│       │   │   ├── BookingService.java           # Core booking logic + Redis lock
│       │   │   ├── BookingRepository.java
│       │   │   ├── Booking.java                  # JPA entity
│       │   │   └── dto/
│       │   │       ├── CreateBookingRequest.java
│       │   │       └── BookingDto.java
│       │   │
│       │   ├── payment/
│       │   │   ├── PaymentController.java        # /api/payments/*
│       │   │   ├── PaymentService.java           # Razorpay integration
│       │   │   ├── PaymentRepository.java
│       │   │   ├── Payment.java
│       │   │   └── dto/
│       │   │       ├── CreateOrderRequest.java
│       │   │       └── VerifyPaymentRequest.java
│       │   │
│       │   ├── ai/
│       │   │   ├── AIController.java             # /api/ai/*
│       │   │   ├── AIService.java                # Claude API wrapper
│       │   │   ├── ConversationStore.java        # Redis-backed per-user history
│       │   │   └── dto/
│       │   │       ├── ChatRequest.java
│       │   │       └── ChatResponse.java
│       │   │
│       │   ├── websocket/
│       │   │   └── SlotBroadcaster.java          # Sends slot updates to STOMP topics
│       │   │
│       │   └── exception/
│       │       ├── GlobalExceptionHandler.java
│       │       ├── SlotUnavailableException.java
│       │       ├── ResourceNotFoundException.java
│       │       └── PaymentFailedException.java
│       │
│       └── resources/
│           ├── application.yml
│           ├── application-dev.yml
│           └── application-prod.yml
│
├── Dockerfile
├── docker-compose.yml          # Local dev: Postgres + Redis
└── pom.xml
```

---

## Security

### JWT Flow

```
POST /api/auth/login
  → AuthService validates credentials
  → JwtTokenProvider generates signed JWT (24h expiry)
  → Token returned to client

Every subsequent request:
  → JwtAuthFilter extracts token from Authorization header
  → Validates signature + expiry
  → Loads UserDetails, sets SecurityContext
  → Request proceeds to controller
```

### Security Config

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/stations/search").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

### Roles

| Role | Access |
|---|---|
| `ROLE_USER` | Search, book, manage own bookings |
| `ROLE_ADMIN` | All user access + manage stations, view all bookings |

---

## WebSocket Configuration

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")  // Dev only - see note below
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
```

**Production CORS Note:** The `setAllowedOriginPatterns("*")` configuration is acceptable for local development but should be restricted in production to the actual frontend origin (e.g., `https://evgo.app`). Update this before deploying to production.

Slot updates are broadcast to `/topic/stations/{stationId}/slots` whenever a booking is created or cancelled. The `SlotBroadcaster` is called from `BookingService` after every confirmed state change.

---

## Redis Usage

Two purposes:

### 1. Slot locking (booking race condition protection)

```java
// BookingService.java
public BookingDto createBooking(CreateBookingRequest req, Long userId) {
    String lockKey = "slot:lock:" + req.getSlotId();

    Boolean acquired = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, userId.toString(), Duration.ofSeconds(10));

    if (!acquired) {
        throw new SlotUnavailableException("Slot is being booked by another user");
    }

    try {
        // Verify slot is still AVAILABLE in Postgres
        Slot slot = slotRepository.findById(req.getSlotId())
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new SlotUnavailableException("Slot is no longer available");
        }

        // Create booking, mark slot RESERVED
        // Payment happens separately after this
        Booking booking = new Booking(...);
        bookingRepository.save(booking);
        slot.setStatus(SlotStatus.RESERVED);
        slotRepository.save(slot);

        // Broadcast update to WebSocket subscribers
        slotBroadcaster.broadcast(slot.getStation().getId());

        return BookingMapper.toDto(booking);
    } finally {
        redisTemplate.delete(lockKey);
    }
}
```

**Note on lock release safety:** The `finally` block that deletes the Redis lock is not ownership-safe. If a request exceeds the 10-second TTL, Redis auto-expires the lock, a second request acquires it, and then the first request's `finally` block could delete the second request's lock. This is acceptable here because Postgres's `FOR UPDATE` and the unique partial index are the actual correctness guarantees — a stale Redis lock delete only risks a spurious 409 for an innocent second user, never a double booking.

### 2. AI conversation history (per user, per session)

```java
// ConversationStore.java
public void saveHistory(Long userId, List<ChatMessage> history) {
    String key = "ai:history:" + userId;
    redisTemplate.opsForValue().set(key, serialize(history), Duration.ofHours(2));
}

public List<ChatMessage> getHistory(Long userId) {
    String key = "ai:history:" + userId;
    String raw = (String) redisTemplate.opsForValue().get(key);
    return raw != null ? deserialize(raw) : new ArrayList<>();
}
```

Conversation history expires after 2 hours of inactivity. This keeps Redis memory bounded and Claude context relevant.

---

## Application Config

```yaml
# application.yml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate          # Migrations via Flyway
    show-sql: false
  data:
    redis:
      host: ${REDIS_HOST}
      port: 6379

app:
  jwt:
    secret: ${JWT_SECRET}
    expiry-ms: 86400000           # 24 hours
  claude:
    api-key: ${CLAUDE_API_KEY}
    model: claude-sonnet-4-20250514
    max-tokens: 1000
  razorpay:
    key-id: ${RAZORPAY_KEY_ID}
    key-secret: ${RAZORPAY_KEY_SECRET}
  google-maps:
    api-key: ${GOOGLE_MAPS_API_KEY}
```

---

## Error Handling

All exceptions flow through `GlobalExceptionHandler`:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SlotUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleSlotUnavailable(SlotUnavailableException ex) {
        return ResponseEntity.status(409).body(new ErrorResponse("SLOT_UNAVAILABLE", ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(new ErrorResponse("FORBIDDEN", "Access denied"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse("INTERNAL_ERROR", "Something went wrong"));
    }
}
```

Consistent error shape across all endpoints:
```json
{
  "code": "SLOT_UNAVAILABLE",
  "message": "Slot is being booked by another user"
}
```

---

## Docker Setup

```dockerfile
# Dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/ev-go-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```yaml
# docker-compose.yml (local dev)
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: evgo
      POSTGRES_USER: evgo
      POSTGRES_PASSWORD: evgo
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

Local dev runs: `docker-compose up -d && mvn spring-boot:run`
