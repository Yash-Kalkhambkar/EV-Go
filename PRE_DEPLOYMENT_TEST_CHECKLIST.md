# Pre-Deployment Test Checklist
**Purpose:** Verify all contracts before writing Terraform with real values  
**Date:** 2026-09-21  
**Status:** ⏳ Awaiting execution

---

## Prerequisites

### 1. Start PostgreSQL
```powershell
# If using Docker:
docker run --name evgo-postgres -e POSTGRES_PASSWORD=evgo -e POSTGRES_USER=evgo -e POSTGRES_DB=evgo -p 5432:5432 -d postgres:15

# Or use local PostgreSQL installation
# Ensure database 'evgo' exists with user 'evgo' / password 'evgo'
```

### 2. Start Redis
```powershell
# If using Docker:
docker run --name evgo-redis -p 6379:6379 -d redis:7-alpine

# Or use local Redis installation
```

### 3. Verify services are running
```powershell
# Test PostgreSQL connection
psql -h localhost -U evgo -d evgo -c "SELECT 1;"

# Test Redis connection
redis-cli ping
# Should return: PONG
```

---

## Backend Startup

### 1. Set required environment variables
```powershell
# Navigate to backend
cd e:\Work\EVCharging\ev-go-backend

# Set environment variables (adjust values as needed)
$env:JWT_SECRET = "your-256-bit-secret-key-here-minimum-32-characters-long"
$env:RAZORPAY_KEY_ID = "rzp_test_your_key_id"
$env:RAZORPAY_KEY_SECRET = "your_razorpay_secret"
$env:CLAUDE_API_KEY = "your_claude_api_key"
$env:GOOGLE_MAPS_API_KEY = "your_google_maps_key"
```

### 2. Start backend
```powershell
mvn spring-boot:run
```

### 3. Verify backend startup
**Expected in logs:**
- ✅ Flyway migrations run successfully (V1 through V8)
- ✅ HikariCP connection pool initialized
- ✅ Redis connection established
- ✅ Server started on port **8081**
- ✅ No errors about missing columns/tables

**Check endpoints:**
```powershell
# Health check
curl http://localhost:8081/actuator/health
# Expected: {"status":"UP"}

# Prometheus metrics (optional)
curl http://localhost:8081/actuator/prometheus
```

---

## Frontend Startup

### 1. Navigate to frontend
```powershell
cd e:\Work\EVCharging\ev-go-frontend
```

### 2. Install dependencies (if not already done)
```powershell
npm install
```

### 3. Start frontend
```powershell
npm run dev
```

### 4. Verify frontend startup
**Expected:**
- ✅ Dev server running on port **8080** (or configured port)
- ✅ No TypeScript compilation errors
- ✅ Opens in browser at `http://localhost:8080`

---

## Test Scenarios

### ✅ Scenario 1: User Registration & Login

**Steps:**
1. Navigate to `http://localhost:8080/register`
2. Register new user:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Phone: "9876543210"
3. Click Register

**Expected:**
- ✅ Backend receives POST `/api/auth/register`
- ✅ User created in database
- ✅ JWT token returned
- ✅ Redirects to `/stations` (user role)

**Verify:**
4. Logout (if implemented) or clear localStorage
5. Login with same credentials
   - Email: "test@example.com"
   - Password: "password123"

**Expected:**
- ✅ Backend receives POST `/api/auth/login`
- ✅ JWT token returned
- ✅ Redirects to `/stations`

---

### ✅ Scenario 2: Admin User Creation

**Manual database operation:**
```sql
-- Connect to PostgreSQL
psql -h localhost -U evgo -d evgo

-- Create admin user
INSERT INTO users (full_name, email, password_hash, role, phone)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$rZ8Y.8N.ZQ.JXq8Y.8N.ZQhKx0L0J0X0J0X0J0X0J0X0J0X0J0',  -- bcrypt hash of "admin123"
  'ADMIN',
  '1234567890'
);
```

**Note:** You'll need to generate proper bcrypt hash. Can use online tool or backend endpoint.

