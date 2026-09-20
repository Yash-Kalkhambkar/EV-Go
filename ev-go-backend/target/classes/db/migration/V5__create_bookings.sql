-- V5: Create bookings table
-- Stores user bookings with payment tracking

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_id BIGINT NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    station_id BIGINT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    razorpay_order_id VARCHAR(255),
    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Critical: Only one active booking per slot
-- (allows multiple CANCELLED bookings for same slot)
CREATE UNIQUE INDEX uq_active_booking ON bookings(slot_id) 
    WHERE status NOT IN ('CANCELLED');

-- Indexes for queries
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_station ON bookings(station_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at);
CREATE INDEX idx_bookings_razorpay_order ON bookings(razorpay_order_id);

-- Index for stale booking cleanup job
CREATE INDEX idx_bookings_stale ON bookings(status, booked_at) 
    WHERE status = 'PENDING';

-- Ensure valid status values
ALTER TABLE bookings ADD CONSTRAINT chk_booking_status 
    CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'));

-- Ensure positive amount
ALTER TABLE bookings ADD CONSTRAINT chk_booking_amount_positive 
    CHECK (total_amount > 0);

-- Comments
COMMENT ON TABLE bookings IS 'User bookings for charging slots';
COMMENT ON COLUMN bookings.status IS 'PENDING: awaiting payment, CONFIRMED: paid, CANCELLED: user cancelled, COMPLETED: slot time passed';
COMMENT ON COLUMN bookings.razorpay_order_id IS 'Razorpay order ID for payment tracking';
COMMENT ON COLUMN bookings.booked_at IS 'When booking was created (used for stale cleanup)';
COMMENT ON INDEX uq_active_booking IS 'Prevents double-booking same slot';
