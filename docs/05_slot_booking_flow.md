# EV GO — Slot Booking Flow

## Why This Needs Special Attention

Slot booking is the most technically sensitive part of the app. Two users can open the same station detail page at the same time, see the same slot as available, and both try to book it simultaneously. Without proper locking, both succeed — and you have a double booking.

This document covers the exact flow from click to confirmed booking.

---

## Full Booking Flow

```
User clicks "Book Slot"
        │
        ▼
POST /api/bookings  ──────────────────────────────────────┐
        │                                                  │
        ▼                                                  │
BookingService.createBooking()                             │
        │                                                  │
        ▼                                                  │
Redis: SET slot:lock:{slotId} {userId} NX EX 10            │
        │                                                  │
   ┌────┴────┐                                             │
   │         │                                             │
Lock        Lock                                           │
acquired    NOT acquired                                   │
   │         │                                             │
   │         ▼                                             │
   │    throw SlotUnavailableException                     │
   │    → 409 "Slot is being booked by another user"       │
   │                                                       │
   ▼                                                       │
Postgres: SELECT slot WHERE id = ? FOR UPDATE              │
        │                                                  │
   ┌────┴────┐                                             │
   │         │                                             │
AVAILABLE   NOT AVAILABLE                                  │
   │         │                                             │
   │         ▼                                             │
   │    Redis: DEL slot:lock:{slotId}                      │
   │    throw SlotUnavailableException                     │
   │    → 409 "Slot is no longer available"                │
   │                                                       │
   ▼                                                       │
Postgres: INSERT booking (status=PENDING)                  │
Postgres: UPDATE slot SET status=RESERVED                  │
Postgres: COMMIT                                           │
        │                                                  │
        ▼                                                  │
Redis: DEL slot:lock:{slotId}  (lock released)             │
        │                                                  │
        ▼                                                  │
WebSocket: broadcast slot update to /topic/stations/{id}   │
        │                                                  │
        ▼                                                  │
Return 201: { bookingId, totalAmount } ────────────────────┘
        │
        ▼
POST /payments/create-order with bookingId
        │
        ▼
Create Razorpay order (OUTSIDE transaction)
        │
        ▼
Attach razorpay_order_id to booking
        │
        ▼
Return: { razorpayOrderId, amount, currency, keyId }
        │
        ▼
Frontend opens Razorpay modal
        │
   ┌────┴────────────────┐
   │                     │
Payment              Payment
SUCCESS              FAILED / CANCELLED
   │                     │
   ▼                     ▼
POST /payments/verify   Booking stays PENDING
        │               Slot stays RESERVED
        ▼               (scheduler cleans up after 10min)
Verify Razorpay
HMAC signature
        │
   ┌────┴────┐
   │         │
Valid      Invalid
   │         │
   ▼         ▼
Postgres:  → 400 PAYMENT_VERIFICATION_FAILED
UPDATE booking SET status=CONFIRMED
UPDATE slot SET status=BOOKED
        │
        ▼
WebSocket: broadcast final slot update
        │
        ▼
Return 200: { bookingId, status: "CONFIRMED" }
```

---

## Why Two Locks: Redis + Postgres `FOR UPDATE`

The Redis lock (`SET NX EX`) prevents concurrent requests from even reaching the database at the same time. The `SELECT ... FOR UPDATE` in Postgres is a second line of defense — it's a pessimistic row lock at the database level. Together:

- Redis stops 99% of race conditions at the application layer, fast
- Postgres `FOR UPDATE` handles the remaining edge cases if Redis ever has a split-brain or the lock expires unexpectedly

Using only Redis is usually fine, but for something like a booking system where double-bookings are genuinely bad, the belt-and-suspenders approach costs almost nothing and adds real safety.

**Note on Redis lock release safety:** The `finally { redisTemplate.delete(lockKey) }` pattern is not ownership-safe — if a request exceeds the 10-second TTL, Redis auto-expires the lock, a second request acquires it, and then the first request's `finally` block deletes the second request's lock. This is acceptable here because Postgres's `FOR UPDATE` and the unique partial index (`uq_active_booking`) are the actual correctness guarantees — a stale Redis lock delete only risks a spurious 409 for an innocent second user, never a double booking.

---

## The Stale Reservation Problem

When a user books a slot (status → `RESERVED`) but then closes the browser without paying, the slot is stuck as `RESERVED` and no one else can book it.

**Solution: Scheduled cleanup job**

```java
// BookingCleanupScheduler.java
@Component
public class BookingCleanupScheduler {

    @Scheduled(fixedDelay = 60_000)  // runs every 60 seconds
    @Transactional
    public void releaseStaleReservations() {
        Instant cutoff = Instant.now().minus(10, MINUTES);

        List<Booking> stale = bookingRepository
            .findByStatusAndBookedAtBefore(BookingStatus.PENDING, cutoff);

        for (Booking booking : stale) {
            booking.setStatus(BookingStatus.CANCELLED);
            Slot slot = booking.getSlot();
            slot.setStatus(SlotStatus.AVAILABLE);
            slotRepository.save(slot);
            bookingRepository.save(booking);

            // Broadcast so any watching users see the slot reopen
            slotBroadcaster.broadcast(slot.getStation().getId());
        }
    }
}
```

A reservation is stale if it's been `PENDING` for more than 10 minutes. The scheduler runs every 60 seconds. The slot is returned to `AVAILABLE` and a WebSocket broadcast is sent — so if another user is watching that station, the slot will reappear in their UI automatically.

