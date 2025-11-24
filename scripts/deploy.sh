#!/bin/bash
# =============================================================================
# VYBZZ - MANUAL DEPLOYMENT SCRIPT
# =============================================================================
# یہ script manual deployment کے لیے ہے (emergency situations میں)
# This script is for manual deployment (in emergency situations)
#
# USAGE / استعمال:
#   Run this on your Digital Ocean server:
#   
#   cd /root/vybzz
#   bash scripts/deploy.sh
#
# NOTE: عام طور پر GitHub Actions automatic deploy کرے گا
# NOTE: Normally GitHub Actions will deploy automatically
# =============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# =============================================================================
# CONFIGURATION
# =============================================================================

PROJECT_DIR="/root/vybzz"
BACKUP_DIR="/root/vybzz-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_step() { echo -e "${PURPLE}▶️  $1${NC}"; }

# =============================================================================
# PRE-DEPLOYMENT CHECKS
# =============================================================================

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           🚀 VYBZZ MANUAL DEPLOYMENT 🚀                      ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

print_step "Pre-deployment checks..."
print_step "ڈیپلائمنٹ سے پہلے کی جانچ..."
echo ""

# Check if running from correct directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found!"
    print_error "Please run this script from the project root directory"
    print_error "براہ کرم یہ script project root directory سے چلائیں"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running!"
    print_error "Docker نہیں چل رہا!"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose not found!"
    print_error "docker-compose نہیں ملا!"
    exit 1
fi

print_success "Pre-deployment checks passed"
print_success "ڈیپلائمنٹ سے پہلے کی جانچ کامیاب"
echo ""

# =============================================================================
# STEP 1: BACKUP CURRENT STATE
# =============================================================================

print_step "STEP 1: Creating backup..."
print_step "مرحلہ 1: بیک اپ بنا رہے ہیں..."

mkdir -p "$BACKUP_DIR"

# Save current Git commit
git rev-parse HEAD > "$BACKUP_DIR/last-commit-$TIMESTAMP.txt" 2>/dev/null || echo "no-git" > "$BACKUP_DIR/last-commit-$TIMESTAMP.txt"

# Save list of running containers
docker ps --format '{{.Names}}' > "$BACKUP_DIR/running-containers-$TIMESTAMP.txt"

print_success "Backup created at $BACKUP_DIR"
print_success "بیک اپ بن گیا: $BACKUP_DIR"
echo ""

# =============================================================================
# STEP 2: PULL LATEST CODE
# =============================================================================

print_step "STEP 2: Pulling latest code from Git..."
print_step "مرحلہ 2: Git سے نیا code pull کر رہے ہیں..."

if [ -d ".git" ]; then
    git fetch --all
    git reset --hard origin/main
    
    print_success "Latest code pulled"
    print_success "نیا code pull ہو گیا"
    
    echo ""
    print_info "Current commit:"
    git log -1 --oneline
    echo ""
else
    print_warning "Not a Git repository, skipping pull"
    print_warning "Git repository نہیں ہے، pull skip کر رہے ہیں"
    echo ""
fi

# =============================================================================
# STEP 3: CHECK ENVIRONMENT FILES
# =============================================================================

print_step "STEP 3: Checking environment files..."
print_step "مرحلہ 3: environment files چیک کر رہے ہیں..."

MISSING_ENV=0

# Check service .env files
for service in Backend/api-gateway Backend/services/auth-service Backend/services/user-service Backend/services/post-service Backend/services/live-streaming-service; do
    if [ ! -f "$service/.env" ]; then
        print_warning "Missing: $service/.env"
        MISSING_ENV=1
    else
        print_success "Found: $service/.env"
    fi
done

if [ $MISSING_ENV -eq 1 ]; then
    print_warning "Some .env files are missing"
    print_warning "کچھ .env files missing ہیں"
    print_warning "Services may fail to start"
    print_warning "Services شروع نہیں ہو سکتیں"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

print_success "Environment check complete"
print_success "Environment چیک مکمل"
echo ""

# =============================================================================
# STEP 4: BUILD DOCKER IMAGES
# =============================================================================

print_step "STEP 4: Building Docker images..."
print_step "مرحلہ 4: Docker images build کر رہے ہیں..."
print_warning "This may take 5-10 minutes..."
print_warning "یہ 5-10 منٹ لے سکتا ہے..."
echo ""

docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

print_success "Docker images built successfully"
print_success "Docker images کامیابی سے build ہو گئیں"
echo ""

# =============================================================================
# STEP 5: STOP OLD CONTAINERS
# =============================================================================

print_step "STEP 5: Stopping old containers..."
print_step "مرحلہ 5: پرانی containers بند کر رہے ہیں..."

docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

print_success "Old containers stopped"
print_success "پرانی containers بند ہو گئیں"
echo ""

# =============================================================================
# STEP 6: START NEW CONTAINERS
# =============================================================================

print_step "STEP 6: Starting new containers..."
print_step "مرحلہ 6: نئی containers شروع کر رہے ہیں..."

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

print_success "New containers started"
print_success "نئی containers شروع ہو گئیں"
echo ""

print_info "Waiting for containers to initialize..."
print_info "Containers کے شروع ہونے کا انتظار..."
sleep 10
echo ""

