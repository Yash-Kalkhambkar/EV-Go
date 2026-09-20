-- V3: Create connector_types table
-- Stores supported connector types for each station (one-to-many)

CREATE TABLE connector_types (
    id BIGSERIAL PRIMARY KEY,
    station_id BIGINT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    connector_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for filtering stations by connector type
CREATE INDEX idx_connector_types_station ON connector_types(station_id);
CREATE INDEX idx_connector_types_type ON connector_types(connector_type);

-- Prevent duplicate connector types for same station
CREATE UNIQUE INDEX uq_station_connector ON connector_types(station_id, connector_type);

-- Ensure valid connector types
ALTER TABLE connector_types ADD CONSTRAINT chk_connector_type_valid 
    CHECK (connector_type IN ('CCS2', 'CHAdeMO', 'Type 2', 'GB/T'));

-- Comments
COMMENT ON TABLE connector_types IS 'Connector types available at each station';
COMMENT ON COLUMN connector_types.connector_type IS 'Standard connector types: CCS2, CHAdeMO, Type 2, GB/T';
