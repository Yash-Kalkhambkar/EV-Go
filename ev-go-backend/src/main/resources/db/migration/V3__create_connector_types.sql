-- V3: Create connector_types lookup table + station_connectors join table
--
-- Entity model (ConnectorType.java / Station.java):
--   Station <---> ConnectorType  is ManyToMany
--   @JoinTable name="station_connectors"
--
-- connector_types: lookup/master table (code, name, description, is_active)
-- station_connectors: join table (station_id, connector_type_id)

CREATE TABLE connector_types (
    id          BIGSERIAL    PRIMARY KEY,
    code        VARCHAR(50)  NOT NULL UNIQUE,   -- e.g. "CCS2", "CHAdeMO"
    name        VARCHAR(100) NOT NULL,           -- e.g. "CCS2 (Combined Charging System)"
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT true
);

CREATE INDEX idx_connector_types_code ON connector_types(code);

-- Seed the four standard types used everywhere
INSERT INTO connector_types (code, name, description) VALUES
  ('CCS2',    'CCS2 (Combined Charging System)', 'Most common DC fast-charging standard in Europe and India'),
  ('CHAdeMO', 'CHAdeMO',                         'Japanese DC fast-charging standard'),
  ('Type 2',  'Type 2 (IEC 62196)',              'Standard AC charging connector'),
  ('GB/T',    'GB/T',                            'Chinese national standard');

-- Join table used by Station.connectorTypes @ManyToMany
CREATE TABLE station_connectors (
    station_id        BIGINT NOT NULL REFERENCES stations(id)        ON DELETE CASCADE,
    connector_type_id BIGINT NOT NULL REFERENCES connector_types(id) ON DELETE CASCADE,
    PRIMARY KEY (station_id, connector_type_id)
);

CREATE INDEX idx_station_connectors_station   ON station_connectors(station_id);
CREATE INDEX idx_station_connectors_connector ON station_connectors(connector_type_id);

-- Comments
COMMENT ON TABLE connector_types    IS 'Lookup table of EV connector standards (CCS2, CHAdeMO, Type 2, GB/T)';
COMMENT ON TABLE station_connectors IS 'Many-to-many join: which connector types a station supports';
