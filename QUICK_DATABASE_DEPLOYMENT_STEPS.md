# 🎯 Quick Database Deployment Steps

**آسان اردو میں - Production Database Setup**

---

## ✅ Completed (Local Machine Par)

1. ✅ Digital Ocean Managed PostgreSQL Database created
2. ✅ Connection strings configured
3. ✅ `docker-compose.prod.yml` updated
4. ✅ Environment variables file prepared (`production-env-setup.txt`)
5. ✅ Deployment scripts created

---

## 🚀 Ab Aapko Yeh Karna Hai (Server Par)

### **STEP 1: Server Par SSH Karein**

```bash
ssh root@167.99.49.147
```

---

### **STEP 2: Project Directory Main Jaaein**

```bash
cd /root/Vybzz
```

*(Agar aap ne kisi aur directory me deploy kiya hai, to wahan jaaein)*

---

### **STEP 3: Latest Code Pull Karein (Optional)**

```bash
git pull origin main
```

---

### **STEP 4: .env.production File Banaaein**

#### Method A: Manually (Nano Editor):

```bash
nano .env.production
```

**Phir yeh content paste karein:**

```env
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
POSTGRES_HOST=your_db_host.db.ondigitalocean.com
POSTGRES_PORT=25060

USER_SERVICE_DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=users&sslmode=require

POST_SERVICE_DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=posts&sslmode=require

LIVESTREAM_SERVICE_DATABASE_URL=postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?schema=livestreams&sslmode=require

CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_secret
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=production

API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
POST_SERVICE_PORT=3003
LIVESTREAM_SERVICE_PORT=3004

AUTH_URL=http://auth-service:3001
USER_URL=http://user-service:3002
POST_URL=http://post-service:3003
LIVESTREAM_URL=http://live-streaming-service:3004
```

**Save karein:**
- `Ctrl + X`
- `Y` (Yes)
- `Enter`

#### Method B: Copy from production-env-setup.txt:

```bash
cat production-env-setup.txt > .env.production
```

---

### **STEP 5: File Permissions Secure Karein**

```bash
chmod 600 .env.production
```

---

### **STEP 6: Automated Deployment Script Chalaein**

```bash
chmod +x deploy-production-database.sh
./deploy-production-database.sh
```

**یہ script automatic کرے گی:**
- ✅ Old containers stop
- ✅ Prisma migrations run
- ✅ Production services deploy
- ✅ Health checks verify

---

### **STEP 7 (Alternative): Manual Deployment**

Agar script se issue ho, to manually:

```bash
# Stop containers
docker-compose down

# Remove old postgres (optional)
docker rm -f pg 2>/dev/null || true

# Deploy with production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## 🔍 Verification Commands

### **Check Container Status:**

```bash
docker-compose ps
```

**Expected:**
```
NAME                    STATUS
api-gateway             Up
auth-service            Up
user-service            Up (healthy)
post-service            Up (healthy)
live-streaming-service  Up (healthy)
frontend                Up
```

---

### **Check Logs:**

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
docker-compose logs -f post-service
```

---

### **Test Health Endpoints:**

```bash
curl http://localhost:3002/health  # User Service
curl http://localhost:3003/health  # Post Service
curl http://localhost:3004/health  # Live Streaming
curl http://localhost:3000/health  # API Gateway
```

---

### **Test Frontend:**

Browser me open karein:
```
http://167.99.49.147
```

---

## 🐛 Common Issues & Solutions

### **Issue 1: Database Connection Failed**

```bash
# Check environment variables
docker exec user-service env | grep DATABASE_URL

# Test database connectivity
docker run --rm -e DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host.db.ondigitalocean.com:25060/your_db_name?sslmode=require" node:18-alpine sh -c "npm install -g pg && psql \$DATABASE_URL -c 'SELECT 1'"
```

**Solutions:**
- Digital Ocean console check karein (database Active hai?)
- Firewall settings check (droplet IP whitelisted?)
- Connection string verify karein

---

### **Issue 2: Container Not Starting**

```bash
# Logs check karein
docker logs user-service --tail 50

# Restart specific container
docker-compose restart user-service

# Rebuild container
docker-compose up -d --build user-service
```

---

### **Issue 3: Prisma Migration Failed**

```bash
# Manual migration
docker exec -it user-service npx prisma db push
docker exec -it post-service npx prisma db push
docker exec -it live-streaming-service npx prisma db push
```

---

## 📊 Monitoring Commands

```bash
# CPU & Memory usage
docker stats

# Disk usage
df -h

# Container processes
docker-compose top

# Real-time logs
docker-compose logs -f --tail=100
```

---

## 🎉 Success Checklist

Deployment successful hai agar:

- ✅ All containers status: `Up` or `Up (healthy)`
- ✅ No errors in logs (`docker-compose logs`)
- ✅ Health endpoints respond: `200 OK`
- ✅ Frontend loads: `http://167.99.49.147`
- ✅ API requests work properly
- ✅ Database schemas created properly

---

## 📝 Important Notes

1. **Database Backups:**
   - Digital Ocean automatically daily backups leta hai
   - Console me backups tab se dekh sakte hain

2. **Security:**
   - `.env.production` file gitignore me hai
   - Server par permissions `600` hain
   - Database SSL enabled hai (`sslmode=require`)

3. **Connection Pooling:**
   - Digital Ocean managed database automatically handle karta hai
   - Default: 25 connections pool

4. **Monitoring:**
   - Digital Ocean console me metrics available hain
   - CPU, Memory, Connections, Storage graphs

---

## 🆘 Need Help?

Agar koi step me problem aaye:

1. **Logs share karein:**
   ```bash
   docker-compose logs > deployment-logs.txt
   ```

2. **Container status:**
   ```bash
   docker-compose ps > container-status.txt
   ```

3. **Environment check:**
   ```bash
   docker exec user-service env | grep DATABASE_URL
   ```

---

**Ready to deploy? Server par login karein aur STEP 1 se start karein! 🚀**


