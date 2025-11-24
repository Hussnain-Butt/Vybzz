#!/bin/bash
# =============================================================================
# VYBZZ - ENVIRONMENT HEALTH CHECK
# =============================================================================
# یہ script environment کی health check کرتا ہے
# This script performs health checks on the environment
#
# USAGE / استعمال:
#   bash scripts/health-check-env.sh
# =============================================================================

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          🏥 ENVIRONMENT HEALTH CHECK 🏥                      ║"
echo "║          ماحول کی صحت کی جانچ                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

ISSUES=0

# =============================================================================
# CHECK 1: Environment Files Exist
# =============================================================================
print_info "Checking .env files..."
echo ""

SERVICES=(
    "Backend/api-gateway"
    "Backend/services/auth-service"
    "Backend/services/user-service"
    "Backend/services/post-service"
    "Backend/services/live-streaming-service"
)

for service in "${SERVICES[@]}"; do
    if [ -f "$service/.env" ]; then
        print_success "$(basename $service): .env exists"
    else
        print_error "$(basename $service): .env missing"
        ISSUES=$((ISSUES + 1))
    fi
done

echo ""

# =============================================================================
# CHECK 2: Docker Available
# =============================================================================
print_info "Checking Docker..."
echo ""

if command -v docker &> /dev/null; then
    print_success "Docker is installed"
    
    if docker info &> /dev/null; then
        print_success "Docker daemon is running"
    else
        print_error "Docker daemon is not running"
        ISSUES=$((ISSUES + 1))
    fi
else
    print_error "Docker is not installed"
    ISSUES=$((ISSUES + 1))
fi

echo ""

# =============================================================================
# CHECK 3: Docker Compose Available
# =============================================================================
print_info "Checking Docker Compose..."
echo ""

if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose is installed"
    docker-compose --version
else
    print_error "Docker Compose is not installed"
    ISSUES=$((ISSUES + 1))
fi

echo ""

# =============================================================================
# CHECK 4: Database Connection (if Docker is running)
# =============================================================================
if docker info &> /dev/null 2>&1; then
    print_info "Checking database container..."
    echo ""
    
    if docker ps | grep -q postgres; then
        print_success "PostgreSQL container is running"
        
        # Test connection
        if docker exec postgres pg_isready -U postgres > /dev/null 2>&1; then
            print_success "Database is accepting connections"
        else
            print_warning "Database container running but not ready"
        fi
    else
        print_warning "PostgreSQL container is not running (expected if not started)"
    fi
    echo ""
fi

# =============================================================================
# CHECK 5: Git Repository
# =============================================================================
print_info "Checking Git repository..."
echo ""

if [ -d ".git" ]; then
    print_success "Git repository initialized"
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        print_success "No uncommitted changes"
    else
        print_warning "You have uncommitted changes"
    fi
else
    print_warning "Not a Git repository"
fi

echo ""

# =============================================================================
# CHECK 6: Node Modules
# =============================================================================
print_info "Checking node_modules..."
echo ""

MODULE_MISSING=0
for service in "${SERVICES[@]}"; do
    if [ -d "$service/node_modules" ]; then
        print_success "$(basename $service): node_modules exists"
    else
        print_warning "$(basename $service): node_modules missing (will be installed in Docker)"
        MODULE_MISSING=$((MODULE_MISSING + 1))
    fi
done

if [ $MODULE_MISSING -gt 0 ]; then
    print_info "Node modules will be installed automatically in Docker containers"
fi

echo ""

# =============================================================================
# SUMMARY
# =============================================================================
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    HEALTH CHECK SUMMARY                       ║"
echo "║                    صحت کی جانچ کا خلاصہ                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

if [ $ISSUES -eq 0 ]; then
    print_success "All health checks passed! / تمام جانچیں کامیاب!"
    print_success "Your environment is healthy! / آپ کا ماحول صحت مند ہے!"
    echo ""
    exit 0
else
    print_error "Found $ISSUES issue(s) / $ISSUES مسائل ملے"
    print_warning "Please fix the issues before deploying"
    print_warning "براہ کرم deploy سے پہلے مسائل ٹھیک کریں"
    echo ""
    exit 1
fi

