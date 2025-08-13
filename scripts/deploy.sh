#!/bin/bash

# Simple Deployment Script for Market Aggregator
# This script handles basic deployment tasks

set -e

echo "🚀 Starting deployment of Market Aggregator..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="market-aggregator"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
DEPLOY_ENV=${1:-development}

echo -e "${YELLOW}Deploying to environment: ${DEPLOY_ENV}${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Update dependencies
echo "📦 Updating dependencies..."

# Backend dependencies
echo "  - Updating backend dependencies..."
cd $BACKEND_DIR
npm install
cd ..

# Frontend dependencies
echo "  - Updating frontend dependencies..."
cd $FRONTEND_DIR
npm install
cd ..

echo -e "${GREEN}✅ Dependencies updated${NC}"

# Build frontend
echo "🏗️  Building frontend..."
cd $FRONTEND_DIR
npm run build
cd ..

echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Database migration (if needed)
if [ "$DEPLOY_ENV" = "production" ]; then
    echo "🗄️  Running database migrations..."
    cd $BACKEND_DIR
    npm run db:migrate
    cd ..
    echo -e "${GREEN}✅ Database migrations completed${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"

# Display service information
echo ""
echo "📊 Service Information:"
echo "  - Backend: http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo "  - Health Check: http://localhost:3001/health"

echo ""
echo "🚀 To start the application:"
echo "  npm run dev"
