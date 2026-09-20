# EV GO — Fixes & Improvements

Consolidated issue list for `00_overview.md` through `07_deployment.md`. Ordered by priority. Each item says what's wrong, why it matters, and the concrete fix.

---

## P0 — Fix before implementing (real bugs / contradictions)

### 1. Razorpay call happens inside the DB transaction + row lock
**Where:** `05_slot_booking_flow.md`, `BookingService.createBooking()`

The current flow acquires the Postgres `FOR UPDATE` row lock, *then* calls `paymentService.createOrder(...)` (an HTTP call to Razorpay), *then* writes the booking — all inside one `@Transactional` method. If Razorpay is slow, you're holding a DB row lock open waiting on a third-party network call. Any other request for that slot queues behind it.

**Fix:** Split into two steps.
```
Step 1 (short transaction):
  SELECT slot FOR UPDATE
  → verify AVAILABLE
  → INSERT booking (PENDING)
  → UPDATE slot SET status = RESERVED
  → COMMIT

Step 2 (outside any lock):
  POST /payments/create-order
  → create Razorpay order
  → attach razorpay_order_id to booking
```
The row lock is now held only for the duration of local DB writes — milliseconds, not "however long Razorpay takes."

---

### 2. Payment flow is specified three different ways
**Where:** `04_api.md` vs `05_slot_booking_flow.md`

- `04_api.md`: `POST /bookings` returns `razorpayOrderId` directly (order created as part of booking).
- `04_api.md`: *also* defines a separate `POST /payments/create-order`.
- `05_slot_booking_flow.md`: `BookingService` creates the Razorpay order inline during booking creation.

Three docs, three slightly different contracts. Pick one and delete the others.

