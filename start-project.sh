#!/bin/bash

echo "🚀 Starting LuxLink Portfolio Project..."
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📦 Starting infrastructure services..."
docker-compose up -d postgres redis

echo "⏳ Waiting for services to be ready..."
sleep 5

echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "📚 Installing dependencies..."
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo ""
echo "✅ Setup complete! Now run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "🌐 Access your project at:"
echo "  Frontend: http://localhost:3001"
echo "  Backend: http://localhost:3000"
echo ""
echo "📊 Database: PostgreSQL on port 5432"
echo "🔄 Cache: Redis on port 6379"
