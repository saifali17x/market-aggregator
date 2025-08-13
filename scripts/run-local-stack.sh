#!/bin/bash

# Local development stack setup script
# Starts Postgres and Redis in Docker containers and exports environment variables

set -e

echo "🚀 Starting local development stack..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create network first if it doesn't exist
echo "🌐 Creating Docker network..."
docker network create marketplace-network 2>/dev/null || true

# Stop and remove existing containers if they exist
echo "🧹 Cleaning up existing containers..."
docker stop marketplace-postgres marketplace-redis 2>/dev/null || true
docker rm marketplace-postgres marketplace-redis 2>/dev/null || true

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
docker run -d \
    --name marketplace-postgres \
    --network marketplace-network \
    -e POSTGRES_DB=marketplace \
    -e POSTGRES_USER=marketplace_user \
    -e POSTGRES_PASSWORD=marketplace_pass \
    -p 5432:5432 \
    postgres:15-alpine

# Start Redis
echo "🔴 Starting Redis..."
docker run -d \
    --name marketplace-redis \
    --network marketplace-network \
    -p 6379:6379 \
    redis:7-alpine

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Test PostgreSQL connection
echo "🔍 Testing PostgreSQL connection..."
until docker exec marketplace-postgres pg_isready -U marketplace_user -d marketplace > /dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done

# Test Redis connection
echo "🔍 Testing Redis connection..."
until docker exec marketplace-redis redis-cli ping > /dev/null 2>&1; do
    echo "   Waiting for Redis..."
    sleep 2
done

echo "✅ Services are ready!"

# Export environment variables
echo "📝 Exporting environment variables..."
export DATABASE_URL="postgresql://marketplace_user:marketplace_pass@localhost:5432/marketplace"
export REDIS_URL="redis://localhost:6379"
export NODE_ENV="development"
export PORT="3000"
export JWT_SECRET="dev-secret-key-change-in-production"

# Create .env file for the project
cat > .env << EOF
# Local Development Environment
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}
NODE_ENV=${NODE_ENV}
PORT=${PORT}
JWT_SECRET=${JWT_SECRET}

# Scraping Configuration
SCRAPER_TIMEOUT=30000
SCRAPER_RETRY_ATTEMPTS=3
SCRAPER_DELAY_BETWEEN_REQUESTS=1000

# Matching Service
MATCH_THRESHOLD=0.82
SIMILARITY_ALGORITHM=levenshtein

# API Configuration
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000
EOF

echo "📄 Created .env file with local configuration"

# Display connection info
echo ""
echo "🌐 Local Stack Information:"
echo "   PostgreSQL: localhost:5432 marketplace/marketplace_user"
echo "   Redis: localhost:6379"
echo "   Environment variables exported to shell"
echo "   .env file created in project root"
echo ""
echo "💡 To use in another terminal, run:"
echo "   source scripts/run-local-stack.sh"
echo ""
echo "🛑 To stop services:"
echo "   docker stop marketplace-postgres marketplace-redis"