**Fix — recommended flow (also resolves #1):**
```
POST /bookings              → PENDING booking, slot RESERVED, no Razorpay order yet
POST /payments/create-order → creates Razorpay order for that booking, returns razorpayOrderId + keyId
POST /payments/verify       → verifies signature, CONFIRMED
```
Update `04_api.md`'s `POST /bookings` response to remove `razorpayOrderId` (booking response no longer includes it). Update `05_slot_booking_flow.md`'s diagram and code sample to match.

---

### 3. `rating` field has no backing data
**Where:** `04_api.md` (`GET /stations/search` response), `03_database.md`

The station search response includes `"rating": 4.3`, but there's no `rating` column on `stations` and no `reviews` table anywhere in the schema. Review summarization is explicitly v2. This field will either be hardcoded, null, or fabricated by whoever implements it.

**Fix:** Remove `rating` from all v1 API response examples (`04_api.md`, and the frontend `StationCard` mockup in `01_frontend.md` that shows `⭐ 4.3`). Add it back when a `reviews` table exists in v2.

---

### 4. AI tool schema can't do what the example prompts claim
**Where:** `06_ai_integration.md`

The doc advertises "Find a CCS2 station near Hadapsar open after 6pm today" as a supported query, but `search_stations`'s input schema only has `latitude`, `longitude`, `radiusKm`, `connectorType`, `availableOnly`, `date` — no time-of-day parameter. Claude has no way to filter "after 6pm."

**Fix:** Add a time param to the tool schema and thread it through to `StationService`:
```json
"afterTime": { "type": "string", "description": "Only include slots starting after this time, HH:mm" }
```
`StationService.search()` needs a matching `afterTime` filter that excludes slots before that time. Also update `04_api.md`'s `GET /stations/search` query params to include it, since the same filter should be usable from the regular search UI, not just AI.

---

### 5. Conversation history has two owners
**Where:** `01_frontend.md` (`chatStore` sends full history) vs `06_ai_integration.md` (`ConversationStore` in Redis) vs `04_api.md` (`POST /ai/chat` request body includes `history`)

Right now both frontend and backend independently track conversation state and the frontend sends its copy on every request. These can diverge — e.g. if `cancel_booking` runs and the backend appends a tool-result message the frontend never sees, the two histories are now different, and the frontend's next request will overwrite the backend's (more correct) version.

**Fix:** Backend owns conversation state exclusively.
- `POST /ai/chat` request body: drop `history`, keep only `message`.
- Backend: `ConversationStore.getHistory(userId)` → append user message → call Claude → append reply/tool turns → save.
- Frontend `chatStore` becomes purely a *display* cache (what's rendered in the chat panel), not something sent back to the server.

Update the request schema in `04_api.md` and the `sendMessage` example in `01_frontend.md`.

---

## P1 — Real design gaps, worth an hour each

### 6. Redis lock release is unsafe under expiry
**Where:** `05_slot_booking_flow.md`, `02_backend.md`

```java
} finally {
    redisTemplate.delete(lockKey);
}
```
If a request takes longer than the 10s TTL, Redis auto-expires the lock, a second request acquires it, and then the *first* request's `finally` block deletes the *second* request's lock. This is a textbook distributed-lock bug.

**Fix — two options, pick based on how much you want to demonstrate:**
- **Simple (recommended for this project):** Since Postgres's `FOR UPDATE` + the unique partial index (`uq_active_booking`) already prevents a double booking even if the Redis lock misbehaves, this bug is *not correctness-critical* here — worst case is a spurious 409 for an innocent second user. You can leave it and add a one-line comment explaining why it's acceptable: *"Redis lock release is not ownership-safe; this is fine because Postgres is the correctness guarantee — a stale delete only risks a false rejection, never a double booking."*
- **If you want to fix it anyway (nice interview talking point):** generate a random token per request, `SET key token NX EX 10`, and release via a Lua script that only deletes if `GET key == token`.

---

### 7. WebSocket + Cloud Run multi-instance mismatch
**Where:** `07_deployment.md`, `02_backend.md`

`enableSimpleBroker("/topic")` keeps subscriptions in-memory per instance. `07_deployment.md` sets `maxInstanceCount: 10` and claims "session affinity" solves broadcast delivery — it doesn't. If user A is connected to instance 1 and user B's booking is handled by instance 2, instance 2's in-memory broker never reaches user A's socket.

**Fix:** For v1, cap Cloud Run at one instance and say so explicitly:
```yaml
scaling:
  minInstanceCount: 0
  maxInstanceCount: 1   # simple STOMP broker is in-memory; single instance required until Redis pub/sub is added
```
Note in `07_deployment.md`: *"WebSocket broadcast correctness depends on running a single backend instance in v1. Scaling path: Redis pub/sub so any instance can publish to any connected client — not implemented in v1."* Remove the "session affinity" claim; it's not the actual fix and shouldn't be presented as one.

---

### 8. Payment verification trusts the frontend as the final word
**Where:** `05_slot_booking_flow.md`, `PaymentService.verifyPayment()`

The only checks are HMAC signature validity and that the booking exists. Missing:
- booking belongs to the authenticated user
- booking is still `PENDING` (not already `CONFIRMED` or `CANCELLED`)
- the `razorpayOrderId` in the request matches the one stored on the booking
- the amount matches what was expected

Without these, a valid signature for *any* payment could be replayed against a different booking, or a `/payments/verify` retry could double-process.

**Fix:**
```java
public void verifyPayment(VerifyPaymentRequest req, Long bookingId, Long userId) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    if (!booking.getUser().getId().equals(userId))
        throw new AccessDeniedException("Not your booking");
    if (booking.getStatus() != BookingStatus.PENDING)
        throw new IllegalStateException("Booking already processed");
    if (!booking.getRazorpayOrderId().equals(req.getRazorpayOrderId()))
        throw new PaymentFailedException("Order mismatch");

    // ...existing HMAC check...
    // then CONFIRMED
}
```
This also makes the endpoint safely retryable — a second call with the same payload just hits the "already processed" branch instead of erroring or re-writing state.

---

### 9. `total_slots` on `stations` vs actual row count in `slots`
**Where:** `03_database.md`

`stations.total_slots` is a standalone integer with no constraint tying it to `COUNT(slots WHERE station_id = ?)`. Nothing stops these from disagreeing (e.g. admin generates slots for June but `total_slots` still says the March number).

**Fix:** Two reasonable options:
- Treat `total_slots` as **physical charger count** (how many cars can charge simultaneously) — a real, independent fact — and rename it `charger_count` so it's unambiguous. This is probably what you actually mean.
- Or drop the column entirely and compute "N chargers, M slots today" from `slots` directly in `StationService`.

Either way, pick one meaning and rename/document it — right now it's ambiguous between "physical chargers" and "generated time slots," which is a real product-modeling gap, not just a naming nitpick.

---

### 10. Price calculation isn't defined for slots shorter than an hour
**Where:** `05_slot_booking_flow.md`, `04_api.md` (`slotDurationMinutes` in slot generation)

`totalAmount` is set to `slot.getStation().getPricePerHour()` directly, with no duration math. If an admin generates 30-minute slots, every booking is charged the full hourly rate.

**Fix:**
```java
BigDecimal amount = station.getPricePerHour()
    .multiply(BigDecimal.valueOf(Duration.between(slot.getStartTime(), slot.getEndTime()).toMinutes()))
    .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
```
Store this computed `amount` on the booking (already doing this — good), just fix the formula that produces it.

---

## P2 — Small, cheap fixes

### 11. `connector_types` claimed as enum, stored as string
**Where:** `03_database.md`

The ER diagram comment says `(enum)`, the actual column is `VARCHAR(50)`. Not wrong to use a string, just inconsistent labeling.

**Fix:** Change the ER diagram comment to `(validated string, backed by Java enum)`. Define the enum in Java (`CCS2, TYPE2, CHADEMO, GB_T`) and validate incoming API values against it at the controller/DTO boundary — this is the part that was actually missing, not the DB type.

### 12. Pagination shape is non-standard
**Where:** `04_api.md`, `GET /bookings`

```json
{ "bookings": [...], "page": 0, "totalPages": 1 }
```
Fine to keep for a small project, but if you want to look more deliberate, use a consistent envelope across all paginated endpoints (`bookings`, `admin/bookings`):
```json
{ "content": [...], "page": 0, "size": 20, "totalElements": 100, "totalPages": 5 }
```
Not urgent — just note it once and apply the same shape everywhere rather than mixing.

### 13. WebSocket CORS/security is dev-only config presented as final
**Where:** `02_backend.md`

`.setAllowedOriginPatterns("*")` and `/ws/** → permitAll` are reasonable for local dev but shown without a production note.

**Fix:** Add one line to `07_deployment.md`: *"Production sets `allowedOriginPatterns` to the actual frontend origin (`https://evgo.app`), not `*`."* You don't need to build WebSocket-specific JWT auth for a showcase project — just don't leave the wildcard undocumented as if it's the final answer.

### 14. `/admin/dashboard/stats` `totalRevenue` — from what?
**Where:** `04_api.md`

Not clear whether this sums `bookings.total_amount` for `CONFIRMED`/`COMPLETED` only, or includes `PENDING`. A `PENDING` booking that never gets paid shouldn't count as revenue.

**Fix:** One line: *"`totalRevenue` = `SUM(total_amount)` where `booking.status IN ('CONFIRMED', 'COMPLETED')`."*

---

## Explicitly not fixing (deliberate scope cuts — say so in the docs, don't build them)

Add a short "Out of scope for v1, and why" section to `00_overview.md` listing these, so it reads as a decision rather than an omission:

- **Razorpay webhook as the payment source of truth** — v1 trusts the frontend-triggered `/payments/verify` call plus signature check. A webhook is the more correct production pattern (frontend confirmation can be lost/interrupted) but is extra infra for a project with no real payment volume.
- **Idempotency keys on `POST /bookings` / `POST /payments/verify`** — real production concern (client retries could double-submit), not worth building for a showcase project. The `/payments/verify` fix in item 8 already makes retries safe by checking booking status, which covers the common case.
- **Rate limiting, audit logging, structured observability (request IDs, metrics)** — genuinely good production practice, genuinely not worth the build time here.
- **AI destructive-action confirmation step** (confirm before `cancel_booking`) — nice UX safety net, skip it; `BookingService.cancelBooking()` already enforces ownership + status + timing server-side regardless of what the AI decides to call.

---

## Summary — what to actually change in each file

| File | Changes |
|---|---|
| `00_overview.md` | Add "out of scope, and why" section |
| `01_frontend.md` | Remove `⭐ rating` from StationCard mock; `chatStore` becomes display-only, drop `history` from AI request |
| `02_backend.md` | Note on Redis lock release tradeoff; note on WebSocket CORS being dev-only |
| `03_database.md` | Rename/clarify `total_slots` → `charger_count` or drop it; fix ER diagram `(enum)` label |
| `04_api.md` | Remove `rating`; unify payment flow to 3-step (booking → create-order → verify); add `afterTime` to station search; drop `history` from `/ai/chat` request; clarify `totalRevenue` |
| `05_slot_booking_flow.md` | Move Razorpay order creation outside the transaction; harden `verifyPayment` with ownership/status/order-match checks; fix price calc for non-hour slots |
| `06_ai_integration.md` | Add `afterTime` to `search_stations` tool schema; conversation history backend-owned only |
| `07_deployment.md` | Cap `maxInstanceCount: 1` for v1, correct the session-affinity claim, note Redis pub/sub as the scaling path |
