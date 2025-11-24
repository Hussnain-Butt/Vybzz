#!/bin/bash
# =============================================================================
# VYBZZ - DIGITAL OCEAN SERVER SETUP SCRIPT
# =============================================================================
# یہ script Digital Ocean droplet کو production deployment کے لیے setup کرتا ہے
# This script sets up a Digital Ocean droplet for production deployment
#
# USAGE / استعمال:
#   Run this script on your fresh Digital Ocean droplet:
#   
#   wget -O setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/vybzz/main/scripts/server-setup.sh
#   chmod +x setup.sh
#   sudo bash setup.sh
#
# OR manually:
#   curl -sSL https://raw.githubusercontent.com/YOUR_USERNAME/vybzz/main/scripts/server-setup.sh | sudo bash
#
# REQUIREMENTS / ضروریات:
#   - Fresh Ubuntu 22.04 or 24.04 droplet
#   - Root or sudo access
#   - Internet connection
# =============================================================================

set -e  # Exit on any error / کسی بھی error پر stop ہو جائے

# Colors for output / رنگ output کے لیے
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

# Print with colors
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${PURPLE}▶️  $1${NC}"
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        print_error "This script must be run as root"
        print_error "یہ script root کے طور پر چلانا ضروری ہے"
        print_info "Please run: sudo bash $0"
        exit 1
    fi
}

# =============================================================================
# MAIN SETUP PROCESS
# =============================================================================

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           🚀 VYBZZ SERVER SETUP SCRIPT 🚀                    ║"
echo "║                                                               ║"
echo "║     یہ script آپ کے server کو production کے لیے تیار کرے گا ║"
echo "║     This script will prepare your server for production      ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check root access
check_root

print_info "Starting server setup..."
print_info "سرور سیٹ اپ شروع ہو رہا ہے..."
echo ""

# =============================================================================
# STEP 1: SYSTEM UPDATE
# =============================================================================
print_step "STEP 1: Updating system packages..."
print_step "مرحلہ 1: سسٹم پیکجز اپڈیٹ کر رہے ہیں..."

apt-get update -qq
apt-get upgrade -y -qq
print_success "System updated successfully"
print_success "سسٹم کامیابی سے اپڈیٹ ہو گیا"
echo ""

# =============================================================================
# STEP 2: INSTALL ESSENTIAL TOOLS
# =============================================================================
print_step "STEP 2: Installing essential tools..."
print_step "مرحلہ 2: ضروری ٹولز انسٹال کر رہے ہیں..."

apt-get install -y -qq \
    curl \
    wget \
    git \
    vim \
    htop \
    ufw \
    fail2ban \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

print_success "Essential tools installed"
print_success "ضروری ٹولز انسٹال ہو گئے"
echo ""

# =============================================================================
# STEP 3: INSTALL DOCKER
# =============================================================================
print_step "STEP 3: Installing Docker..."
print_step "مرحلہ 3: Docker انسٹال کر رہے ہیں..."

# Remove old Docker installations
apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Verify Docker installation
if docker --version &> /dev/null; then
    print_success "Docker installed successfully"
    print_success "Docker کامیابی سے انسٹال ہو گیا"
    docker --version
else
    print_error "Docker installation failed"
    print_error "Docker انسٹالیشن ناکام ہو گئی"
    exit 1
fi
echo ""

# =============================================================================
# STEP 4: INSTALL DOCKER COMPOSE (Standalone)
# =============================================================================
print_step "STEP 4: Installing Docker Compose standalone..."
print_step "مرحلہ 4: Docker Compose انسٹال کر رہے ہیں..."

# Download latest docker-compose
DOCKER_COMPOSE_VERSION="v2.24.5"
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create symlink
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify installation
if docker-compose --version &> /dev/null; then
    print_success "Docker Compose installed successfully"
    print_success "Docker Compose کامیابی سے انسٹال ہو گیا"
    docker-compose --version
else
    print_error "Docker Compose installation failed"
    print_error "Docker Compose انسٹالیشن ناکام ہو گئی"
    exit 1
fi
echo ""

# =============================================================================
# STEP 5: CONFIGURE FIREWALL (UFW)
# =============================================================================
print_step "STEP 5: Configuring firewall (UFW)..."
print_step "مرحلہ 5: فائر وال کنفیگر کر رہے ہیں..."

# Allow SSH (important!)
ufw allow 22/tcp comment 'SSH'
print_info "Allowed SSH (port 22)"

# Allow HTTP
ufw allow 80/tcp comment 'HTTP'
print_info "Allowed HTTP (port 80)"

# Allow HTTPS
ufw allow 443/tcp comment 'HTTPS'
print_info "Allowed HTTPS (port 443)"

