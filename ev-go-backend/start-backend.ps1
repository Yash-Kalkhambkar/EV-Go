# EV-GO Backend Startup Script
# Sets environment variables and starts Spring Boot application

Write-Host "Starting EV-GO Backend..." -ForegroundColor Green

# Set timezone to UTC to avoid Asia/Calcutta issue with PostgreSQL 15
$env:JAVA_TOOL_OPTIONS = "-Duser.timezone=UTC"

# Database connection (default to Docker PostgreSQL)
$env:DB_URL = "jdbc:postgresql://localhost:5432/evgo"
$env:DB_USER = "evgo"
$env:DB_PASSWORD = "evgo"

# Redis connection (default to Docker Redis)
$env:REDIS_HOST = "localhost"
$env:REDIS_PORT = "6379"

# JWT secret (insecure default for local testing)
$env:JWT_SECRET = "test-secret-key-minimum-256-bits-long-for-local-testing-only-do-not-use-in-production"

# Optional API keys (empty defaults)
if (-not $env:CLAUDE_API_KEY) { $env:CLAUDE_API_KEY = "" }
if (-not $env:RAZORPAY_KEY_ID) { $env:RAZORPAY_KEY_ID = "" }
if (-not $env:RAZORPAY_KEY_SECRET) { $env:RAZORPAY_KEY_SECRET = "" }
if (-not $env:GOOGLE_MAPS_API_KEY) { $env:GOOGLE_MAPS_API_KEY = "" }

Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "  DB_URL: $env:DB_URL"
Write-Host "  REDIS_HOST: $env:REDIS_HOST"
Write-Host "  Timezone: UTC (via JAVA_TOOL_OPTIONS)"

Write-Host "`nStarting Maven..." -ForegroundColor Yellow
mvn spring-boot:run
