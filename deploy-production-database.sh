#!/bin/bash

# =============================================================================
# VYBZZ Production Database Deployment Script
# =============================================================================
# یہ script production database setup کے لیے ہے
# This script is for production database setup
#
# USAGE: ./deploy-production-database.sh
# =============================================================================

set -e  # Exit on error

echo "🚀 VYBZZ Production Database Deployment"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =============================================================================
# STEP 1: Check if running on server
# =============================================================================
echo -e "${YELLOW}📋 Step 1: Environment Check${NC}"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production file not found!${NC}"
    echo "Please create .env.production file first."
    echo "Refer to production-env-setup.txt for required variables."
    exit 1
fi

echo -e "${GREEN}✅ .env.production file found${NC}"
echo ""

# =============================================================================
# STEP 2: Secure .env.production permissions
# =============================================================================
echo -e "${YELLOW}📋 Step 2: Securing Environment File${NC}"

chmod 600 .env.production
echo -e "${GREEN}✅ .env.production permissions set to 600${NC}"
echo ""

# =============================================================================
# STEP 3: Stop existing containers
# =============================================================================
echo -e "${YELLOW}📋 Step 3: Stopping Existing Containers${NC}"

if docker-compose ps | grep -q "Up"; then
    echo "Stopping running containers..."
    docker-compose down
    echo -e "${GREEN}✅ Containers stopped${NC}"
else
    echo "No running containers found."
fi
echo ""

# =============================================================================
# STEP 4: Remove old postgres container & volume (optional)
# =============================================================================
echo -e "${YELLOW}📋 Step 4: Cleaning Old Database Containers${NC}"

# Check if user wants to remove old postgres
read -p "Do you want to remove old postgres container & volume? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing old postgres container..."
    docker rm -f pg 2>/dev/null || true
    
    echo "Do you want to remove postgres volume too?"
    echo "⚠️  WARNING: This will delete local postgres data!"
    read -p "Remove volume? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker volume rm vybzz-stack_pg_data 2>/dev/null || true
        echo -e "${GREEN}✅ Old postgres volume removed${NC}"
    fi
else
    echo "Skipping postgres cleanup."
fi
echo ""

# =============================================================================
# STEP 5: Run Prisma Migrations
# =============================================================================
echo -e "${YELLOW}📋 Step 5: Running Database Migrations${NC}"

# Load database URLs from .env.production
source .env.production

echo "Running User Service migrations..."
docker run --rm \
  -e DATABASE_URL="$USER_SERVICE_DATABASE_URL" \
  -v "$(pwd)/Backend/services/user-service:/app" \
  -w /app \
  node:18-alpine \
  sh -c "npm install --production && npx prisma generate && npx prisma db push" || {
    echo -e "${YELLOW}⚠️  User service migration failed, will retry during container startup${NC}"
}

echo "Running Post Service migrations..."
docker run --rm \
  -e DATABASE_URL="$POST_SERVICE_DATABASE_URL" \
  -v "$(pwd)/Backend/services/post-service:/app" \
  -w /app \
  node:18-alpine \
  sh -c "npm install --production && npx prisma generate && npx prisma db push" || {
    echo -e "${YELLOW}⚠️  Post service migration failed, will retry during container startup${NC}"
}

echo "Running Live Streaming Service migrations..."
docker run --rm \
  -e DATABASE_URL="$LIVESTREAM_SERVICE_DATABASE_URL" \
  -v "$(pwd)/Backend/services/live-streaming-service:/app" \
  -w /app \
  node:18-alpine \
  sh -c "npm install --production && npx prisma generate && npx prisma db push" || {
    echo -e "${YELLOW}⚠️  Live streaming service migration failed, will retry during container startup${NC}"
}

echo -e "${GREEN}✅ Database migrations completed${NC}"
echo ""

# =============================================================================
# STEP 6: Build and Deploy with Production Config
# =============================================================================
echo -e "${YELLOW}📋 Step 6: Building & Deploying Services${NC}"

echo "Starting production deployment..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d --build

echo -e "${GREEN}✅ Services deployed${NC}"
echo ""

# =============================================================================
# STEP 7: Wait for services to be healthy
# =============================================================================
echo -e "${YELLOW}📋 Step 7: Waiting for Services to be Healthy${NC}"

echo "Waiting 30 seconds for services to start..."
sleep 30

# =============================================================================
# STEP 8: Verify deployment
# =============================================================================
echo -e "${YELLOW}📋 Step 8: Verifying Deployment${NC}"
echo ""

# Check container status
echo "Container Status:"
docker-compose ps
echo ""

# Test health endpoints
echo "Testing Health Endpoints..."

# User Service
if curl -s -f http://localhost:3002/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ User Service: Healthy${NC}"
else
    echo -e "${RED}❌ User Service: Not responding${NC}"
fi

# Post Service
if curl -s -f http://localhost:3003/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Post Service: Healthy${NC}"
else
    echo -e "${RED}❌ Post Service: Not responding${NC}"
fi

# Live Streaming Service
if curl -s -f http://localhost:3004/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Live Streaming Service: Healthy${NC}"
else
    echo -e "${RED}❌ Live Streaming Service: Not responding${NC}"
fi

# API Gateway
if curl -s -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway: Healthy${NC}"
else
    echo -e "${RED}❌ API Gateway: Not responding${NC}"
fi

echo ""

# =============================================================================
# STEP 9: Show logs
# =============================================================================
echo -e "${YELLOW}📋 Step 9: Showing Recent Logs${NC}"
echo ""

docker-compose logs --tail=20

echo ""
echo "========================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Monitor logs: docker-compose logs -f"
echo "2. Check status: docker-compose ps"
echo "3. Test frontend: http://167.99.49.147"
echo ""
echo "If you see any errors in logs, run:"
echo "docker-compose logs -f <service-name>"
echo ""

# =============================================================================
# Optional: Show environment info
# =============================================================================
read -p "Do you want to see environment info? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Environment Variables (partial):"
    echo "NODE_ENV: $NODE_ENV"
    echo "Database Host: $POSTGRES_HOST"
    echo "Database Port: $POSTGRES_PORT"
    echo "Database Name: $POSTGRES_DB"
    echo ""
fi

echo "Deployment script finished!"

