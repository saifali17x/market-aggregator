#!/bin/bash

# Vercel Deployment Script for Market Aggregator Backend
# This script automates the deployment process to Vercel

echo "🚀 Starting Vercel deployment for Market Aggregator Backend..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first..."
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project (if needed)
echo "🔨 Building project..."
npm run vercel-build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL=your_postgresql_connection_string"
echo "   - JWT_SECRET=your_jwt_secret"
echo ""
echo "2. Update frontend environment with the new backend URL"
echo "3. Test the deployed API endpoints"
echo ""
echo "🔗 Check your Vercel dashboard for the deployment URL"
