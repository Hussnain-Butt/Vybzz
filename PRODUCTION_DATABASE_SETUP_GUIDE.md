# 🚀 Production Database Setup Guide - Digital Ocean

**اردو میں مکمل گائیڈ | Complete Guide in Urdu**

---

## ✅ Steps Completed So Far | اب تک مکمل ہونے والے قدم

1. ✅ Digital Ocean Managed PostgreSQL Database بن گیا ہے
2. ✅ Connection strings تیار ہو گئے ہیں
3. ✅ Docker Compose Production config update ہو گئی ہے

---

## 📋 Step 5: Server Par Environment Variables Setup

### **Server Par SSH کریں:**

```bash
ssh root@167.99.49.147
```

### **Project Directory میں جائیں:**

```bash
cd /root/Vybzz
# یا جہاں آپ کا project ہے
```

### **Create .env.production File:**

```bash
nano .env.production
```

### **یہ Content Copy کریں (production-env-setup.txt سے):**

```env
# PostgreSQL Database Configuration
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
POSTGRES_HOST=your_db_host.db.ondigitalocean.com
POSTGRES_PORT=25060

# Service-Specific Database URLs
USER_SERVICE_DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=users&sslmode=require

POST_SERVICE_DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=posts&sslmode=require

LIVESTREAM_SERVICE_DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=livestreams&sslmode=require

# Clerk Authentication
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_secret
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Node Environment
NODE_ENV=production

# Service Ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
POST_SERVICE_PORT=3003
LIVESTREAM_SERVICE_PORT=3004

# Service URLs
AUTH_URL=http://auth-service:3001
USER_URL=http://user-service:3002
POST_URL=http://post-service:3003
LIVESTREAM_URL=http://live-streaming-service:3004
```

### **Save کریں:**
- `Ctrl + X` press کریں
- `Y` type کریں (Yes)
- `Enter` press کریں

### **File Permissions Secure کریں:**

```bash
chmod 600 .env.production
```

⚠️ **یہ بہت ضروری ہے! | This is very important!**
- `600` permissions کا مطلب: صرف owner (root) پڑھ/لکھ سکتا ہے
- Security کے لیے ضروری ہے

---

## 📋 Step 6: Prisma Migrations Run کریں

### **Option 1: Manual Migration (Recommended)**

Server پر ایک temporary container میں migrations run کریں:

```bash
# User Service Migrations
docker run --rm \
  -e DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=users&sslmode=require" \
  -v /root/Vybzz/Backend/services/user-service:/app \
  -w /app \
  node:18-alpine \
  sh -c "npm install && npx prisma generate && npx prisma db push"

# Post Service Migrations
docker run --rm \
  -e DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=posts&sslmode=require" \
  -v /root/Vybzz/Backend/services/post-service:/app \
  -w /app \
  node:18-alpine \
  sh -c "npm install && npx prisma generate && npx prisma db push"

# Live Streaming Service Migrations
docker run --rm \
  -e DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=livestreams&sslmode=require" \
  -v /root/Vybzz/Backend/services/live-streaming-service:/app \
  -w /app \
  node:18-alpine \
  sh -c "npm install && npx prisma generate && npx prisma db push"
```

### **Option 2: Automatic Migration (During Deployment)**

Agar aapke Dockerfile میں migrations automatic ہیں, to deployment ke waqt automatically run ہو جائیں گی.

---

## 📋 Step 7: Deploy & Restart Services

### **Pull Latest Code (if needed):**

```bash
cd /root/Vybzz
git pull origin main
```

### **Stop Existing Containers:**

```bash
docker-compose down
```

### **Remove Old Postgres Container & Volume (if exists):**

```bash
# Container remove کریں
docker rm -f pg 2>/dev/null || true

# Volume remove کریں (optional - backup لے لیں پہلے)
docker volume rm vybzz-stack_pg_data 2>/dev/null || true
```

