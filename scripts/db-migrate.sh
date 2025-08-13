#!/bin/bash

# Simple Database Migration Script for Market Aggregator
# This script handles basic database setup and migrations

set -e

echo "🗄️  Starting database migration for Market Aggregator..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend"
DB_NAME=${DB_NAME:-"marketplace_dev"}
DB_USER=${DB_USER:-"postgres"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if PostgreSQL is running
check_postgres() {
    if pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to create database if it doesn't exist
create_database() {
    echo -e "${BLUE}📋 Checking if database exists...${NC}"
    
    if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        echo -e "${GREEN}✅ Database '$DB_NAME' already exists${NC}"
    else
        echo -e "${YELLOW}📝 Creating database '$DB_NAME'...${NC}"
        createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        echo -e "${GREEN}✅ Database '$DB_NAME' created successfully${NC}"
    fi
}

# Function to run migrations
run_migrations() {
    echo -e "${BLUE}🔄 Running database migrations...${NC}"
    
    cd $BACKEND_DIR
    
    # Check if sequelize-cli is available
    if ! command_exists npx; then
        echo -e "${RED}❌ npx is not available${NC}"
        exit 1
    fi
    
    # Run migrations
    echo "  - Running Sequelize migrations..."
    npx sequelize-cli db:migrate
    
    echo -e "${GREEN}✅ Migrations completed successfully${NC}"
    
    cd ..
}

# Main execution
main() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if PostgreSQL is installed
    if ! command_exists psql; then
        echo -e "${RED}❌ PostgreSQL client (psql) is not installed${NC}"
        echo "Please install PostgreSQL client tools first."
        exit 1
    fi
    
    # Check if PostgreSQL is running
    if ! check_postgres; then
        echo -e "${RED}❌ PostgreSQL is not running on $DB_HOST:$DB_PORT${NC}"
        echo "Please start PostgreSQL service first."
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
    
    # Create database
    create_database
    
    # Run migrations
    run_migrations
    
    echo ""
    echo -e "${GREEN}🎉 Database migration completed successfully!${NC}"
    echo ""
    echo "📊 Database Information:"
    echo "  - Name: $DB_NAME"
    echo "  - Host: $DB_HOST"
    echo "  - Port: $DB_PORT"
    echo "  - User: $DB_USER"
    echo ""
    echo "🚀 You can now start the application with:"
    echo "  npm run dev"
}

# Run main function
main
