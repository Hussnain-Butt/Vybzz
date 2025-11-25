# 🚀 SSL Quick Commands Reference - letsvybzz.com

**Quick copy-paste commands for common SSL operations**

---

## 🔐 **Complete SSL Setup (One Command)**

```bash
chmod +x setup-ssl-production.sh && ./setup-ssl-production.sh
```

---

## 📦 **Manual SSL Setup**

### **1. Install Certbot:**
```bash
apt update && apt install certbot -y
```

### **2. Get SSL Certificate:**
```bash
docker-compose stop frontend && \
certbot certonly --standalone \
  -d letsvybzz.com \
  -d www.letsvybzz.com \
  --agree-tos \
  --register-unsafely-without-email \
  --non-interactive
```

### **3. Deploy with SSL:**
```bash
docker-compose down && \
docker-compose build --no-cache frontend && \
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.ssl.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d
```

---

## 🧪 **Testing Commands**

### **Test HTTPS:**
```bash
curl -I https://letsvybzz.com
```

### **Test HTTP Redirect:**
```bash
curl -I http://letsvybzz.com
```

### **Test SSL Certificate:**
```bash
openssl s_client -connect letsvybzz.com:443 -servername letsvybzz.com | grep -A 2 "subject="
```

### **Test All Services:**
```bash
curl -s https://letsvybzz.com:3000/health && echo " ✅ API Gateway" && \
curl -s https://letsvybzz.com:3002/health && echo " ✅ User Service" && \
curl -s https://letsvybzz.com:3003/health && echo " ✅ Post Service"
```

---

## 🔄 **Certificate Management**

### **Check Certificate Expiry:**
```bash
certbot certificates
```

### **Renew Certificate (Manual):**
```bash
docker-compose stop frontend && \
certbot renew && \
docker-compose start frontend
```

### **Test Renewal (Dry Run):**
```bash
certbot renew --dry-run
```

### **Setup Auto-Renewal:**
```bash
# Add to crontab
sudo crontab -e

# Add this line:
0 0 1 * * certbot renew --quiet --post-hook "docker-compose restart frontend"
```

---

## 🔧 **Troubleshooting Commands**

### **Check Nginx Config:**
```bash
docker exec frontend nginx -t
```

### **View Frontend Logs:**
```bash
docker-compose logs frontend --tail=50
```

### **Restart Frontend:**
```bash
docker-compose restart frontend
```

### **Rebuild Frontend:**
```bash
docker-compose stop frontend && \
docker-compose build --no-cache frontend && \
docker-compose up -d frontend
```

### **Check Certificate Files:**
```bash
ls -la /etc/letsencrypt/live/letsvybzz.com/
```

---

## 🔄 **Deployment Commands**

### **Update Code & Redeploy:**
```bash
git pull origin main && \
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.ssl.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d --build
```

### **Full Redeploy:**
```bash
docker-compose down && \
docker-compose build --no-cache && \
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.ssl.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d
```

### **Restart All Services:**
```bash
docker-compose restart
```

### **View All Container Status:**
```bash
docker-compose ps
```

---

## 📊 **Monitoring Commands**

### **View Real-time Logs:**
```bash
docker-compose logs -f
```

### **View Specific Service Logs:**
```bash
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f user-service
```

### **Check Container Resource Usage:**
```bash
docker stats
```

### **Check Disk Space:**
```bash
df -h
```

---

## 🗄️ **Database Commands**

### **Test Database Connection:**
```bash
curl -s https://letsvybzz.com:3002/health
curl -s https://letsvybzz.com:3003/health
```

### **View Database Logs:**
```bash
docker-compose logs user-service | grep -i "prisma\|database"
```

---

## 🔒 **Security Audit Commands**

### **Test SSL Rating:**
```bash
# Online test (manual)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=letsvybzz.com
```

### **Check SSL Protocols:**
```bash
nmap --script ssl-enum-ciphers -p 443 letsvybzz.com
```

### **Verify HSTS Header:**
```bash
curl -I https://letsvybzz.com | grep -i strict
```

---

## 🚀 **Quick Actions**

### **Emergency Stop:**
```bash
docker-compose down
```

### **Emergency Start:**
```bash
docker-compose up -d
```

### **View Error Logs:**
```bash
docker-compose logs | grep -i "error\|fail\|exception" | tail -50
```

### **Clear Everything & Fresh Start:**
```bash
docker-compose down && \
docker system prune -af && \
docker-compose build --no-cache && \
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.ssl.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d
```

---

## 📝 **Environment Files**

### **Update Frontend Environment:**
```bash
cat > Frontend/.env << 'EOF'
VITE_API_BASE_URL=https://letsvybzz.com:3000
VITE_API_URL=https://letsvybzz.com:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_d2VsY29tZS1kZWVyLTAuY2xlcmsuYWNjb3VudHMuZGV2JA
EOF
```

### **Check Current Environment:**
```bash
cat Frontend/.env
cat .env.production | head -20
```

---

## 🎯 **Health Check Command (All-in-One)**

```bash
echo "=== System Health Check ===" && \
echo "" && \
echo "📊 Container Status:" && \
docker-compose ps && \
echo "" && \
echo "🌐 HTTPS Test:" && \
curl -sI https://letsvybzz.com | head -1 && \
echo "" && \
echo "🔌 Services Health:" && \
curl -s https://letsvybzz.com:3002/health && echo " ✅ User" && \
curl -s https://letsvybzz.com:3003/health && echo " ✅ Post" && \
curl -s https://letsvybzz.com:3000/health && echo " ✅ Gateway" && \
echo "" && \
echo "🔒 Certificate Status:" && \
certbot certificates | grep -A 3 "letsvybzz.com"
```

---

## 🆘 **Emergency Contacts**

```bash
# View this guide
cat SSL_QUICK_COMMANDS.md

# View full deployment guide
cat PRODUCTION_SSL_DEPLOYMENT.md

# View complete database guide
cat PRODUCTION_DATABASE_SETUP_GUIDE.md
```

---

**Save this file for quick reference! 📌**