### **Build & Deploy with Production Config:**

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d --build
```

**یہ command کیا کرے گی:**
- ✅ سب services کو production mode میں build کرے گی
- ✅ .env.production سے environment variables load کرے گی
- ✅ Digital Ocean managed database سے connect کرے گی
- ✅ Background میں detached mode (-d) میں run کرے گی

### **Check Services Status:**

```bash
docker-compose ps
```

**Expected Output:**
```
NAME                    STATUS              PORTS
api-gateway             Up                  0.0.0.0:3000->3000/tcp
auth-service            Up                  0.0.0.0:3001->3001/tcp
user-service            Up (healthy)        0.0.0.0:3002->3002/tcp
post-service            Up (healthy)        0.0.0.0:3003->3003/tcp
live-streaming-service  Up (healthy)        0.0.0.0:3004->3004/tcp
frontend                Up                  0.0.0.0:80->80/tcp
```

---

## 🔍 Verification & Testing

### **1. Check Logs:**

```bash
# تمام services کے logs
docker-compose logs -f

# صرف user-service logs (database connection دیکھنے کے لیے)
docker-compose logs -f user-service

# صرف post-service logs
docker-compose logs -f post-service
```

### **2. Test Database Connection:**

```bash
# User service health check
curl http://localhost:3002/health

# Post service health check
curl http://localhost:3003/health

# Live streaming service health check
curl http://localhost:3004/health
```

### **3. Access Frontend:**

Browser میں open کریں:
```
http://167.99.49.147
```

---

## 🔒 Security Checklist

- ✅ `.env.production` file permissions: `600` (chmod 600 .env.production)
- ✅ Database SSL enabled: `sslmode=require`
- ✅ Database credentials secure ہیں
- ✅ Production mode: `NODE_ENV=production`
- ✅ No development volumes mounted
- ✅ No source code exposed

---

## 🐛 Troubleshooting

### **Issue 1: Database Connection Failed**

```bash
# Check if database is accessible
curl -I https://db-postgresql-nyc3-23871-do-user-27981746-0.k.db.ondigitalocean.com:25060

# Check environment variables
docker exec user-service env | grep DATABASE_URL
```

**Solution:**
- Digital Ocean console میں check کریں database "Active" ہے
- Firewall settings check کریں (droplet IP allowed ہے)
- Connection string double-check کریں

### **Issue 2: Prisma Migration Failed**

```bash
# Service logs دیکھیں
docker-compose logs user-service

# Manually migration run کریں
docker exec -it user-service npx prisma db push
```

### **Issue 3: Service Not Starting**

```bash
# Container status check کریں
docker ps -a

# Specific service logs
docker logs user-service --tail 100

# Restart specific service
docker-compose restart user-service
```

---

## 📊 Digital Ocean Database Management

### **Access Database Console:**

1. Digital Ocean Dashboard → Databases
2. Select: `vybzz-production-db`
3. Overview tab میں metrics دیکھ سکتے ہیں:
   - CPU usage
   - Memory usage
   - Connections
   - Storage

### **Database Backups:**

Digital Ocean automatically daily backups لیتا ہے:
- Retention: 7 days (Basic plan)
- Manual backup bhi لے سکتے ہیں

### **Connection Pooling:**

Digital Ocean managed database connection pooling provide کرتا ہے:
- Default pool size: 25 connections
- Settings tab میں adjust کر سکتے ہیں

---

## 🎯 Next Steps

After successful deployment:

1. ✅ Monitor logs for 10-15 minutes
2. ✅ Test all API endpoints
3. ✅ Create test users
4. ✅ Verify data persistence
5. ✅ Setup monitoring (optional)
6. ✅ Configure automated backups
7. ✅ Setup domain name (if needed)

---

## 📝 Quick Command Reference

```bash
# View all containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart all services
docker-compose restart

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d --build

# Check disk space
df -h

# Check memory usage
free -h

# View running processes
htop
```

---

## ✅ Success Indicators

Deployment successful ہے اگر:

1. ✅ تمام containers `Up` status میں ہیں
2. ✅ Health checks pass ہو رہے ہیں
3. ✅ Frontend accessible ہے (http://167.99.49.147)
4. ✅ API endpoints respond کر رہے ہیں
5. ✅ Logs میں کوئی critical errors نہیں ہیں
6. ✅ Database connections successful ہیں

---

**اگر کوئی مسئلہ آئے تو logs share کریں! | If any issue occurs, share the logs!**


