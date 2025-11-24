#!/bin/bash
# =============================================================================
# VYBZZ - INTERACTIVE ENVIRONMENT SETUP
# =============================================================================
# یہ script interactive طریقے سے environment setup کرتا ہے
# This script interactively sets up the environment
#
# USAGE / استعمال:
#   bash scripts/setup-environment.sh
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_question() { echo -e "${CYAN}❓ $1${NC}"; }

clear
echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║       🎯 VYBZZ ENVIRONMENT SETUP WIZARD 🎯                   ║"
echo "║                                                               ║"
echo "║       ماحول کی تشکیل کا جادوگر                               ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

print_info "This wizard will help you set up environment variables"
print_info "یہ جادوگر ماحولیاتی متغیرات بنانے میں مدد کرے گا"
echo ""

# =============================================================================
# STEP 1: Choose Environment
# =============================================================================
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}STEP 1: Choose Environment / ماحول منتخب کریں${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
print_question "Which environment are you setting up?"
echo "  1) Local Development (آپ کا کمپیوٹر)"
echo "  2) Production (Digital Ocean Server)"
echo ""
read -p "Enter choice [1-2]: " ENV_CHOICE

case $ENV_CHOICE in
    1)
        ENV_TYPE="local"
        print_success "Setting up: Local Development"
        ;;
    2)
        ENV_TYPE="production"
        print_success "Setting up: Production"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""

