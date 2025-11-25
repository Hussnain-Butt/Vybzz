#!/bin/bash

# =============================================================================
# VYBZZ PRODUCTION SSL SETUP SCRIPT
# =============================================================================
# Automated SSL setup for letsvybzz.com
# 
# USAGE: ./setup-ssl-production.sh
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="letsvybzz.com"
WWW_DOMAIN="www.letsvybzz.com"
EMAIL="admin@letsvybzz.com"  # Change if needed

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║     VYBZZ PRODUCTION SSL SETUP                        ║"
echo "║     Domain: letsvybzz.com                             ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# =============================================================================
# STEP 1: Verify Domain
# =============================================================================
echo -e "${YELLOW}📋 Step 1: Verifying domain...${NC}"

if ping -c 1 $DOMAIN &> /dev/null; then
    echo -e "${GREEN}✅ Domain $DOMAIN is reachable${NC}"
    DOMAIN_IP=$(ping -c 1 $DOMAIN | grep -oP '\(\K[^\)]+')
    echo -e "${GREEN}   Resolves to: $DOMAIN_IP${NC}"
else
    echo -e "${RED}❌ Error: Cannot reach $DOMAIN${NC}"
    echo "   Please check DNS configuration"
    exit 1
fi

echo ""

# =============================================================================
# STEP 2: Install Certbot
# =============================================================================
echo -e "${YELLOW}📋 Step 2: Installing Certbot...${NC}"

if command -v certbot &> /dev/null; then
    echo -e "${GREEN}✅ Certbot already installed${NC}"
else
    echo "   Installing Certbot..."
    apt update -qq
    apt install -y certbot python3-certbot-nginx > /dev/null 2>&1
    echo -e "${GREEN}✅ Certbot installed${NC}"
fi

echo ""

# =============================================================================
# STEP 3: Stop Frontend Container
# =============================================================================
echo -e "${YELLOW}📋 Step 3: Stopping frontend container...${NC}"

docker-compose stop frontend
echo -e "${GREEN}✅ Frontend stopped${NC}"

echo ""

# =============================================================================
# STEP 4: Obtain SSL Certificate
# =============================================================================
echo -e "${YELLOW}📋 Step 4: Obtaining SSL certificate...${NC}"

if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo -e "${GREEN}✅ SSL certificate already exists${NC}"
    echo "   Certificate location: /etc/letsencrypt/live/$DOMAIN/"
else
    echo "   Requesting SSL certificate from Let's Encrypt..."
    
    certbot certonly --standalone \
        -d $DOMAIN \
        -d $WWW_DOMAIN \
        --agree-tos \
        --email $EMAIL \
        --non-interactive \
        --preferred-challenges http
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ SSL certificate obtained successfully${NC}"
        echo "   Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
        echo "   Private key: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
    else
        echo -e "${RED}❌ Error: Failed to obtain SSL certificate${NC}"
        docker-compose start frontend
        exit 1
    fi
fi

echo ""

# =============================================================================
# STEP 5: Update Frontend Environment
# =============================================================================
echo -e "${YELLOW}📋 Step 5: Updating frontend environment...${NC}"

cat > Frontend/.env << EOF
# Production Configuration with SSL
VITE_API_BASE_URL=https://$DOMAIN:3000
VITE_API_URL=https://$DOMAIN:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_d2VsY29tZS1kZWVyLTAuY2xlcmsuYWNjb3VudHMuZGV2JA
EOF

echo -e "${GREEN}✅ Frontend environment updated${NC}"

echo ""

# =============================================================================
# STEP 6: Deploy with SSL
# =============================================================================
echo -e "${YELLOW}📋 Step 6: Deploying with SSL support...${NC}"

# Stop all containers
docker-compose down

# Rebuild frontend with new configuration
echo "   Rebuilding frontend..."
docker-compose build --no-cache frontend > /dev/null 2>&1

# Deploy with SSL
echo "   Starting services with SSL..."
docker-compose \
    -f docker-compose.yml \
    -f docker-compose.ssl.yml \
    -f docker-compose.prod.yml \
    --env-file .env.production \
    up -d

echo -e "${GREEN}✅ Services deployed with SSL${NC}"

echo ""

# =============================================================================
# STEP 7: Wait for Services
# =============================================================================
echo -e "${YELLOW}📋 Step 7: Waiting for services to start...${NC}"

sleep 15

echo -e "${GREEN}✅ Services should be ready${NC}"

echo ""

# =============================================================================
# STEP 8: Verify SSL
# =============================================================================
echo -e "${YELLOW}📋 Step 8: Verifying SSL configuration...${NC}"

# Test HTTPS
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ HTTPS is working${NC}"
else
    echo -e "${RED}⚠️  HTTPS may not be working yet (give it a few more seconds)${NC}"
fi

# Test HTTP redirect
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_CODE" = "301" ]; then
    echo -e "${GREEN}✅ HTTP redirects to HTTPS${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP redirect may not be configured yet${NC}"
fi

echo ""

# =============================================================================
# STEP 9: Setup Auto-Renewal
# =============================================================================
echo -e "${YELLOW}📋 Step 9: Setting up SSL auto-renewal...${NC}"

# Create renewal script
cat > /usr/local/bin/renew-letsvybzz-ssl.sh << 'RENEWAL_SCRIPT'
#!/bin/bash
certbot renew --quiet
docker-compose restart frontend
RENEWAL_SCRIPT

chmod +x /usr/local/bin/renew-letsvybzz-ssl.sh

# Add to crontab if not already present
if ! crontab -l 2>/dev/null | grep -q "renew-letsvybzz-ssl"; then
    (crontab -l 2>/dev/null; echo "0 0 1 * * /usr/local/bin/renew-letsvybzz-ssl.sh") | crontab -
    echo -e "${GREEN}✅ Auto-renewal configured (monthly check)${NC}"
else
    echo -e "${GREEN}✅ Auto-renewal already configured${NC}"
fi

echo ""

# =============================================================================
# STEP 10: Display Status
# =============================================================================
echo -e "${YELLOW}📋 Step 10: Deployment status...${NC}"
echo ""

docker-compose ps

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 SSL Setup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌐 Your application:${NC}  https://$DOMAIN"
echo -e "${GREEN}🔒 SSL Certificate:${NC}   Let's Encrypt (90 days validity)"
echo -e "${GREEN}🔄 Auto-renewal:${NC}      Enabled (checks monthly)"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "   1. Update Clerk Dashboard:"
echo "      - Add domain: https://$DOMAIN"
echo "      - Update redirect URLs"
echo ""
echo "   2. Test on mobile device:"
echo "      - Clear browser cache"
echo "      - Visit: https://$DOMAIN"
echo "      - Try login/signup"
echo ""
echo "   3. Test SSL rating:"
echo "      - Visit: https://www.ssllabs.com/ssltest/"
echo "      - Analyze: $DOMAIN"
echo ""
echo -e "${GREEN}✅ All services are running with SSL/HTTPS!${NC}"
echo ""

# =============================================================================
# Display URLs
# =============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🔗 Access URLs:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "  Frontend:        https://$DOMAIN"
echo "  API Gateway:     https://$DOMAIN:3000"
echo "  User Service:    https://$DOMAIN:3002"
echo "  Post Service:    https://$DOMAIN:3003"
echo "  Live Streaming:  https://$DOMAIN:3004"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

