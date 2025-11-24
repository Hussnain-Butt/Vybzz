#!/bin/bash
# =============================================================================
# VYBZZ - ROLLBACK SCRIPT
# =============================================================================
# یہ script deployment کو پچھلی working state پر rollback کرتا ہے
# This script rolls back deployment to the last working state
#
# USAGE / استعمال:
#   cd /root/vybzz
#   bash scripts/rollback.sh
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
PROJECT_DIR="/root/vybzz"
BACKUP_DIR="/root/vybzz-backups"

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_step() { echo -e "${PURPLE}▶️  $1${NC}"; }

echo -e "${YELLOW}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║              ⏪ VYBZZ ROLLBACK SCRIPT ⏪                     ║"
echo "║                                                               ║"
echo "║         پچھلی working state پر واپس جا رہے ہیں             ║"
echo "║         Rolling back to last working state                    ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    print_error "No backup directory found!"
    print_error "بیک اپ ڈائریکٹری نہیں ملی!"
    exit 1
fi

# Find last commit backup
LAST_COMMIT_FILE=$(ls -t $BACKUP_DIR/last-commit-*.txt 2>/dev/null | head -1)

if [ -z "$LAST_COMMIT_FILE" ]; then
    print_error "No backup found!"
    print_error "کوئی بیک اپ نہیں ملا!"
    exit 1
fi

LAST_COMMIT=$(cat $LAST_COMMIT_FILE)

print_info "Last successful commit: $LAST_COMMIT"
print_info "آخری کامیاب commit: $LAST_COMMIT"
echo ""

print_warning "⚠️  WARNING: This will rollback your deployment!"
print_warning "⚠️  انتباہ: یہ آپ کی deployment rollback کر دے گا!"
echo ""

read -p "Are you sure? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_info "Rollback cancelled"
    print_info "Rollback منسوخ"
    exit 0
fi

cd $PROJECT_DIR

print_step "STEP 1: Reverting Git commit..."
if [ "$LAST_COMMIT" != "no-git" ]; then
    git reset --hard $LAST_COMMIT
    print_success "Git reverted to: $LAST_COMMIT"
else
    print_warning "No Git history, skipping..."
fi
echo ""

print_step "STEP 2: Rebuilding containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
print_success "Containers rebuilt and started"
echo ""

print_step "STEP 3: Running health checks..."
sleep 10
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
echo ""

print_success "✅ Rollback completed!"
print_success "✅ Rollback مکمل!"
echo ""

