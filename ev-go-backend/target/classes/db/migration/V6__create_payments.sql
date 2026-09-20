-- V6: Create payments table
-- Stores payment records after successful Razorpay verification

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255) NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lookups
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_razorpay_order ON payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment ON payments(razorpay_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Unique constraint: one payment record per booking
CREATE UNIQUE INDEX uq_payment_booking ON payments(booking_id);

-- Ensure valid status values
ALTER TABLE payments ADD CONSTRAINT chk_payment_status 
    CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED'));

-- Ensure positive amount
ALTER TABLE payments ADD CONSTRAINT chk_payment_amount_positive 
    CHECK (amount > 0);

-- Comments
COMMENT ON TABLE payments IS 'Payment records after Razorpay verification';
COMMENT ON COLUMN payments.razorpay_order_id IS 'Razorpay order ID from create-order API';
COMMENT ON COLUMN payments.razorpay_payment_id IS 'Razorpay payment ID from frontend callback';
COMMENT ON COLUMN payments.razorpay_signature IS 'HMAC-SHA256 signature for verification';
COMMENT ON COLUMN payments.status IS 'PENDING: order created, SUCCESS: payment verified, FAILED: verification failed';
