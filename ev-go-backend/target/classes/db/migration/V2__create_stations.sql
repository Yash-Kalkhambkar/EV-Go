-- V2: Create stations table
-- Stores EV charging station master data

CREATE TABLE stations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    description TEXT,
    total_slots INTEGER NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for proximity search (bounding box queries)
CREATE INDEX idx_stations_location ON stations(latitude, longitude);
CREATE INDEX idx_stations_active ON stations(is_active);

-- Ensure positive values
ALTER TABLE stations ADD CONSTRAINT chk_total_slots_positive CHECK (total_slots > 0);
ALTER TABLE stations ADD CONSTRAINT chk_price_positive CHECK (price_per_hour > 0);

-- Comments
COMMENT ON TABLE stations IS 'EV charging stations with location and pricing';
COMMENT ON COLUMN stations.is_active IS 'Soft delete flag - inactive stations hidden from search';
COMMENT ON COLUMN stations.price_per_hour IS 'Base price per hour in INR';
