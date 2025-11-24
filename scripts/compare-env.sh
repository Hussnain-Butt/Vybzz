#!/bin/bash
# =============================================================================
# VYBZZ - ENVIRONMENT COMPARISON TOOL
# =============================================================================
# یہ script دو environments کو compare کرتا ہے
# This script compares two environments
#
# USAGE / استعمال:
#   bash scripts/compare-env.sh
# =============================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_match() { echo -e "${GREEN}✅ $1${NC}"; }
print_diff() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_missing() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         🔄 ENVIRONMENT COMPARISON TOOL 🔄                    ║"
echo "║         ماحول کا موازنہ                                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

print_info "Comparing: Local ↔️ Production"
echo ""

# Compare each service
SERVICES=(
    "Backend/api-gateway"
    "Backend/services/auth-service"
    "Backend/services/user-service"
    "Backend/services/post-service"
    "Backend/services/live-streaming-service"
)

for service in "${SERVICES[@]}"; do
    service_name=$(basename $service)
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Checking: $service_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ ! -f "$service/.env" ]; then
        print_missing "$service_name: .env file not found"
    else
        print_match "$service_name: .env file exists"
        
        # Check for common variables
        if grep -q "NODE_ENV" "$service/.env"; then
            ENV_VALUE=$(grep "NODE_ENV" "$service/.env" | cut -d '=' -f2)
            if [ "$ENV_VALUE" = "production" ]; then
                print_info "$service_name: NODE_ENV=$ENV_VALUE (Production mode)"
            else
                print_info "$service_name: NODE_ENV=$ENV_VALUE (Development mode)"
            fi
        fi
    fi
    echo ""
done

print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "TIP: Use scripts/validate-env.sh for detailed validation"
print_info "تجویز: تفصیلی تصدیق کے لیے validate-env.sh استعمال کریں"
echo ""