**Alternative:** Update existing user to ADMIN:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'test@example.com';
```

**Verify:**
1. Login as admin
2. Should redirect to `/admin` (not `/stations`)

---

### ✅ Scenario 3: Create Station (Admin)

**Steps:**
1. Login as admin user
2. Navigate to `/admin/stations/new`
3. Fill station form:
   - Name: "Delhi Central Mall"
   - Address: "Connaught Place, New Delhi, Delhi 110001"
   - Latitude: 28.6328
   - Longitude: 77.2197
   - Description: "Fast charging station in central Delhi"
   - Total Slots: 10
   - Price Per Hour: 50.00
   - Connector Types: Select "CCS2" and "Type 2"
4. Submit form

**Expected:**
- ✅ Backend receives POST `/api/admin/stations`
- ✅ Station created with ID returned
- ✅ `station_connectors` table has two rows: ("CCS2", "Type 2")
- ✅ Redirects to station list or shows success message

**Verify in database:**
```sql
SELECT * FROM stations WHERE name = 'Delhi Central Mall';
SELECT * FROM station_connectors WHERE station_id = (SELECT id FROM stations WHERE name = 'Delhi Central Mall');
```

---

### ✅ Scenario 4: Generate Slots (Admin)

**Steps:**
1. Navigate to `/admin/stations/{stationId}/slots`
2. Select date range: Today to 7 days from now
3. Click "Generate Slots"

**Expected:**
- ✅ Backend receives POST `/api/admin/stations/{id}/slots/generate`
- ✅ Slots created for date range (24-hour coverage per day, 1-hour intervals)
- ✅ All slots have status = `AVAILABLE`
- ✅ Success message shows "X slots generated"

**Verify in database:**
```sql
SELECT slot_date, COUNT(*) as slot_count, status
FROM slots
WHERE station_id = 1  -- use actual station ID
GROUP BY slot_date, status
ORDER BY slot_date;
```

---

### ✅ Scenario 5: Search Stations (User)

**Steps:**
1. Login as regular user
2. Navigate to `/stations`
3. Enter search criteria:
   - Latitude: 28.6328
   - Longitude: 77.2197
   - Radius: 10 km
   - Connector Type: "CCS2" (optional)
4. Click Search

**Expected:**
- ✅ Backend receives GET `/api/stations/search?lat=28.6328&lng=77.2197&radius=10&connectorType=CCS2`
- ✅ Returns station created in Scenario 3
- ✅ Station card shows:
  - Name, address
  - Distance (calculated via Haversine)
  - Price per hour
  - Connector types: "CCS2, Type 2"
  - "Available" status

---

### ✅ Scenario 6: View Station Details & Slots

**Steps:**
1. Click on station card from search results
2. Should navigate to `/stations/{stationId}`

**Expected:**
- ✅ Backend receives GET `/api/stations/{id}`
- ✅ Station details displayed
- ✅ Date picker shows (default: today)

**Select a date:**
3. Pick today's date
4. Should load slot grid

**Expected:**
- ✅ Backend receives GET `/api/slots?stationId={id}&date=2026-09-21`
- ✅ Slots displayed in grid format (e.g., 00:00-01:00, 01:00-02:00, ...)
- ✅ All slots show status "AVAILABLE" (green)
- ✅ Each slot shows time range and "Book" button

---

### ✅ Scenario 7: Book a Slot (Critical Flow)

**Steps:**
1. On station details page, select an AVAILABLE slot
2. Click "Book" button

**Expected (Booking Creation):**
- ✅ Backend receives POST `/api/bookings` with `{ "slotId": 123 }`
- ✅ Distributed lock acquired on slot (Redis)
- ✅ Booking created with status = `PENDING`
- ✅ Slot status updated to `RESERVED`
- ✅ Response includes `razorpayOrderId`

**Expected (Payment Order Creation):**
- ✅ Backend immediately calls POST `/api/payments/create-order` with `{ "bookingId": 456 }`
- ✅ Razorpay order created
- ✅ Response includes:
  ```json
  {
    "orderId": "order_MxK1aB2cD3eF4g",
    "amount": 5000,  // in paise (50.00 INR)
    "currency": "INR"
  }
  ```

**Expected (Razorpay Modal):**
- ✅ Razorpay checkout modal opens in browser
- ✅ Amount displayed: ₹50.00 (not 5000)
- ✅ User can enter test card details

**Test Card (Razorpay Test Mode):**
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: 123
- Name: Any name

3. Complete payment in Razorpay modal

**Expected (Payment Verification):**
- ✅ Frontend receives Razorpay callback with:
  - `razorpay_payment_id`
  - `razorpay_order_id`
  - `razorpay_signature`
- ✅ Frontend calls POST `/api/payments/verify?bookingId=456`
- ✅ Request body (camelCase):
  ```json
  {
    "razorpayOrderId": "order_MxK1aB2cD3eF4g",
    "razorpayPaymentId": "pay_Xyz...",
    "razorpaySignature": "abc123..."
  }
  ```
- ✅ Backend verifies HMAC signature
- ✅ Booking status updated to `CONFIRMED`
- ✅ Slot status updated to `BOOKED`
- ✅ Payment status updated to `SUCCESS`
- ✅ Success message shown
- ✅ User redirected to booking details or "My Bookings"

**Verify in database:**
```sql
-- Check booking
SELECT id, user_id, slot_id, status, total_amount, razorpay_order_id
FROM bookings
WHERE id = 456;  -- use actual booking ID

