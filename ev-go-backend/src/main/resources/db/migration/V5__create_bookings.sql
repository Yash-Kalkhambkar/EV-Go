-- V5: Create bookings table
-- Stores user bookings with full payment and cancellation lifecycle.
--
-- BookingStatus enum (BookingStatus.java):
--   PENDING, CONFIRMED, CANCELLED, COMPLETED
--
-- Booking.java fields:
--   user_id, slot_id, station_id, status, total_amount,
--   razorpay_order_id, booked_at, updated_at, cancelled_at,
--   cancellation_reason, refund_amount

CREATE TABLE bookings (
    id                  BIGSERIAL       PRIMARY KEY,
    user_id             BIGINT          NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    slot_id             BIGINT          NOT NULL REFERENCES slots(id)    ON DELETE CASCADE,
    station_id          BIGINT          NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
    total_amount        DECIMAL(8, 2)   NOT NULL,
    razorpay_order_id   VARCHAR(100),
    booked_at           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at        TIMESTAMP,
    cancellation_reason VARCHAR(500)
);

-- Only one non-cancelled booking per slot (prevents double-booking)
CREATE UNIQUE INDEX uq_active_booking ON bookings(slot_id)
    WHERE status NOT IN ('CANCELLED');

-- Query indexes
CREATE INDEX idx_bookings_user           ON bookings(user_id);
CREATE INDEX idx_bookings_station        ON bookings(station_id);
CREATE INDEX idx_bookings_status         ON bookings(status);
CREATE INDEX idx_bookings_created        ON bookings(booked_at);
CREATE INDEX idx_bookings_razorpay_order ON bookings(razorpay_order_id);

-- Stale PENDING booking cleanup job
CREATE INDEX idx_bookings_stale ON bookings(status, booked_at)
    WHERE status = 'PENDING';

-- Constraints
ALTER TABLE bookings ADD CONSTRAINT chk_booking_status
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'));

ALTER TABLE bookings ADD CONSTRAINT chk_booking_amount_positive
    CHECK (total_amount > 0);

-- Comments
COMMENT ON TABLE bookings IS 'User bookings for charging slots';
COMMENT ON COLUMN bookings.status              IS 'PENDING: awaiting payment | CONFIRMED: paid | CANCELLED: user cancelled | COMPLETED: slot time passed';
COMMENT ON COLUMN bookings.cancellation_reason IS 'Human-readable reason when status=CANCELLED';
COMMENT ON INDEX  uq_active_booking            IS 'Prevents double-booking the same slot';
