#!/bin/bash
# =============================================================================
# VYBZZ - ENVIRONMENT VALIDATION SCRIPT
# =============================================================================
# یہ script تمام environment variables کو validate کرتا ہے
# This script validates all environment variables
#
# USAGE / استعمال:
#   bash scripts/validate-env.sh [environment]
#   
#   Examples:
#   bash scripts/validate-env.sh local
#   bash scripts/validate-env.sh production
#   bash scripts/validate-env.sh  (validates current directory)
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           🔍 VYBZZ ENVIRONMENT VALIDATION 🔍                 ║"
echo "║           ماحولیاتی متغیرات کی تصدیق                        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Determine environment
ENV_TYPE=${1:-"current"}
ERRORS=0
WARNINGS=0

print_info "Validating environment: $ENV_TYPE"
echo ""

# =============================================================================
# FUNCTION: Check if variable is set
# =============================================================================
check_var() {
    local var_name=$1
    local service=$2
    local required=${3:-true}
    
    if [ -z "${!var_name}" ]; then
        if [ "$required" = "true" ]; then
            print_error "$service: $var_name is missing"
            ERRORS=$((ERRORS + 1))
        else
            print_warning "$service: $var_name is not set (optional)"
            WARNINGS=$((WARNINGS + 1))
        fi
        return 1
    else
        print_success "$service: $var_name is set"
        return 0
    fi
}

# =============================================================================
# FUNCTION: Validate service .env file
# =============================================================================
validate_service_env() {
    local service_path=$1
    local service_name=$2
    
    echo ""
    print_info "Checking $service_name..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ ! -f "$service_path/.env" ]; then
        print_error "$service_name: .env file not found at $service_path"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
    
    # Load environment variables from file
    set -a
    source "$service_path/.env" 2>/dev/null || true
    set +a
    
    return 0
}

# =============================================================================
# VALIDATE API GATEWAY
# =============================================================================
if validate_service_env "Backend/api-gateway" "API Gateway"; then
    check_var "PORT" "API Gateway"
    check_var "AUTH_URL" "API Gateway"
    check_var "USER_URL" "API Gateway"
    check_var "POST_URL" "API Gateway"
    check_var "CLERK_PUBLISHABLE_KEY" "API Gateway"
    check_var "CLERK_SECRET_KEY" "API Gateway"
    check_var "CORS_ORIGINS" "API Gateway"
    check_var "NODE_ENV" "API Gateway"
fi

# Clear variables
unset PORT AUTH_URL USER_URL POST_URL CLERK_PUBLISHABLE_KEY CLERK_SECRET_KEY CORS_ORIGINS NODE_ENV

# =============================================================================
# VALIDATE AUTH SERVICE
# =============================================================================
if validate_service_env "Backend/services/auth-service" "Auth Service"; then
    check_var "PORT" "Auth Service"
    check_var "DATABASE_URL" "Auth Service"
    check_var "CLERK_SECRET_KEY" "Auth Service"
    check_var "CLERK_PUBLISHABLE_KEY" "Auth Service"
    check_var "CLERK_WEBHOOK_SIGNING_SECRET" "Auth Service"
    check_var "NODE_ENV" "Auth Service"
fi

# Clear variables
unset PORT DATABASE_URL CLERK_SECRET_KEY CLERK_PUBLISHABLE_KEY CLERK_WEBHOOK_SIGNING_SECRET NODE_ENV

# =============================================================================
# VALIDATE USER SERVICE
# =============================================================================
if validate_service_env "Backend/services/user-service" "User Service"; then
    check_var "PORT" "User Service"
    check_var "DATABASE_URL" "User Service"
    check_var "CLERK_SECRET_KEY" "User Service"
    check_var "CLERK_PUBLISHABLE_KEY" "User Service"
    check_var "CLERK_WEBHOOK_SIGNING_SECRET" "User Service"
    check_var "CLOUDINARY_CLOUD_NAME" "User Service"
    check_var "CLOUDINARY_API_KEY" "User Service"
    check_var "CLOUDINARY_API_SECRET" "User Service"
    check_var "NODE_ENV" "User Service"
    
    # Validate DATABASE_URL format
    if [[ "$DATABASE_URL" == *"?schema=users"* ]]; then
        print_success "User Service: DATABASE_URL schema is correct (users)"
    else
        print_error "User Service: DATABASE_URL must include ?schema=users"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Clear variables
unset PORT DATABASE_URL CLERK_SECRET_KEY CLERK_PUBLISHABLE_KEY CLERK_WEBHOOK_SIGNING_SECRET
unset CLOUDINARY_CLOUD_NAME CLOUDINARY_API_KEY CLOUDINARY_API_SECRET NODE_ENV

