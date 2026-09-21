-- V4: Create slots table
-- Stores individual time slots for each station.
--
-- SlotStatus enum (SlotStatus.java):
--   AVAILABLE, RESERVED, BOOKED, UNAVAILABLE

CREATE TABLE slots (
    id         BIGSERIAL   PRIMARY KEY,
    station_id BIGINT      NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    slot_date  DATE        NOT NULL,
    start_time TIME        NOT NULL,
    end_time   TIME        NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- One slot per station/date/start_time
CREATE UNIQUE INDEX uq_slot            ON slots(station_id, slot_date, start_time);

-- Query indexes
CREATE INDEX idx_slots_station_date ON slots(station_id, slot_date);
CREATE INDEX idx_slots_status       ON slots(status);
CREATE INDEX idx_slots_date         ON slots(slot_date);

-- All four status values from SlotStatus.java
ALTER TABLE slots ADD CONSTRAINT chk_slot_status
    CHECK (status IN ('AVAILABLE', 'RESERVED', 'BOOKED', 'UNAVAILABLE'));

ALTER TABLE slots ADD CONSTRAINT chk_slot_times
    CHECK (end_time > start_time);

-- Comments
COMMENT ON TABLE slots IS 'Time slots for charging stations';
COMMENT ON COLUMN slots.status IS 'AVAILABLE: bookable | RESERVED: payment pending | BOOKED: confirmed | UNAVAILABLE: admin-blocked';
