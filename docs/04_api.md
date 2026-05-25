# EV GO — API Design

## Conventions

- Base URL: `https://api.evgo.app/api`
- All requests/responses: `application/json`
- Authentication: `Authorization: Bearer <jwt_token>` (except public endpoints)
- Dates: ISO 8601 (`2025-05-20`, `2025-05-20T14:00:00Z`)
- All error responses follow the shape: `{ "code": "ERROR_CODE", "message": "Human-readable message" }`

---

## Auth

### POST `/auth/register`
Public. Creates a new user account.

**Request:**
```json
{
  "fullName": "Yash Kalkhambkar",
  "email": "yash@example.com",
  "password": "SecurePassword123",
  "phone": "9876543210"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "fullName": "Yash Kalkhambkar",
    "email": "yash@example.com",
    "role": "USER"
  }
}
```

---

### POST `/auth/login`
Public.

**Request:**
```json
{
  "email": "yash@example.com",
  "password": "SecurePassword123"
}
```

**Response 200:** Same shape as register.

**Response 401:**
```json
{ "code": "INVALID_CREDENTIALS", "message": "Email or password is incorrect" }
```

---

## Stations

### GET `/stations/search`
Public. Find nearby stations within a radius.

**Query params:**

| Param | Type | Required | Description |
|---|---|---|---|
| `lat` | float | ✅ | User latitude |
| `lng` | float | ✅ | User longitude |
| `radius` | int | ❌ | Radius in km, default 10 |
| `connectorType` | string | ❌ | CCS2, TYPE2, CHADEMO, GB_T |
| `availableOnly` | boolean | ❌ | Default false |
| `date` | date | ❌ | Filter slots by date, default today |

**Response 200:**
```json
{
  "stations": [
    {
      "id": 1,
      "name": "Loni Kalbhor Charging Hub",
      "address": "Railway Station Road, Loni Kalbhor, Pune",
      "latitude": 18.4912,
      "longitude": 73.9821,
      "distanceKm": 1.2,
      "pricePerHour": 12.50,
      "totalSlots": 10,
      "availableSlots": 7,
      "connectorTypes": ["CCS2", "TYPE2"],
      "rating": 4.3
    }
  ]
}
```

---

### GET `/stations/{id}`
Public. Full station detail.

**Response 200:**
```json
{
  "id": 1,
  "name": "Loni Kalbhor Charging Hub",
  "address": "Railway Station Road, Loni Kalbhor, Pune",
  "latitude": 18.4912,
  "longitude": 73.9821,
  "description": "Fast charging hub near the railway station.",
  "pricePerHour": 12.50,
  "totalSlots": 10,
  "connectorTypes": ["CCS2", "TYPE2"],
  "isActive": true
}
```

---

## Slots

### GET `/slots`
Authenticated. Get slots for a station on a specific date.

**Query params:** `stationId` (required), `date` (required, format: `YYYY-MM-DD`)

**Response 200:**
```json
{
  "slots": [
    {
      "id": 101,
      "stationId": 1,
      "date": "2025-05-20",
      "startTime": "09:00",
      "endTime": "10:00",
      "status": "AVAILABLE"
    },
    {
      "id": 102,
      "stationId": 1,
      "date": "2025-05-20",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "BOOKED"
    }
  ]
}
```

---

## Bookings

### POST `/bookings`
Authenticated. Reserve a slot and initiate payment flow.

**Request:**
```json
{
  "slotId": 101,
  "stationId": 1
}
```

**Response 201:**
```json
{
  "bookingId": 55,
  "status": "PENDING",
  "slot": {
    "id": 101,
    "date": "2025-05-20",
    "startTime": "09:00",
    "endTime": "10:00"
  },
  "station": {
    "id": 1,
    "name": "Loni Kalbhor Charging Hub",
    "address": "Railway Station Road, Loni Kalbhor, Pune"
  },
  "totalAmount": 12.50,
  "razorpayOrderId": "order_ABC123"
}
```

**Response 409 (slot taken):**
```json
{ "code": "SLOT_UNAVAILABLE", "message": "This slot was just taken. Please select another." }
```

---

### GET `/bookings`
Authenticated. Get the logged-in user's bookings.

**Query params:** `status` (optional — PENDING, CONFIRMED, CANCELLED, COMPLETED), `page`, `size`