# =============================================================================
# STEP 2: Database Configuration
# =============================================================================
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}STEP 2: Database Configuration / ڈیٹا بیس کی تشکیل${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$ENV_TYPE" = "local" ]; then
    print_info "Using default local database credentials"
    DB_USER="postgres"
    DB_PASSWORD="postgres"
    DB_NAME="vybzz"
else
    print_question "Database username (default: vybzz_user):"
    read -p "Username: " DB_USER
    DB_USER=${DB_USER:-vybzz_user}
    
    print_question "Generate strong password automatically? (y/n)"
    read -p "Auto-generate: " AUTO_PASS
    
    if [[ "$AUTO_PASS" =~ ^[Yy]$ ]]; then
        DB_PASSWORD=$(openssl rand -base64 32)
        print_success "Strong password generated!"
        print_warning "Save this password securely:"
        echo -e "${YELLOW}$DB_PASSWORD${NC}"
        echo ""
        read -p "Press Enter to continue..."
    else
        read -sp "Enter database password: " DB_PASSWORD
        echo ""
    fi
    
    print_question "Database name (default: vybzz):"
    read -p "Database: " DB_NAME
    DB_NAME=${DB_NAME:-vybzz}
fi

print_success "Database: $DB_USER@$DB_NAME"
echo ""

# =============================================================================
# STEP 3: External Services
# =============================================================================
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}STEP 3: External Services / بیرونی خدمات${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Clerk
print_info "Clerk (Authentication) - https://clerk.com"
read -p "Clerk Publishable Key (pk_test_...): " CLERK_PUB
read -p "Clerk Secret Key (sk_test_...): " CLERK_SECRET
read -p "Clerk Webhook Secret (whsec_...): " CLERK_WEBHOOK

# Cloudinary
echo ""
print_info "Cloudinary (File Storage) - https://cloudinary.com"
read -p "Cloud Name: " CLOUDINARY_NAME
read -p "API Key: " CLOUDINARY_KEY
read -p "API Secret: " CLOUDINARY_SECRET

# Mux
echo ""
print_info "Mux (Video Streaming) - https://mux.com"
read -p "Token ID: " MUX_ID
read -p "Token Secret: " MUX_SECRET

echo ""

# =============================================================================
# STEP 4: Domain & CORS (Production only)
# =============================================================================
if [ "$ENV_TYPE" = "production" ]; then
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}STEP 4: Domain Configuration / ڈومین کی تشکیل${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    print_question "Do you have a domain? (y/n)"
    read -p "Domain: " HAS_DOMAIN
    
    if [[ "$HAS_DOMAIN" =~ ^[Yy]$ ]]; then
        read -p "Enter domain (e.g., yourdomain.com): " DOMAIN
        CORS_ORIGINS="https://$DOMAIN,https://www.$DOMAIN"
    else
        print_info "You can add domain later"
        DOMAIN="your-droplet-ip"
        CORS_ORIGINS="http://your-droplet-ip"
    fi
    
    echo ""
fi

# =============================================================================
# STEP 5: Create .env Files
# =============================================================================
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}STEP 5: Creating .env Files / فائلیں بنا رہے ہیں${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# API Gateway
print_info "Creating: Backend/api-gateway/.env"
cat > Backend/api-gateway/.env << EOF
# API Gateway Environment
PORT=3000

# Microservice URLs
AUTH_URL=http://auth-service:3001
USER_URL=http://user-service:3002
POST_URL=http://post-service:3003
LIVESTREAM_URL=http://live-streaming-service:3004

# Clerk
CLERK_PUBLISHABLE_KEY=$CLERK_PUB
CLERK_SECRET_KEY=$CLERK_SECRET

# CORS
CORS_ORIGINS=${CORS_ORIGINS:-http://localhost:5173,http://localhost:80}

# Environment
NODE_ENV=${ENV_TYPE}
DOCKER=true
EOF
print_success "Created: Backend/api-gateway/.env"

# Auth Service
print_info "Creating: Backend/services/auth-service/.env"
cat > Backend/services/auth-service/.env << EOF
# Auth Service Environment
PORT=3001

# Database
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@postgres:5432/$DB_NAME?schema=auth

# Clerk
CLERK_SECRET_KEY=$CLERK_SECRET
CLERK_PUBLISHABLE_KEY=$CLERK_PUB
CLERK_WEBHOOK_SIGNING_SECRET=$CLERK_WEBHOOK

# Environment
NODE_ENV=${ENV_TYPE}
EOF
print_success "Created: Backend/services/auth-service/.env"

# User Service
print_info "Creating: Backend/services/user-service/.env"
cat > Backend/services/user-service/.env << EOF
# User Service Environment
PORT=3002

# Database
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@postgres:5432/$DB_NAME?schema=users

# Clerk
CLERK_SECRET_KEY=$CLERK_SECRET
CLERK_PUBLISHABLE_KEY=$CLERK_PUB
CLERK_WEBHOOK_SIGNING_SECRET=$CLERK_WEBHOOK

# Cloudinary
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_NAME
CLOUDINARY_API_KEY=$CLOUDINARY_KEY
CLOUDINARY_API_SECRET=$CLOUDINARY_SECRET

# Environment
NODE_ENV=${ENV_TYPE}
EOF
print_success "Created: Backend/services/user-service/.env"

# Post Service
print_info "Creating: Backend/services/post-service/.env"
cat > Backend/services/post-service/.env << EOF
# Post Service Environment
PORT=3003

# Database
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@postgres:5432/$DB_NAME?schema=posts

# Cloudinary
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_NAME
CLOUDINARY_API_KEY=$CLOUDINARY_KEY
CLOUDINARY_API_SECRET=$CLOUDINARY_SECRET

# Mux
MUX_TOKEN_ID=$MUX_ID
MUX_TOKEN_SECRET=$MUX_SECRET
MUX_WEBHOOK_SECRET=optional

# Environment
NODE_ENV=${ENV_TYPE}
EOF
print_success "Created: Backend/services/post-service/.env"

# Live Streaming Service
print_info "Creating: Backend/services/live-streaming-service/.env"
cat > Backend/services/live-streaming-service/.env << EOF
# Live Streaming Service Environment
PORT=3004

# Database
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@postgres:5432/$DB_NAME?schema=livestreams

# Mux
MUX_TOKEN_ID=$MUX_ID
MUX_TOKEN_SECRET=$MUX_SECRET

# Environment
NODE_ENV=${ENV_TYPE}
EOF
print_success "Created: Backend/services/live-streaming-service/.env"

# Production environment file
if [ "$ENV_TYPE" = "production" ]; then
    print_info "Creating: .env.production"
    cat > .env.production << EOF
# Production Environment
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DB=$DB_NAME

# Database URLs
USER_SERVICE_DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@postgres:5432/$DB_NAME?schema=users
POST_SERVICE_DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@postgres:5432/$DB_NAME?schema=posts
LIVESTREAM_SERVICE_DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@postgres:5432/$DB_NAME?schema=livestreams

# Domain
PRODUCTION_DOMAIN=${DOMAIN:-yourdomain.com}
CORS_ORIGINS=${CORS_ORIGINS:-https://yourdomain.com}
EOF
    chmod 600 .env.production
    print_success "Created: .env.production (chmod 600)"
fi

echo ""

# =============================================================================
# STEP 6: Validate
# =============================================================================
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}STEP 6: Validation / تصدیق${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

print_info "Validating environment..."
if bash scripts/validate-env.sh > /dev/null 2>&1; then
    print_success "All environment variables are valid!"
else
    print_warning "Some validation warnings (check manually if needed)"
fi

echo ""

# =============================================================================
# SUMMARY
# =============================================================================
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║              ✅ SETUP COMPLETE! ✅                           ║"
echo "║                                                               ║"
echo "║              تشکیل مکمل! 🎉                                  ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "FILES CREATED / بنائی گئی فائلیں:"
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅ Backend/api-gateway/.env"
echo "  ✅ Backend/services/auth-service/.env"
echo "  ✅ Backend/services/user-service/.env"
echo "  ✅ Backend/services/post-service/.env"
echo "  ✅ Backend/services/live-streaming-service/.env"
if [ "$ENV_TYPE" = "production" ]; then
    echo "  ✅ .env.production"
fi
echo ""

print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "NEXT STEPS / اگلے قدم:"
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$ENV_TYPE" = "local" ]; then
    echo "  1. Test locally:"
    echo "     docker-compose up"
    echo ""
    echo "  2. Commit and push:"
    echo "     git add ."
    echo "     git commit -m \"Add environment configuration\""
    echo "     git push origin main"
else
    echo "  1. Copy .env files to server (if not already there)"
    echo ""
    echo "  2. Deploy:"
    echo "     cd /root/vybzz"
    echo "     bash scripts/deploy.sh"
    echo ""
    echo "  3. Or push to GitHub for automatic deployment:"
    echo "     git push origin main"
fi

echo ""
print_success "🎉 Environment setup complete!"
print_success "🎉 ماحول کی تشکیل مکمل!"
echo ""