-- Check payment
SELECT id, booking_id, razorpay_order_id, razorpay_payment_id, status, amount
FROM payments
WHERE booking_id = 456;

-- Check slot status
SELECT id, station_id, slot_date, start_time, end_time, status
FROM slots
WHERE id = 123;  -- use actual slot ID
```

**Expected values:**
- `bookings.status` = `'CONFIRMED'`
- `payments.status` = `'SUCCESS'`
- `slots.status` = `'BOOKED'`

---

### ✅ Scenario 8: WebSocket Real-Time Updates

**Setup:**
1. Open two browser windows side-by-side
2. Login as different users in each (or same user, different sessions)
3. Both navigate to same station details page, same date

**Steps:**
1. In Window 1: Book a slot (follow Scenario 7)

**Expected in Window 2:**
- ✅ WebSocket connected to `ws://localhost:8081/ws/bookings?token={jwt}`
- ✅ Receives `booking_update` message when booking confirmed
- ✅ Slot grid updates in real-time (slot changes from AVAILABLE → BOOKED)
- ✅ "Book" button becomes disabled for that slot

**Verify WebSocket connection:**
- Open browser DevTools → Network tab → WS filter
- Should see WebSocket connection to `ws://localhost:8081/ws/bookings`
- Should see messages flowing (e.g., `{"type":"booking_update","data":{...}}`)

---

### ✅ Scenario 9: My Bookings (User)

**Steps:**
1. Navigate to `/bookings`

**Expected:**
- ✅ Backend receives GET `/api/bookings/my` (NOT `/api/bookings/me`)
- ✅ Response grouped into 4 buckets:
  ```json
  {
    "upcoming": [...],    // CONFIRMED, future slots
    "pending": [...],     // PENDING, awaiting payment
    "past": [...],        // COMPLETED
    "cancelled": [...]    // CANCELLED
  }
  ```
- ✅ Booking from Scenario 7 appears in "upcoming" section
- ✅ Shows: station name, date, time range, amount, status

---

### ✅ Scenario 10: Cancel Booking

**Steps:**
1. On "My Bookings" page, click on a confirmed booking
2. Navigate to `/bookings/{bookingId}`
3. Click "Cancel" button
4. Confirm cancellation (optional reason: "Change of plans")

**Expected:**
- ✅ Backend receives POST `/api/bookings/{id}/cancel` with `{ "reason": "Change of plans" }`
- ✅ Booking status updated to `CANCELLED`
- ✅ `cancelled_at` timestamp set
- ✅ `cancellation_reason` = "Change of plans"
- ✅ Slot status reverted to `AVAILABLE`
- ✅ Payment status updated to `FAILED` (no refund tracking)
- ✅ WebSocket notification sent (other users see slot available again)
- ✅ Success message shown
- ✅ Booking moved to "cancelled" section

**Verify in database:**
```sql
SELECT id, status, cancelled_at, cancellation_reason
FROM bookings
WHERE id = 456;

SELECT id, status FROM slots WHERE id = 123;
SELECT id, status FROM payments WHERE booking_id = 456;
```

**Expected values:**
- `bookings.status` = `'CANCELLED'`
- `bookings.cancellation_reason` = `'Change of plans'`
- `slots.status` = `'AVAILABLE'`
- `payments.status` = `'FAILED'`

**Critical check:**
- ✅ NO `refund_amount` or `refund_status` columns in database
- ✅ NO `REFUNDED` enum values used

---

### ✅ Scenario 11: Admin View All Bookings

**Steps:**
1. Login as admin
2. Navigate to `/admin/bookings`

**Expected:**
- ✅ Backend receives GET `/api/admin/bookings?page=0&size=20`
- ✅ Returns paginated list of ALL bookings (across all users)
- ✅ Shows: booking ID, user email/name, station name, date, time, status, amount
- ✅ Can filter by status (dropdown: All, PENDING, CONFIRMED, CANCELLED, COMPLETED)

**Test filter:**
3. Select "CONFIRMED" from status filter

**Expected:**
- ✅ Backend receives GET `/api/admin/bookings?page=0&size=20&status=CONFIRMED`
- ✅ Only shows confirmed bookings

**Click on a booking:**
4. Should navigate to booking detail view (admin-specific)

**Expected:**
- ✅ Shows full booking details including user info

---

### ✅ Scenario 12: AI Assistant (Optional)