# Enable UFW (with auto-confirmation)
ufw --force enable

print_success "Firewall configured and enabled"
print_success "فائر وال کنفیگر اور فعال ہو گیا"
ufw status
echo ""

# =============================================================================
# STEP 6: CREATE PROJECT DIRECTORY
# =============================================================================
print_step "STEP 6: Creating project directory..."
print_step "مرحلہ 6: پروجیکٹ ڈائریکٹری بنا رہے ہیں..."

PROJECT_DIR="/root/vybzz"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

print_success "Project directory created: $PROJECT_DIR"
print_success "پروجیکٹ ڈائریکٹری بن گئی: $PROJECT_DIR"
echo ""

# =============================================================================
# STEP 7: CLONE REPOSITORY (If Git is configured)
# =============================================================================
print_step "STEP 7: Git repository setup..."
print_step "مرحلہ 7: Git repository سیٹ اپ..."

print_warning "Note: You'll need to clone your repository manually later"
print_warning "نوٹ: آپ کو اپنی repository بعد میں manually clone کرنی ہوگی"
print_info "Commands to run:"
print_info "چلانے کی commands:"
echo ""
echo "  cd /root/vybzz"
echo "  git clone https://github.com/YOUR_USERNAME/vybzz.git ."
echo ""

# =============================================================================
# STEP 8: SETUP SSH KEY FOR GITHUB
# =============================================================================
print_step "STEP 8: Setting up SSH key for GitHub..."
print_step "مرحلہ 8: GitHub کے لیے SSH key بنا رہے ہیں..."

SSH_DIR="/root/.ssh"
mkdir -p $SSH_DIR
chmod 700 $SSH_DIR

# Generate SSH key if it doesn't exist
if [ ! -f "$SSH_DIR/id_ed25519" ]; then
    ssh-keygen -t ed25519 -C "github-deploy-vybzz" -f "$SSH_DIR/id_ed25519" -N ""
    print_success "SSH key generated"
    print_success "SSH key بن گئی"
    
    echo ""
    print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_warning "IMPORTANT: Add this SSH key to GitHub Secrets"
    print_warning "اہم: یہ SSH key GitHub Secrets میں add کریں"
    print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    print_info "Public key (add to server's authorized_keys):"
    print_info "Public key (server کی authorized_keys میں add کریں):"
    echo ""
    cat "$SSH_DIR/id_ed25519.pub"
    echo ""
    print_info "Private key (add to GitHub Secret: SSH_PRIVATE_KEY):"
    print_info "Private key (GitHub Secret میں add کریں: SSH_PRIVATE_KEY):"
    echo ""
    cat "$SSH_DIR/id_ed25519"
    echo ""
    print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Add public key to authorized_keys
    cat "$SSH_DIR/id_ed25519.pub" >> "$SSH_DIR/authorized_keys"
    chmod 600 "$SSH_DIR/authorized_keys"
    
else
    print_info "SSH key already exists"
    print_info "SSH key پہلے سے موجود ہے"
fi
echo ""

# =============================================================================
# STEP 9: CONFIGURE GIT
# =============================================================================
print_step "STEP 9: Configuring Git..."
print_step "مرحلہ 9: Git کنفیگر کر رہے ہیں..."

git config --global user.name "Vybzz Production"
git config --global user.email "deploy@vybzz.com"
git config --global init.defaultBranch main

print_success "Git configured"
print_success "Git کنفیگر ہو گیا"
echo ""

# =============================================================================
# STEP 10: SETUP DOCKER PERMISSIONS
# =============================================================================
print_step "STEP 10: Setting up Docker permissions..."
print_step "مرحلہ 10: Docker permissions سیٹ اپ کر رہے ہیں..."

# Add current user to docker group (if not root)
if [ "$USER" != "root" ]; then
    usermod -aG docker $USER
    print_success "User added to docker group"
    print_success "یوزر docker group میں add ہو گیا"
fi
echo ""

# =============================================================================
# STEP 11: INSTALL FAIL2BAN (Security)
# =============================================================================
print_step "STEP 11: Configuring Fail2ban..."
print_step "مرحلہ 11: Fail2ban کنفیگر کر رہے ہیں..."

systemctl start fail2ban
systemctl enable fail2ban

print_success "Fail2ban configured and started"
print_success "Fail2ban کنفیگر اور شروع ہو گیا"
echo ""

# =============================================================================
# STEP 12: SETUP AUTOMATIC SECURITY UPDATES
# =============================================================================
print_step "STEP 12: Setting up automatic security updates..."
print_step "مرحلہ 12: خودکار سیکیورٹی اپڈیٹس سیٹ اپ کر رہے ہیں..."

