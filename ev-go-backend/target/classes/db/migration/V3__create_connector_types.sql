-- V3: Create station_connectors table (simple string storage)
--
-- Entity model (Station.java):
--   @ElementCollection of String
--   @CollectionTable(name = "station_connectors")
--   Each station has a set of connector type codes: "CCS2", "CHAdeMO", etc.

CREATE TABLE station_connectors (
    station_id      BIGINT      NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    connector_type  VARCHAR(50) NOT NULL,
    PRIMARY KEY (station_id, connector_type)
);

CREATE INDEX idx_station_connectors_station ON station_connectors(station_id);
CREATE INDEX idx_station_connectors_type    ON station_connectors(connector_type);

-- Comments
COMMENT ON TABLE station_connectors IS 'Connector types for each station (simple string storage: CCS2, CHAdeMO, Type 2, GB/T)';
