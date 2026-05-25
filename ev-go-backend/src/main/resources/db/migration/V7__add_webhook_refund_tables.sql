-- ============================================================
-- V7: Add webhook_events and refunds tables
-- Requirements: 4.2 (webhook idempotency), 4.7 (webhook retry tracking),
--               6.2 (refund tracking), 6.6 (refund status)
-- ============================================================

-- ── webhook_events ────────────────────────────────────────────────────────────
-- Stores incoming webhook events for idempotency checking and retry tracking.
-- The idempotency_key (Razorpay order ID) ensures duplicate webhooks are detected.

CREATE TABLE webhook_events (
    id                  BIGSERIAL       PRIMARY KEY,
    source              VARCHAR(50)     NOT NULL,                       -- e.g. RAZORPAY
    event_type          VARCHAR(100)    NOT NULL,                       -- e.g. payment.captured
    idempotency_key     VARCHAR(255)    NOT NULL,                       -- Razorpay order ID
    payload             JSONB           NOT NULL,                       -- raw webhook body
    signature           VARCHAR(500),                                   -- X-Razorpay-Signature header
    signature_valid     BOOLEAN,                                        -- result of HMAC verification
    processing_status   VARCHAR(20)     NOT NULL DEFAULT 'PENDING',     -- PENDING | SUCCESS | FAILED | RETRY
    retry_count         INT             NOT NULL DEFAULT 0,
    error_message       TEXT,
    processed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_webhook_idempotency UNIQUE (idempotency_key)
);

-- Fast lookup by idempotency key (deduplication check on every incoming webhook)
CREATE INDEX idx_webhook_idempotency ON webhook_events (idempotency_key);

-- Retry job queries for PENDING / RETRY events
CREATE INDEX idx_webhook_status ON webhook_events (processing_status);

-- Time-range queries and retention cleanup
CREATE INDEX idx_webhook_created ON webhook_events (created_at DESC);


-- ── refunds ───────────────────────────────────────────────────────────────────
-- Tracks partial and full refunds issued via Razorpay.
-- Each refund is linked to both the payment and the booking for audit purposes.

CREATE TABLE refunds (
    id                  BIGSERIAL       PRIMARY KEY,
    payment_id          BIGINT          NOT NULL REFERENCES payments(id)  ON DELETE RESTRICT,
    booking_id          BIGINT          NOT NULL REFERENCES bookings(id)  ON DELETE RESTRICT,
    razorpay_refund_id  VARCHAR(100),                                   -- filled after Razorpay confirms
    amount              DECIMAL(8,2)    NOT NULL,
    reason              VARCHAR(500),
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING',     -- PENDING | SUCCESS | FAILED
    initiated_by        BIGINT          REFERENCES users(id),           -- user or admin who triggered refund
    retry_count         INT             NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Lookup refunds by payment (e.g. "has this payment been refunded?")
CREATE INDEX idx_refunds_payment ON refunds (payment_id);

-- Lookup refunds by booking (e.g. "show refund status for this booking")
CREATE INDEX idx_refunds_booking ON refunds (booking_id);

-- Retry job queries for PENDING / FAILED refunds
CREATE INDEX idx_refunds_status ON refunds (status);


-- ── ALTER payments ────────────────────────────────────────────────────────────
-- Add refund tracking columns to the payments table.
-- refund_amount: cumulative amount refunded so far (supports partial refunds)
-- refund_status: NULL | PARTIALLY_REFUNDED | FULLY_REFUNDED

ALTER TABLE payments
    ADD COLUMN IF NOT EXISTS refund_amount  DECIMAL(8,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS refund_status  VARCHAR(20);


-- ── ALTER bookings ────────────────────────────────────────────────────────────
-- Add cancellation metadata and refund amount to bookings.

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS cancelled_at           TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cancellation_reason    VARCHAR(500),
    ADD COLUMN IF NOT EXISTS refund_amount          DECIMAL(8,2);
