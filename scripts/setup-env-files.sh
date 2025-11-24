#!/bin/bash
# =============================================================================
# VYBZZ - Environment Variables Setup Script
# =============================================================================
# یہ script تمام services کے لیے .env files بناتا ہے
# This script creates .env files for all services
#
# USAGE / استعمال:
#   bash scripts/setup-env-files.sh
#   یا / or
#   chmod +x scripts/setup-env-files.sh && ./scripts/setup-env-files.sh
# =============================================================================

set -e  # Stop on any error

echo "🚀 Vybzz Environment Setup"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to create .env file
create_env_file() {
    local file_path=$1
    local content=$2
    
    if [ -f "$file_path" ]; then
        echo -e "${YELLOW}⚠️  $file_path already exists. Skipping...${NC}"
        return
    fi
    
    echo "$content" > "$file_path"
    echo -e "${GREEN}✅ Created: $file_path${NC}"
}

echo -e "${BLUE}📝 Creating .env files...${NC}"
echo ""

# =============================================================================
# API Gateway .env
# =============================================================================
echo "Creating API Gateway .env..."
create_env_file "Backend/api-gateway/.env" "# API Gateway Environment Variables
PORT=3000

# Microservice URLs
AUTH_URL=http://auth-service:3001
USER_URL=http://user-service:3002
POST_URL=http://post-service:3003
LIVESTREAM_URL=http://live-streaming-service:3004

# Clerk Keys - REPLACE WITH YOUR ACTUAL KEYS
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:80,http://localhost:3000

# Environment
NODE_ENV=development
DOCKER=true"

# =============================================================================
# Auth Service .env
# =============================================================================
echo "Creating Auth Service .env..."
create_env_file "Backend/services/auth-service/.env" "# Auth Service Environment Variables
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=auth

# Clerk Keys - REPLACE WITH YOUR ACTUAL KEYS
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_WEBHOOK_SIGNING_SECRET=whsec_YOUR_SECRET_HERE

# Environment
NODE_ENV=development"

# =============================================================================
# User Service .env
# =============================================================================
echo "Creating User Service .env..."
create_env_file "Backend/services/user-service/.env" "# User Service Environment Variables
PORT=3002

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=users

# Clerk Keys - REPLACE WITH YOUR ACTUAL KEYS
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_WEBHOOK_SIGNING_SECRET=whsec_YOUR_SECRET_HERE

# Cloudinary - REPLACE WITH YOUR ACTUAL CREDENTIALS
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Environment
NODE_ENV=development"

# =============================================================================
# Post Service .env
# =============================================================================
echo "Creating Post Service .env..."
create_env_file "Backend/services/post-service/.env" "# Post Service Environment Variables
PORT=3003

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=posts

# Cloudinary - REPLACE WITH YOUR ACTUAL CREDENTIALS
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mux - REPLACE WITH YOUR ACTUAL CREDENTIALS
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
MUX_WEBHOOK_SECRET=your_mux_webhook_secret

# Environment
NODE_ENV=development"

# =============================================================================
# Live Streaming Service .env
# =============================================================================
echo "Creating Live Streaming Service .env..."
create_env_file "Backend/services/live-streaming-service/.env" "# Live Streaming Service Environment Variables
PORT=3004

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=livestreams

# Mux - REPLACE WITH YOUR ACTUAL CREDENTIALS
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# Environment
NODE_ENV=development"

# =============================================================================
# Frontend .env (Optional)
# =============================================================================
echo "Creating Frontend .env..."
create_env_file "Frontend/.env" "# Frontend Environment Variables
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE"

echo ""
echo -e "${GREEN}✅ All .env files created!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT / اہم:${NC}"
echo ""
echo "1. ${RED}ہر .env file کو edit کریں اور placeholder values کو اپنی actual credentials سے replace کریں${NC}"
echo "   ${RED}Edit each .env file and replace placeholder values with your actual credentials${NC}"
echo ""
echo "2. Required Credentials:"
echo "   - Clerk Keys: https://clerk.com"
echo "   - Cloudinary: https://cloudinary.com"
echo "   - Mux: https://mux.com"
echo ""
echo "3. Refer to ENV_VARIABLES_GUIDE.md for detailed instructions"
echo "   تفصیلی ہدایات کے لیے ENV_VARIABLES_GUIDE.md دیکھیں"
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo "   1. Update all .env files with your actual credentials"
echo "   2. Run: docker-compose up"
echo "   3. Test your application"
echo ""

