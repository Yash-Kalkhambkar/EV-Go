-- V1: Create users table
-- Stores user accounts (both USER and ADMIN roles)

CREATE TABLE users (
    id            BIGSERIAL    PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    phone         VARCHAR(20),
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- Valid roles only
ALTER TABLE users ADD CONSTRAINT chk_user_role CHECK (role IN ('USER', 'ADMIN'));

-- Comments
COMMENT ON TABLE users IS 'User accounts with authentication credentials';