**Response 200:**
```json
{
  "bookings": [
    {
      "id": 55,
      "status": "CONFIRMED",
      "slot": { "date": "2025-05-20", "startTime": "09:00", "endTime": "10:00" },
      "station": { "id": 1, "name": "Loni Kalbhor Charging Hub" },
      "totalAmount": 12.50,
      "bookedAt": "2025-05-18T10:30:00Z"
    }
  ],
  "page": 0,
  "totalPages": 1
}
```

---

### DELETE `/bookings/{id}`
Authenticated. Cancel a booking. Only allowed if `status = CONFIRMED` and slot hasn't started yet.

**Response 200:**
```json
{ "message": "Booking cancelled successfully" }
```

**Response 400:**
```json
{ "code": "CANCELLATION_NOT_ALLOWED", "message": "Cannot cancel a booking less than 1 hour before the slot" }
```

---

## Payments

### POST `/payments/create-order`
Authenticated. Creates a Razorpay order for a pending booking.

**Request:**
```json
{ "bookingId": 55 }
```

**Response 200:**
```json
{
  "razorpayOrderId": "order_ABC123",
  "amount": 1250,
  "currency": "INR",
  "keyId": "rzp_live_XXXXX"
}
```

The frontend uses `razorpayOrderId` and `keyId` to open the Razorpay payment modal.

---

### POST `/payments/verify`
Authenticated. Called after Razorpay payment modal closes successfully. Verifies the payment signature and confirms the booking.

**Request:**
```json
{
  "bookingId": 55,
  "razorpayOrderId": "order_ABC123",
  "razorpayPaymentId": "pay_XYZ789",
  "razorpaySignature": "abc123def456..."
}
```

**Response 200:**
```json
{
  "bookingId": 55,
  "status": "CONFIRMED",
  "message": "Payment successful. Your slot is confirmed."
}
```

**Response 400 (signature mismatch):**
```json
{ "code": "PAYMENT_VERIFICATION_FAILED", "message": "Payment could not be verified" }
```

---

## AI Chat

### POST `/ai/chat`
Authenticated. Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Find me a CCS2 station near Hadapsar open after 6pm today",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help you find a charging station?" }
  ]
}
```

`history` is sent from the frontend's in-memory chat store. The backend appends it to the Claude API call for context.

**Response 200:**
```json
{
  "reply": "I found 3 stations near Hadapsar with CCS2 connectors that have slots after 6pm today:\n\n1. **Hadapsar EV Center** — 1.4 km away, ₹14/hr, slots at 6pm, 7pm, 8pm\n2. ...",
  "stations": [
    { "id": 2, "name": "Hadapsar EV Center", "latitude": 18.5121, "longitude": 73.9435 }
  ]
}
```

The `stations` array is optional — returned when Claude's reply references specific stations, so the frontend can highlight them on the map.

---

## Admin Endpoints

All require `ROLE_ADMIN`.

### GET `/admin/stations`
Returns all stations (including inactive).

### POST `/admin/stations`
Create a new station.

**Request:**
```json
{
  "name": "Magarpatta EV Hub",
  "address": "Magarpatta Road, Hadapsar, Pune",
  "latitude": 18.5100,
  "longitude": 73.9350,
  "pricePerHour": 15.00,
  "connectorTypes": ["CCS2", "TYPE2"],
  "totalSlots": 8
}
```

### PUT `/admin/stations/{id}`
Update station details.

### DELETE `/admin/stations/{id}`
Soft-delete (sets `isActive = false`).

### POST `/admin/slots/generate`
Generate time slots for a station for a date range.

**Request:**
```json
{
  "stationId": 1,
  "fromDate": "2025-06-01",
  "toDate": "2025-06-30",
  "startHour": 8,
  "endHour": 22,
  "slotDurationMinutes": 60
}
```

This generates one slot per hour per day for the station. Existing slots are skipped (idempotent).

### GET `/admin/bookings`
Paginated list of all bookings with filters (`status`, `stationId`, `date`).

### GET `/admin/dashboard/stats`
**Response 200:**
```json
{
  "totalStations": 8,
  "registeredUsers": 342,
  "activeBookings": 21,
  "totalRevenue": 58420.00
}
```

---

## WebSocket Topics

Clients subscribe via STOMP after connecting to `/ws`.

| Topic | When it fires | Payload |
|---|---|---|
| `/topic/stations/{id}/slots` | Any slot status changes at this station | Updated slot list for that station + date |

Frontend subscribes when user opens a station detail page, unsubscribes on navigate away.
