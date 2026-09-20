-- V6: Create payments table
-- Stores Razorpay payment records.
--
-- PaymentStatus enum (PaymentStatus.java):
--   CREATED, SUCCESS, FAILED
--
-- Payment.java fields:
--   booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature,
--   amount, currency, status, created_at, updated_at

CREATE TABLE payments (
    id                   BIGSERIAL      PRIMARY KEY,
    booking_id           BIGINT         NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    razorpay_order_id    VARCHAR(100)   NOT NULL,
    razorpay_payment_id  VARCHAR(100),
    razorpay_signature   VARCHAR(255),
    amount               DECIMAL(8, 2)  NOT NULL,
    currency             VARCHAR(10)    NOT NULL DEFAULT 'INR',
    status               VARCHAR(30)    NOT NULL DEFAULT 'CREATED',
    created_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Query indexes
CREATE INDEX idx_payments_booking           ON payments(booking_id);
CREATE INDEX idx_payments_razorpay_order    ON payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment  ON payments(razorpay_payment_id);
CREATE INDEX idx_payments_status            ON payments(status);

-- One payment record per booking
CREATE UNIQUE INDEX uq_payment_booking ON payments(booking_id);

-- All values from PaymentStatus.java
ALTER TABLE payments ADD CONSTRAINT chk_payment_status
    CHECK (status IN ('CREATED', 'SUCCESS', 'FAILED'));

ALTER TABLE payments ADD CONSTRAINT chk_payment_amount_positive
    CHECK (amount > 0);

-- Comments
COMMENT ON TABLE payments IS 'Razorpay payment records — one per booking';
COMMENT ON COLUMN payments.razorpay_order_id   IS 'Order ID from Razorpay create-order API';
COMMENT ON COLUMN payments.razorpay_payment_id IS 'Payment ID from Razorpay frontend callback';
COMMENT ON COLUMN payments.razorpay_signature  IS 'HMAC-SHA256 signature for server-side verification';
COMMENT ON COLUMN payments.status              IS 'CREATED: order placed | SUCCESS: verified | FAILED: rejected';
