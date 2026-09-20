-- V4: Create slots table
-- Stores individual time slots for each station

CREATE TABLE slots (
    id BIGSERIAL PRIMARY KEY,
    station_id BIGINT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint: one slot per station/date/time
CREATE UNIQUE INDEX uq_slot ON slots(station_id, slot_date, start_time);

-- Indexes for queries
CREATE INDEX idx_slots_station_date ON slots(station_id, slot_date);
CREATE INDEX idx_slots_status ON slots(status);
CREATE INDEX idx_slots_date ON slots(slot_date);

-- Ensure valid status values
ALTER TABLE slots ADD CONSTRAINT chk_slot_status 
    CHECK (status IN ('AVAILABLE', 'RESERVED', 'BOOKED'));

-- Ensure end_time > start_time
ALTER TABLE slots ADD CONSTRAINT chk_slot_times 
    CHECK (end_time > start_time);

-- Comments
COMMENT ON TABLE slots IS 'Time slots for charging stations';
COMMENT ON COLUMN slots.status IS 'AVAILABLE: can book, RESERVED: payment pending, BOOKED: confirmed';
COMMENT ON COLUMN slots.slot_date IS 'Date of the slot (separated from time for easier querying)';