---

## BookingService — Core Code

```java
@Service
@Transactional
public class BookingService {

    private final SlotRepository slotRepository;
    private final BookingRepository bookingRepository;
    private final PaymentService paymentService;
    private final SlotBroadcaster slotBroadcaster;
    private final StringRedisTemplate redisTemplate;

    public BookingDto createBooking(CreateBookingRequest req, Long userId) {
        String lockKey = "slot:lock:" + req.getSlotId();

        // Step 1: Try to acquire Redis lock (atomic SET NX EX)
        Boolean acquired = redisTemplate.opsForValue()
            .setIfAbsent(lockKey, userId.toString(), Duration.ofSeconds(10));

        if (Boolean.FALSE.equals(acquired)) {
            throw new SlotUnavailableException("Slot is being booked by another user. Try again.");
        }

        try {
            // Step 2: Pessimistic lock on the slot row in Postgres
            Slot slot = slotRepository.findByIdWithLock(req.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

            if (slot.getStatus() != SlotStatus.AVAILABLE) {
                throw new SlotUnavailableException("Slot is no longer available");
            }

            // Step 3: Calculate price based on slot duration
            BigDecimal pricePerHour = slot.getStation().getPricePerHour();
            Duration slotDuration = Duration.between(slot.getStartTime(), slot.getEndTime());
            BigDecimal totalAmount = pricePerHour
                .multiply(BigDecimal.valueOf(slotDuration.toMinutes()))
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

            // Step 4: Create booking + reserve slot
            User user = new User(); user.setId(userId);
            Booking booking = Booking.builder()
                .user(user)
                .slot(slot)
                .station(slot.getStation())
                .status(BookingStatus.PENDING)
                .totalAmount(totalAmount)
                .build();

            bookingRepository.save(booking);
            slot.setStatus(SlotStatus.RESERVED);
            slotRepository.save(slot);

            // Step 5: Broadcast to WebSocket subscribers
            slotBroadcaster.broadcast(slot.getStation().getId());

            return BookingMapper.toDto(booking);

        } finally {
            // Always release the Redis lock, even on exception
            redisTemplate.delete(lockKey);
        }
    }
}
```

```java
// SlotRepository.java — pessimistic lock query
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT s FROM Slot s WHERE s.id = :id")
Optional<Slot> findByIdWithLock(@Param("id") Long id);
```

---

## Payment Verification — Razorpay HMAC

Razorpay requires signature verification after payment. The signature is computed as:

```
HMAC-SHA256(razorpayOrderId + "|" + razorpayPaymentId, keySecret)
```

```java
// PaymentService.java
public void verifyPayment(VerifyPaymentRequest req, Long bookingId, Long userId) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    // Check ownership
    if (!booking.getUser().getId().equals(userId)) {
        throw new AccessDeniedException("Not your booking");
    }

    // Check booking status (idempotency - already processed?)
    if (booking.getStatus() != BookingStatus.PENDING) {
        // Already confirmed or cancelled - return success for idempotency
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return; // Already processed successfully
        }
        throw new IllegalStateException("Booking already processed");
    }

    // Check order ID matches
    if (!booking.getRazorpayOrderId().equals(req.getRazorpayOrderId())) {
        throw new PaymentFailedException("Order ID mismatch");
    }

    // Verify HMAC signature
    String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
    String expectedSignature = HMAC.sha256(payload, razorpayKeySecret);

    if (!expectedSignature.equals(req.getRazorpaySignature())) {
        throw new PaymentFailedException("Payment signature verification failed");
    }

    // All checks passed - confirm booking atomically
    booking.setStatus(BookingStatus.CONFIRMED);
    booking.getSlot().setStatus(SlotStatus.BOOKED);
    bookingRepository.save(booking);
    slotRepository.save(booking.getSlot());

    // Save payment record
    Payment payment = Payment.builder()
        .booking(booking)
        .razorpayOrderId(req.getRazorpayOrderId())
        .razorpayPaymentId(req.getRazorpayPaymentId())
        .razorpaySignature(req.getRazorpaySignature())
        .amount(booking.getTotalAmount())
        .status(PaymentStatus.SUCCESS)
        .build();
    paymentRepository.save(payment);

    slotBroadcaster.broadcast(booking.getStation().getId());
}
```

---

## Cancellation Policy

A confirmed booking can be cancelled if the slot hasn't started yet and it's more than 1 hour before the start time. Refund logic (via Razorpay refunds API) is a v2 feature — in v1 cancellations are recorded but refunds are handled manually or out of band.

```java
public void cancelBooking(Long bookingId, Long userId) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    if (!booking.getUser().getId().equals(userId)) {
        throw new AccessDeniedException("This isn't your booking");
    }

    if (booking.getStatus() != BookingStatus.CONFIRMED) {
        throw new IllegalStateException("Only confirmed bookings can be cancelled");
    }

    LocalDateTime slotStart = LocalDateTime.of(
        booking.getSlot().getSlotDate(),
        booking.getSlot().getStartTime()
    );

    if (LocalDateTime.now().isAfter(slotStart.minusHours(1))) {
        throw new CancellationNotAllowedException(
            "Cannot cancel less than 1 hour before the slot"
        );
    }

    booking.setStatus(BookingStatus.CANCELLED);
    booking.getSlot().setStatus(SlotStatus.AVAILABLE);
    bookingRepository.save(booking);
    slotRepository.save(booking.getSlot());
    slotBroadcaster.broadcast(booking.getStation().getId());
}
```