# =============================================================================
# VALIDATE POST SERVICE
# =============================================================================
if validate_service_env "Backend/services/post-service" "Post Service"; then
    check_var "PORT" "Post Service"
    check_var "DATABASE_URL" "Post Service"
    check_var "CLOUDINARY_CLOUD_NAME" "Post Service"
    check_var "CLOUDINARY_API_KEY" "Post Service"
    check_var "CLOUDINARY_API_SECRET" "Post Service"
    check_var "MUX_TOKEN_ID" "Post Service"
    check_var "MUX_TOKEN_SECRET" "Post Service"
    check_var "MUX_WEBHOOK_SECRET" "Post Service" "false"
    check_var "NODE_ENV" "Post Service"
    
    # Validate DATABASE_URL format
    if [[ "$DATABASE_URL" == *"?schema=posts"* ]]; then
        print_success "Post Service: DATABASE_URL schema is correct (posts)"
    else
        print_error "Post Service: DATABASE_URL must include ?schema=posts"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Clear variables
unset PORT DATABASE_URL CLOUDINARY_CLOUD_NAME CLOUDINARY_API_KEY CLOUDINARY_API_SECRET
unset MUX_TOKEN_ID MUX_TOKEN_SECRET MUX_WEBHOOK_SECRET NODE_ENV

# =============================================================================
# VALIDATE LIVE STREAMING SERVICE
# =============================================================================
if validate_service_env "Backend/services/live-streaming-service" "Live Streaming Service"; then
    check_var "PORT" "Live Streaming"
    check_var "DATABASE_URL" "Live Streaming"
    check_var "MUX_TOKEN_ID" "Live Streaming"
    check_var "MUX_TOKEN_SECRET" "Live Streaming"
    check_var "NODE_ENV" "Live Streaming"
    
    # Validate DATABASE_URL format
    if [[ "$DATABASE_URL" == *"?schema=livestreams"* ]]; then
        print_success "Live Streaming: DATABASE_URL schema is correct (livestreams)"
    else
        print_error "Live Streaming: DATABASE_URL must include ?schema=livestreams"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Clear variables
unset PORT DATABASE_URL MUX_TOKEN_ID MUX_TOKEN_SECRET NODE_ENV

# =============================================================================
# VALIDATE PRODUCTION ENVIRONMENT FILE (if exists)
# =============================================================================
if [ "$ENV_TYPE" = "production" ] || [ -f ".env.production" ]; then
    echo ""
    print_info "Checking Production Environment File..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f ".env.production" ]; then
        set -a
        source ".env.production" 2>/dev/null || true
        set +a
        
        check_var "POSTGRES_USER" "Production"
        check_var "POSTGRES_PASSWORD" "Production"
        check_var "POSTGRES_DB" "Production"
        
        # Check password strength
        if [ ${#POSTGRES_PASSWORD} -lt 16 ]; then
            print_warning "Production: Database password is weak (less than 16 characters)"
            WARNINGS=$((WARNINGS + 1))
        else
            print_success "Production: Database password is strong"
        fi
        
        check_var "PRODUCTION_DOMAIN" "Production" "false"
        check_var "CORS_ORIGINS" "Production" "false"
    else
        if [ "$ENV_TYPE" = "production" ]; then
            print_warning ".env.production file not found"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
fi

# =============================================================================
# SUMMARY
# =============================================================================
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    VALIDATION SUMMARY                         ║"
echo "║                    تصدیق کا خلاصہ                             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    print_success "All environment variables are valid! / تمام متغیرات درست ہیں!"
    print_success "Ready for deployment! / ڈیپلائمنٹ کے لیے تیار!"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    print_warning "Validation passed with $WARNINGS warning(s)"
    print_warning "$WARNINGS انتباہات کے ساتھ تصدیق کامیاب"
    print_info "You can proceed, but review warnings / آگے بڑھ سکتے ہیں، لیکن انتباہات دیکھیں"
    echo ""
    exit 0
else
    print_error "Validation failed with $ERRORS error(s) and $WARNINGS warning(s)"
    print_error "$ERRORS غلطیوں اور $WARNINGS انتباہات کے ساتھ تصدیق ناکام"
    print_error "Please fix errors before deployment / براہ کرم غلطیاں ٹھیک کریں"
    echo ""
    echo "Common fixes / عام حل:"
    echo "  1. Run: bash scripts/setup-environment.sh"
    echo "  2. Check .env files in each service directory"
    echo "  3. Refer to: ENV_VARIABLES_GUIDE.md"
    echo ""
    exit 1
fi

