-- V7: Create short_urls table
-- Stores shortened URLs for booking sharing with click tracking

CREATE TABLE short_urls (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    click_count INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lookups
CREATE INDEX idx_short_urls_code ON short_urls(short_code);
CREATE INDEX idx_short_urls_booking ON short_urls(booking_id);
CREATE INDEX idx_short_urls_user ON short_urls(user_id);
CREATE INDEX idx_short_urls_expires ON short_urls(expires_at);

-- Ensure non-negative click count
ALTER TABLE short_urls ADD CONSTRAINT chk_click_count_nonneg 
    CHECK (click_count >= 0);

-- Comments
COMMENT ON TABLE short_urls IS 'Shortened URLs for booking sharing (pattern: evgo.in/b/abc123)';
COMMENT ON COLUMN short_urls.short_code IS 'Unique 7-character code (alphanumeric)';
COMMENT ON COLUMN short_urls.original_url IS 'Full URL to redirect to (e.g., frontend booking detail page)';
COMMENT ON COLUMN short_urls.booking_id IS 'Optional: link to booking for analytics';
COMMENT ON COLUMN short_urls.click_count IS 'Number of times this short URL was accessed';
COMMENT ON COLUMN short_urls.expires_at IS 'Optional: when this short URL expires (NULL = no expiry)';
