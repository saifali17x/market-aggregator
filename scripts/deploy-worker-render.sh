#!/bin/bash

# Worker deployment script for Render
# Deploys the marketplace aggregator worker service

set -e

echo "🚀 Deploying worker to Render..."

# Check if required tools are installed
if ! command -v render > /dev/null 2>&1; then
    echo "❌ Render CLI not found. Installing..."
    echo "   Visit: https://render.com/docs/install-cli"
    echo "   Or run: curl -sL https://render.com/download-cli.sh | bash"
    exit 1
fi

# Check if logged in to Render
if ! render whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to Render. Please login first:"
    echo "   render login"
    exit 1
fi

# Configuration
SERVICE_NAME="marketplace-aggregator-worker"
SERVICE_TYPE="worker"
REGION="oregon"  # Change to your preferred region
BRANCH="main"    # Change to your deployment branch

echo "📋 Configuration:"
echo "   Service Name: $SERVICE_NAME"
echo "   Service Type: $SERVICE_TYPE"
echo "   Region: $REGION"
echo "   Branch: $BRANCH"

# Check if service already exists
if render service list | grep -q "$SERVICE_NAME"; then
    echo "⚠️  Service '$SERVICE_NAME' already exists"
    read -p "   Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
    UPDATE_EXISTING=true
else
    UPDATE_EXISTING=false
fi

# Create render.yaml configuration
echo "📝 Creating render.yaml configuration..."
cat > render.yaml << EOF
services:
  - type: worker
    name: $SERVICE_NAME
    region: $REGION
    branch: $BRANCH
    buildCommand: |
      npm ci --only=production
      npm run build
    startCommand: npm run worker:start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: REDIS_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: SCRAPER_TIMEOUT
        value: "30000"
      - key: SCRAPER_RETRY_ATTEMPTS
        value: "3"
      - key: SCRAPER_DELAY_BETWEEN_REQUESTS
        value: "1000"
      - key: MATCH_THRESHOLD
        value: "0.82"
      - key: SIMILARITY_ALGORITHM
        value: "levenshtein"
      - key: WORKER_BATCH_SIZE
        value: "10"
      - key: WORKER_POLL_INTERVAL
        value: "5000"
      - key: LOG_LEVEL
        value: "info"
    healthCheckPath: /health
    autoDeploy: true
    plan: starter  # Change to your preferred plan
    scaling:
      minInstances: 1
      maxInstances: 3
    resources:
      cpu: 0.5
      memory: 512MB
    envGroups:
      - name: marketplace-prod-env
        sync: false
EOF

echo "✅ Created render.yaml"

# Create .dockerignore if it doesn't exist
if [ ! -f .dockerignore ]; then
    echo "📝 Creating .dockerignore..."
    cat > .dockerignore << EOF
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.*.local
.nyc_output
coverage
.DS_Store
*.log
logs
*.pid
*.seed
*.pid.lock
.npm
.eslintcache
.vscode
.idea
*.swp
*.swo
*~
EOF
    echo "✅ Created .dockerignore"
fi

# Create worker start script if it doesn't exist
if [ ! -f "scripts/worker-start.js" ]; then
    echo "📝 Creating worker start script..."
    mkdir -p scripts
    cat > scripts/worker-start.js << 'EOF'
#!/usr/bin/env node

/**
 * Worker service entry point for production deployment
 */

const { Worker } = require('worker_threads');
const path = require('path');

console.log('🚀 Starting marketplace aggregator worker...');

// Import and start the worker service
const workerService = require('../backend/services/worker/WorkerService');

async function startWorker() {
    try {
        await workerService.start();
        console.log('✅ Worker service started successfully');
        
        // Graceful shutdown handling
        process.on('SIGTERM', async () => {
            console.log('🛑 Received SIGTERM, shutting down gracefully...');
            await workerService.stop();
            process.exit(0);
        });
        
        process.on('SIGINT', async () => {
            console.log('🛑 Received SIGINT, shutting down gracefully...');
            await workerService.stop();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Failed to start worker service:', error);
        process.exit(1);
    }
}

startWorker();
EOF
    echo "✅ Created worker start script"
fi

# Update package.json scripts if needed
if [ -f "package.json" ]; then
    if ! grep -q "worker:start" package.json; then
        echo "📝 Adding worker:start script to package.json..."
        # This is a simplified approach - you may need to manually edit package.json
        echo "   Please add this script to your package.json:"
        echo "   \"worker:start\": \"node scripts/worker-start.js\""
    fi
fi

# Deploy to Render
echo "🚀 Deploying to Render..."
if [ "$UPDATE_EXISTING" = true ]; then
    echo "   Updating existing service..."
    render service update "$SERVICE_NAME" --config render.yaml
else
    echo "   Creating new service..."
    render service create --config render.yaml
fi

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📊 Next steps:"
echo "   1. Monitor deployment: render service logs $SERVICE_NAME"
echo "   2. Check service status: render service show $SERVICE_NAME"
echo "   3. View logs: render service logs $SERVICE_NAME --tail"
echo "   4. Set environment variables in Render dashboard:"
echo "      - DATABASE_URL (your production database)"
echo "      - REDIS_URL (your production Redis)"
echo "      - JWT_SECRET (your production secret)"
echo ""
echo "🔗 Render Dashboard: https://dashboard.render.com"
echo "💡 Service URL: https://dashboard.render.com/web/$SERVICE_NAME"

# Clean up
rm -f render.yaml

echo ""
echo "🎉 Deployment script completed!"