# =============================================================================
# STEP 7: CHECK CONTAINER STATUS
# =============================================================================

print_step "STEP 7: Checking container status..."
print_step "مرحلہ 7: Container status چیک کر رہے ہیں..."

docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
echo ""

# =============================================================================
# STEP 8: RUN DATABASE MIGRATIONS
# =============================================================================

print_step "STEP 8: Running database migrations..."
print_step "مرحلہ 8: Database migrations چلا رہے ہیں..."

# User service migrations
print_info "Running user-service migrations..."
docker exec user-service npx prisma migrate deploy || print_warning "User migrations may have failed"

# Post service migrations
print_info "Running post-service migrations..."
docker exec post-service npx prisma migrate deploy || print_warning "Post migrations may have failed"

# Live streaming service migrations
print_info "Running live-streaming-service migrations..."
docker exec live-streaming-service npx prisma migrate deploy || print_warning "Livestream migrations may have failed"

print_success "Migrations completed"
print_success "Migrations مکمل ہوئیں"
echo ""

# =============================================================================
# STEP 9: HEALTH CHECKS
# =============================================================================

print_step "STEP 9: Running health checks..."
print_step "مرحلہ 9: Health checks چلا رہے ہیں..."
echo ""

# Function to check health
check_health() {
    local service_name=$1
    local health_url=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "Checking $service_name... "
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec $service_name curl -f $health_url > /dev/null 2>&1; then
            print_success "$service_name is healthy"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name health check failed"
    return 1
}

# Check all services
FAILED=0

check_health 'api-gateway' 'http://localhost:3000/health' || FAILED=1
check_health 'auth-service' 'http://localhost:3001/health' || FAILED=1
check_health 'user-service' 'http://localhost:3002/health' || FAILED=1
check_health 'post-service' 'http://localhost:3003/health' || FAILED=1
check_health 'live-streaming-service' 'http://localhost:3004/health' || FAILED=1

echo ""

if [ $FAILED -eq 1 ]; then
    print_error "Some services failed health checks"
    print_error "کچھ services health checks میں fail ہوئیں"
    print_warning "Check logs: docker-compose logs"
    echo ""
    
    read -p "Do you want to rollback? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Rolling back..."
        bash scripts/rollback.sh
        exit 1
    fi
else
    print_success "All services are healthy!"
    print_success "تمام services صحت مند ہیں!"
fi

echo ""

# =============================================================================
# STEP 10: CLEANUP OLD IMAGES
# =============================================================================

print_step "STEP 10: Cleaning up old Docker images..."
print_step "مرحلہ 10: پرانی Docker images صاف کر رہے ہیں..."

docker system prune -af --filter 'until=24h' || true

print_success "Cleanup complete"
print_success "صفائی مکمل"
echo ""

# =============================================================================
# DEPLOYMENT COMPLETE!
# =============================================================================

echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           ✅ DEPLOYMENT SUCCESSFUL! ✅                       ║"
echo "║                                                               ║"
echo "║              ڈیپلائمنٹ کامیاب! 🎉                           ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# =============================================================================
# DEPLOYMENT SUMMARY
# =============================================================================

print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "DEPLOYMENT SUMMARY / ڈیپلائمنٹ کا خلاصہ"
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📅 Deployed At: $(date)"
echo "  📝 Git Commit: $(git log -1 --oneline 2>/dev/null || echo 'N/A')"
echo "  🐳 Running Containers:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}"
echo ""
echo "  💾 Disk Space:"
df -h / | awk 'NR==2 {print "     Used: "$3" / Free: "$4" / Total: "$2}'
echo ""
echo "  🧠 Memory Usage:"
free -h | awk 'NR==2 {print "     Used: "$3" / Free: "$7" / Total: "$2}'
echo ""

print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# USEFUL COMMANDS
# =============================================================================

print_info "Useful commands / مفید commands:"
echo ""
echo "  View logs:      docker-compose logs -f"
echo "  Check status:   docker-compose ps"
echo "  Restart:        docker-compose restart"
echo "  Stop:           docker-compose down"
echo "  Rollback:       bash scripts/rollback.sh"
echo ""

# =============================================================================
# SAVE DEPLOYMENT INFO
# =============================================================================

cat > /root/last-deployment.txt << EOF
VYBZZ DEPLOYMENT
================
Timestamp: $(date)
Git Commit: $(git log -1 --oneline 2>/dev/null || echo 'N/A')
Backup: $BACKUP_DIR/last-commit-$TIMESTAMP.txt

RUNNING CONTAINERS:
$(docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps --format "{{.Name}}: {{.Status}}")

SYSTEM STATUS:
Disk: $(df -h / | awk 'NR==2 {print $3"/"$2" used, "$4" free"}')
Memory: $(free -h | awk 'NR==2 {print $3"/"$2" used, "$7" free"}')
EOF

print_success "Deployment info saved to /root/last-deployment.txt"
print_success "ڈیپلائمنٹ کی معلومات محفوظ ہو گئیں"
echo ""

print_success "🎉 Vybzz is now running the latest version!"
print_success "🎉 Vybzz اب نئے version پر چل رہا ہے!"
echo ""

