-- ============================================================
-- V8: Create audit_logs table (append-only, no updates/deletes)
-- Requirements: 32.1, 32.5, 32.6
-- ============================================================

CREATE TABLE audit_logs (
    id          BIGSERIAL       PRIMARY KEY,
    entity_type VARCHAR(50)     NOT NULL,
    entity_id   BIGINT          NOT NULL,
    action      VARCHAR(50)     NOT NULL,
    actor_id    BIGINT          REFERENCES users(id),
    actor_type  VARCHAR(20)     NOT NULL,
    old_state   JSONB,
    new_state   JSONB,
    metadata    JSONB,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Fast lookup by entity
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

-- Time-range queries and retention
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Actor-based queries
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