apt-get install -y -qq unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

print_success "Automatic security updates enabled"
print_success "خودکار سیکیورٹی اپڈیٹس فعال ہو گئیں"
echo ""

# =============================================================================
# STEP 13: CREATE SWAP FILE (if needed)
# =============================================================================
print_step "STEP 13: Checking swap space..."
print_step "مرحلہ 13: swap space چیک کر رہے ہیں..."

SWAP_SIZE=$(free -m | awk '/^Swap:/ {print $2}')
if [ "$SWAP_SIZE" -lt 1024 ]; then
    print_warning "Creating 2GB swap file..."
    print_warning "2GB swap file بنا رہے ہیں..."
    
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    
    print_success "Swap file created and enabled"
    print_success "Swap file بن گئی اور فعال ہو گئی"
else
    print_success "Swap space already configured"
    print_success "Swap space پہلے سے کنفیگر ہے"
fi
echo ""

# =============================================================================
# STEP 14: SYSTEM OPTIMIZATIONS
# =============================================================================
print_step "STEP 14: Applying system optimizations..."
print_step "مرحلہ 14: سسٹم optimizations لگا رہے ہیں..."

# Increase file limits
cat >> /etc/security/limits.conf << EOF
* soft nofile 65535
* hard nofile 65535
EOF

# Optimize sysctl for Docker
cat >> /etc/sysctl.conf << EOF

# Docker optimizations
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
vm.max_map_count=262144
EOF

sysctl -p > /dev/null 2>&1 || true

print_success "System optimizations applied"
print_success "سسٹم optimizations لگ گئیں"
echo ""

# =============================================================================
# SETUP COMPLETE!
# =============================================================================
echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║              ✅ SERVER SETUP COMPLETE! ✅                    ║"
echo "║                                                               ║"
echo "║           سرور سیٹ اپ مکمل ہو گیا! 🎉                        ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# =============================================================================
# NEXT STEPS
# =============================================================================
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "NEXT STEPS / اگلے قدم:"
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Add SSH keys to GitHub Secrets:"
echo "   • Go to GitHub Repository > Settings > Secrets > Actions"
echo "   • Add SERVER_IP: $(curl -s ifconfig.me)"
echo "   • Add SSH_PRIVATE_KEY: (shown above)"
echo ""
echo "2️⃣  Clone your repository:"
echo "   cd /root/vybzz"
echo "   git clone https://github.com/YOUR_USERNAME/vybzz.git ."
echo ""
echo "3️⃣  Create service .env files:"
echo "   • Copy from local .env files to server"
echo "   • OR use the setup script from Phase 1"
echo ""
echo "4️⃣  Create .env.production file:"
echo "   nano /root/vybzz/.env.production"
echo "   • Add production database password"
echo "   • Add domain configuration"
echo ""
echo "5️⃣  Push to GitHub to trigger deployment:"
echo "   git push origin main"
echo "   • GitHub Actions will automatically deploy!"
echo ""
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# SERVER INFO
# =============================================================================
print_success "Server Information:"
print_success "سرور کی معلومات:"
echo ""
echo "  🌐 Server IP: $(curl -s ifconfig.me)"
echo "  🐳 Docker Version: $(docker --version | cut -d ' ' -f3 | tr -d ',')"
echo "  🐙 Docker Compose: $(docker-compose --version | cut -d ' ' -f4 | tr -d ',')"
echo "  💾 Disk Space: $(df -h / | awk 'NR==2 {print $4}') free"
echo "  🧠 Memory: $(free -h | awk 'NR==2 {print $7}') available"
echo "  📂 Project Directory: /root/vybzz"
echo ""

# =============================================================================
# SAVE SETUP INFO
# =============================================================================
cat > /root/vybzz-setup-info.txt << EOF
VYBZZ SERVER SETUP COMPLETED
============================
Date: $(date)
Server IP: $(curl -s ifconfig.me)
Docker Version: $(docker --version)
Docker Compose: $(docker-compose --version)
Project Directory: /root/vybzz

NEXT STEPS:
1. Add SSH keys to GitHub Secrets
2. Clone repository
3. Create .env files
4. Create .env.production
5. Push to GitHub to deploy

For detailed instructions, see:
/root/vybzz/PHASE_3_SERVER_SETUP.md
EOF

print_success "Setup information saved to: /root/vybzz-setup-info.txt"
print_success "سیٹ اپ کی معلومات محفوظ ہو گئیں: /root/vybzz-setup-info.txt"
echo ""

print_success "🎉 Your server is ready for Vybzz deployment!"
print_success "🎉 آپ کا server Vybzz deployment کے لیے تیار ہے!"
echo ""

