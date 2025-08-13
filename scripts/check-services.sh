#!/bin/bash

# Service health check script
# Checks API health, Redis connectivity, and database connectivity

set -e

echo "🔍 Checking service health..."

# Check if .env exists and source it
if [ -f .env ]; then
    echo "📄 Loading environment from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found. Using default values..."
    export DATABASE_URL="postgresql://marketplace_user:marketplace_pass@localhost:5432/marketplace"
    export REDIS_URL="redis://localhost:6379"
    export PORT="3000"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    else
        echo -e "${RED}❌ $message${NC}"
    fi
}

echo ""
echo "🌐 API Health Check"
echo "=================="

# Check if API is running
if curl -s "http://localhost:${PORT:-3000}/health" > /dev/null 2>&1; then
    print_status "OK" "API is responding on port ${PORT:-3000}"
    
    # Test API endpoints
    echo "   Testing endpoints..."
    
    # Health endpoint
    if response=$(curl -s "http://localhost:${PORT:-3000}/health" 2>/dev/null); then
        print_status "OK" "Health endpoint: /health"
    else
        print_status "ERROR" "Health endpoint failed"
    fi
    
    # Listings endpoint (if exists)
    if response=$(curl -s "http://localhost:${PORT:-3000}/api/listings" 2>/dev/null); then
        if echo "$response" | grep -q "error\|Error"; then
            print_status "WARNING" "Listings endpoint: /api/listings (returns error)"
        else
            print_status "OK" "Listings endpoint: /api/listings"
        fi
    else
        print_status "WARNING" "Listings endpoint: /api/listings (not accessible)"
    fi
    
else
    print_status "ERROR" "API is not responding on port ${PORT:-3000}"
    echo "   Make sure the API server is running: npm start"
fi

echo ""
echo "🔴 Redis Health Check"
echo "===================="

# Check Redis connectivity
if command -v redis-cli >/dev/null 2>&1; then
    if redis-cli -u "${REDIS_URL:-redis://localhost:6379}" ping > /dev/null 2>&1; then
        print_status "OK" "Redis is responding"
        
        # Test Redis operations
        if redis-cli -u "${REDIS_URL:-redis://localhost:6379}" set test_key "test_value" > /dev/null 2>&1; then
            if redis-cli -u "${REDIS_URL:-redis://localhost:6379}" get test_key | grep -q "test_value"; then
                print_status "OK" "Redis read/write operations working"
                redis-cli -u "${REDIS_URL:-redis://localhost:6379}" del test_key > /dev/null 2>&1
            else
                print_status "ERROR" "Redis read operation failed"
            fi
        else
            print_status "ERROR" "Redis write operation failed"
        fi
    else
        print_status "ERROR" "Redis is not responding"
        echo "   Make sure Redis is running: scripts/run-local-stack.sh"
    fi
else
    print_status "WARNING" "redis-cli not found, skipping Redis tests"
fi

echo ""
echo "🐘 Database Health Check"
echo "======================="

# Check PostgreSQL connectivity
if command -v psql >/dev/null 2>&1; then
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        print_status "OK" "PostgreSQL connection successful"
        
        # Test database operations
        echo "   Testing database operations..."
        
        # Check if tables exist
        if psql "$DATABASE_URL" -c "\dt" | grep -q "sellers\|products\|listings"; then
            print_status "OK" "Core tables exist (sellers, products, listings)"
        else
            print_status "WARNING" "Core tables not found - run: scripts/seed-minimal.sh"
        fi
        
        # Check table counts
        if sellers_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM sellers;" 2>/dev/null | tr -d ' '); then
            if [ "$sellers_count" -gt 0 ]; then
                print_status "OK" "Sellers table has $sellers_count records"
            else
                print_status "WARNING" "Sellers table is empty"
            fi
        else
            print_status "ERROR" "Cannot query sellers table"
        fi
        
        if listings_count=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM listings;" 2>/dev/null | tr -d ' '); then
            if [ "$listings_count" -gt 0 ]; then
                print_status "OK" "Listings table has $listings_count records"
            else
                print_status "WARNING" "Listings table is empty"
            fi
        else
            print_status "ERROR" "Cannot query listings table"
        fi
        
    else
        print_status "ERROR" "PostgreSQL connection failed"
        echo "   Make sure PostgreSQL is running: scripts/run-local-stack.sh"
    fi
else
    print_status "WARNING" "psql not found, skipping database tests"
fi

echo ""
echo "📊 Docker Container Status"
echo "========================="

# Check Docker containers
if command -v docker >/dev/null 2>&1; then
    if docker ps --filter "name=marketplace" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | grep -q "marketplace"; then
        echo "   Active marketplace containers:"
        docker ps --filter "name=marketplace" --format "   {{.Names}}: {{.Status}} ({{.Ports}})"
    else
        print_status "WARNING" "No marketplace containers running"
        echo "   Start services with: scripts/run-local-stack.sh"
    fi
else
    print_status "WARNING" "Docker not found, skipping container checks"
fi

echo ""
echo "🎯 Summary"
echo "=========="

# Count successful checks
total_checks=0
successful_checks=0

# API checks
if curl -s "http://localhost:${PORT:-3000}/health" > /dev/null 2>&1; then
    ((successful_checks++))
fi
((total_checks++))

# Redis checks
if command -v redis-cli >/dev/null 2>&1 && redis-cli -u "${REDIS_URL:-redis://localhost:6379}" ping > /dev/null 2>&1; then
    ((successful_checks++))
fi
((total_checks++))

# Database checks
if command -v psql >/dev/null 2>&1 && psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    ((successful_checks++))
fi
((total_checks++))

echo "   Health Score: $successful_checks/$total_checks services healthy"

if [ $successful_checks -eq $total_checks ]; then
    print_status "OK" "All core services are healthy! 🎉"
elif [ $successful_checks -ge $((total_checks * 2 / 3)) ]; then
    print_status "WARNING" "Most services are healthy, some issues detected"
else
    print_status "ERROR" "Multiple services are down, check configuration"
fi

echo ""
echo "💡 Quick fixes:"
echo "   • Start services: scripts/run-local-stack.sh"
echo "   • Seed data: scripts/seed-minimal.sh"
echo "   • Check logs: docker logs marketplace-postgres"
