-- V8: Clean up old tables from previous production spec
-- These tables were created in deleted migrations and are no longer needed

-- Drop webhook-related tables (if they exist from old migrations)
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS webhook_retry_jobs CASCADE;

-- Drop audit logging tables (if they exist from old migrations)
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Drop refund tables (if they exist from old migrations)
DROP TABLE IF EXISTS refunds CASCADE;

-- Drop any orphaned sequences
DROP SEQUENCE IF EXISTS webhook_events_id_seq CASCADE;
DROP SEQUENCE IF EXISTS webhook_retry_jobs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS audit_logs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS refunds_id_seq CASCADE;

-- Note: plpgsql extension is enabled by default in modern PostgreSQL