**Steps:**
1. Navigate to `/assistant`
2. Type a question: "What charging stations are available near Connaught Place?"
3. Submit

**Expected:**
- ✅ Backend receives POST `/api/ai/chat`
- ✅ Request body:
  ```json
  {
    "sessionId": "uuid-here",
    "message": "What charging stations are available near Connaught Place?"
  }
  ```
- ✅ Claude API called (if `CLAUDE_API_KEY` set)
- ✅ Response returned with AI-generated answer
- ✅ Conversation history maintained (subsequent messages reference context)

**Note:** This can fail if Claude API key is not set; that's acceptable for local testing.

---

## Critical Verifications

### ✅ Port Configuration
- Backend running on port: **8081** (verify in logs and curl)
- Frontend running on port: **8080** (or auto-assigned)
- CORS allows `http://localhost:8080` (check backend logs for CORS errors)

### ✅ Endpoint Paths
- User bookings: `/api/bookings/my` ✅ (NOT `/api/bookings/me`)
- Admin bookings: `/api/admin/bookings` ✅ (exists now)
- Payment verify field names: `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` (camelCase) ✅

### ✅ Database Schema
Run this query to verify schema matches migrations:
```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables:
-- bookings
-- flyway_schema_history
-- payments
-- short_urls
-- slots
-- station_connectors
-- stations
-- users

-- Check bookings columns (NO refund_amount)
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- Check payments columns (NO refund_amount, NO refund_status)
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- Check station_connectors structure (simple strings, no FK to connector_types)
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'station_connectors'
ORDER BY ordinal_position;

-- Expected: station_id (bigint), connector_type (varchar)
-- NOT: station_id, connector_type_id with FK

-- Check PaymentStatus enum values
SELECT DISTINCT status FROM payments;
-- Expected: CREATED, SUCCESS, FAILED (only these 3)
-- NOT: REFUNDED, PARTIALLY_REFUNDED, REFUND_FAILED
```

### ✅ Connector Types
```sql
-- Check connector types are stored as strings
SELECT station_id, connector_type
FROM station_connectors;

-- Expected output:
-- station_id | connector_type
-- -----------+---------------
--          1 | CCS2
--          1 | Type 2

-- NO connector_types table should exist
SELECT * FROM connector_types;
-- Expected: ERROR: relation "connector_types" does not exist
```

---

## Known Limitations (Acceptable for v1)

1. **No refund processing** — cancellations release slots but don't trigger Razorpay refunds
2. **Test Razorpay only** — production keys will fail, use test mode
3. **No email notifications** — bookings confirmed but no email sent
4. **AI assistant optional** — works only if Claude API key configured
5. **Manual admin user creation** — no admin registration UI

---

## Failure Cases to Test

### Race Condition (Concurrent Booking)
**Setup:**
1. Open two browser windows, login as different users
2. Both navigate to same station, same slot

**Test:**
1. Both click "Book" on same slot simultaneously

**Expected:**
- ✅ First request acquires Redis distributed lock
- ✅ First booking succeeds (status = PENDING → CONFIRMED after payment)
- ✅ Second request fails with **409 Conflict** ("Slot already reserved")
- ✅ Second user sees error message
- ✅ Slot shows as RESERVED/BOOKED in second user's view (real-time update via WebSocket)

---

## Success Criteria

Before proceeding to Terraform, ALL of the following must pass:

- ✅ Backend starts on port 8081 without errors
- ✅ Frontend starts on port 8080 without TypeScript errors
- ✅ User can register, login, see JWT token
- ✅ Admin can create station with connector types stored as strings
- ✅ Admin can generate slots
- ✅ User can search stations by location
- ✅ User can book slot → Razorpay modal opens → payment succeeds → booking confirmed
- ✅ WebSocket updates work (slot status changes real-time in other browser)
- ✅ User can view "My Bookings" via `/api/bookings/my`
- ✅ User can cancel booking → slot becomes available again
- ✅ Admin can view all bookings via `/api/admin/bookings`
- ✅ Database has NO `refund_amount`, `refund_status` columns
- ✅ Database has NO `connector_types` table (only `station_connectors` with strings)
- ✅ Payment status enum has only 3 values (CREATED, SUCCESS, FAILED)
- ✅ Race condition handled correctly (409 on concurrent booking)

---

## After Testing: Update Documentation

If any values differ from expectations, update these files:
- `API_CONTRACT_FINAL.md` — correct port, endpoints
- `CRITICAL_VERIFICATION_FINDINGS.md` — mark blockers as resolved
- `terraform/variables.tf` — use verified port, CORS origins

**Then** proceed to write complete Terraform for GCP deployment.
