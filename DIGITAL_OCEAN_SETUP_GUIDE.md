# 🌊 DIGITAL OCEAN DROPLET SETUP GUIDE

## 📋 OVERVIEW / جائزہ

یہ guide آپ کو step-by-step بتاتی ہے کہ Digital Ocean پر droplet کیسے بنائیں اور setup کریں۔

This guide explains step-by-step how to create and setup a droplet on Digital Ocean.

---

## 💰 COST ESTIMATE / لاگت کا تخمینہ

| Droplet Type | RAM | CPU | Storage | Monthly Cost |
|--------------|-----|-----|---------|--------------|
| **Basic** | 2GB | 1 vCPU | 50GB SSD | $12/month (~3,500 PKR) |
| **Recommended** | 4GB | 2 vCPU | 80GB SSD | $24/month (~7,000 PKR) |
| **High Performance** | 8GB | 4 vCPU | 160GB SSD | $48/month (~14,000 PKR) |

**Recommendation / سفارش:** 4GB RAM droplet (کم سے کم / minimum)

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1: Create Digital Ocean Account

1. Go to: https://www.digitalocean.com
2. Click **"Sign Up"**
3. Sign up with:
   - Email
   - Or GitHub account (recommended)
4. Verify email
5. Add payment method:
   - Credit/Debit card
   - Or PayPal

**💡 Tip:** New users often get $200 credit for 60 days!

---

### STEP 2: Create a Droplet

#### A. Go to Droplets Page

1. After login, click **"Create"** (top right)
2. Select **"Droplets"**

#### B. Choose Region

**Select closest to Pakistan:**
- **Singapore** (Recommended - بہترین)
- **London**
- **Frankfurt**

**Why:** کم latency, تیز speed

#### C. Choose OS Image

**Select:**
- **Ubuntu 24.04 (LTS) x64** ✅ (Recommended)
- Or **Ubuntu 22.04 (LTS) x64**

**نوٹ:** Ubuntu 24.04 نیا ہے اور زیادہ وقت تک support ہوگا۔

#### D. Choose Droplet Size

**Minimum Requirements:**
```
RAM: 4GB
CPU: 2 vCPUs
Storage: 80GB SSD
Price: $24/month
```

**For Testing (Not recommended for production):**
```
RAM: 2GB
CPU: 1 vCPU
Storage: 50GB SSD
Price: $12/month
```

**Selection:**
1. Click **"Basic"** tab
2. Select **"Regular"** CPU type
3. Choose **$24/month** plan (4GB RAM)

#### E. Choose Authentication Method

**Select: SSH Keys** (Recommended) ✅

**Why:** زیادہ secure, password کی ضرورت نہیں

**Setup SSH Key:**

##### Windows Users:

1. Open PowerShell
2. Run:
```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```
3. Press Enter (default location)
4. Press Enter (no passphrase) یا password لگائیں
5. Your key is saved at: `C:\Users\YourName\.ssh\id_ed25519.pub`

6. View public key:
```powershell
cat ~\.ssh\id_ed25519.pub
```

7. Copy the output
8. Go back to Digital Ocean
9. Click **"New SSH Key"**
10. Paste the key
11. Name it: "My Windows PC"
12. Click **"Add SSH Key"**

##### Mac/Linux Users:

1. Open Terminal
2. Run:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
3. Press Enter (defaults)
4. View public key:
```bash
cat ~/.ssh/id_ed25519.pub
```
5. Copy and add to Digital Ocean (steps same as above)

**Alternative: Password Authentication**

اگر SSH key setup مشکل ہے:
- Select **"Password"**
- ایک strong password بنائیں (8+ characters)
- یہ password login کے لیے استعمال ہوگا

#### F. Finalize Details

1. **Hostname:** `vybzz-production` (یا کوئی بھی نام)
2. **Tags:** Optional (e.g., "vybzz", "production")
3. **Project:** Default Project (or create new)
4. **Backups:** Optional ($4.80/month extra for 4GB droplet)
   - Recommended for production! ✅

#### G. Create Droplet

1. Review all settings
2. Click **"Create Droplet"**
3. Wait 1-2 minutes for droplet to be ready

---

### STEP 3: Access Your Droplet

#### A. Get Droplet IP Address

1. Droplet created ہونے کے بعد
2. IP address copy کریں (e.g., `164.92.123.456`)

#### B. SSH into Droplet

##### Windows (PowerShell):

```powershell
ssh root@YOUR_DROPLET_IP
```

**Example:**
```powershell
ssh root@164.92.123.456
```

**First time:**
- Type `yes` to continue connecting
- You're now logged in! ✅

##### Mac/Linux (Terminal):

```bash
ssh root@YOUR_DROPLET_IP
```

**Troubleshooting:**

**Problem: Permission denied**

```bash
# Make sure key permissions are correct
chmod 600 ~/.ssh/id_ed25519
ssh -i ~/.ssh/id_ed25519 root@YOUR_DROPLET_IP
```

**Problem: Connection refused**

- Check if IP is correct
- Wait a minute (droplet might still be initializing)
- Check firewall settings

---

### STEP 4: Run Server Setup Script

```bash
# Download and run our setup script
wget -O setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/vybzz/main/scripts/server-setup.sh

# Make executable
chmod +x setup.sh

# Run (takes ~5-10 minutes)
sudo bash setup.sh
```

**Script کیا کرے گا:**
- ✅ System update
- ✅ Docker install
- ✅ Docker Compose install
- ✅ Firewall (UFW) setup
- ✅ Fail2ban setup
- ✅ Project directory create
- ✅ SSH keys generate
- ✅ Git configure

---

### STEP 5: Clone Your Repository

```bash
# Navigate to project directory
cd /root/vybzz

# Clone your repository
git clone https://github.com/YOUR_USERNAME/vybzz.git .

# Verify
ls -la
```

**یا private repository کے لیے:**

```bash
# Setup deploy key first
cat ~/.ssh/id_ed25519.pub
# Copy this and add to GitHub: Settings > Deploy Keys

# Then clone
git clone git@github.com:YOUR_USERNAME/vybzz.git .
```

---

### STEP 6: Setup Environment Files

#### A. Copy Service .env Files

**Local سے server پر copy کریں:**

```bash
# From your local machine (Windows PowerShell):
scp Backend/api-gateway/.env root@YOUR_DROPLET_IP:/root/vybzz/Backend/api-gateway/
scp Backend/services/auth-service/.env root@YOUR_DROPLET_IP:/root/vybzz/Backend/services/auth-service/
scp Backend/services/user-service/.env root@YOUR_DROPLET_IP:/root/vybzz/Backend/services/user-service/
scp Backend/services/post-service/.env root@YOUR_DROPLET_IP:/root/vybzz/Backend/services/post-service/
scp Backend/services/live-streaming-service/.env root@YOUR_DROPLET_IP:/root/vybzz/Backend/services/live-streaming-service/
```

#### B. Create Production Environment File

```bash
# On server
nano /root/vybzz/.env.production
```

**Add:**
```bash
# PostgreSQL
POSTGRES_USER=vybzz_user
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE
POSTGRES_DB=vybzz

# Database URLs
USER_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD_HERE@postgres:5432/vybzz?schema=users
POST_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD_HERE@postgres:5432/vybzz?schema=posts
LIVESTREAM_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD_HERE@postgres:5432/vybzz?schema=livestreams

# Domain
PRODUCTION_DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Generate strong password:**
```bash
openssl rand -base64 32
```

**Save:** Ctrl+X, Y, Enter

---

### STEP 7: Add GitHub Secrets

1. Go to GitHub Repository
2. **Settings** > **Secrets and Variables** > **Actions**
3. Click **"New repository secret"**

#### Secret 1: SERVER_IP

```
Name: SERVER_IP
Value: YOUR_DROPLET_IP (e.g., 164.92.123.456)
```

#### Secret 2: SSH_PRIVATE_KEY

```bash
# On your Digital Ocean server, run:
cat ~/.ssh/id_ed25519
```

Copy the entire output (including `-----BEGIN` and `-----END` lines)

```
Name: SSH_PRIVATE_KEY
Value: (paste the private key)
```

---

### STEP 8: Test Manual Deployment

```bash
# On server
cd /root/vybzz

# Run manual deployment
bash scripts/deploy.sh
```

**یہ کیا کرے گا:**
- Pull latest code
- Build Docker images
- Start containers
- Run migrations
- Health checks

**5-10 منٹ لگیں گے پہلی بار**

---

### STEP 9: Verify Deployment

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs -f

# Test API
curl http://localhost:3000/health

# Test frontend
curl http://localhost:80
```

**Browser میں test کریں:**
- http://YOUR_DROPLET_IP

---

### STEP 10: Setup Domain (Optional)

#### A. Point Domain to Droplet

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Find DNS settings
3. Add A Record:
   - **Type:** A
   - **Host:** @ (or leave blank)
   - **Value:** YOUR_DROPLET_IP
   - **TTL:** Automatic (or 300)

4. Add CNAME for www:
   - **Type:** CNAME
   - **Host:** www
   - **Value:** yourdomain.com
   - **TTL:** Automatic

5. Wait 5-30 minutes for DNS propagation

#### B. Update Environment Variables

```bash
nano /root/vybzz/.env.production

# Update:
PRODUCTION_DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### C. Update Service .env Files

Update API Gateway CORS:
```bash
nano /root/vybzz/Backend/api-gateway/.env

# Update CORS_ORIGINS to include your domain
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## ✅ VERIFICATION CHECKLIST

پہلی deployment سے پہلے check کریں:

Before first deployment, check:

- [ ] Droplet created and accessible
- [ ] SSH working
- [ ] Server setup script run successfully
- [ ] Docker installed and running
- [ ] Repository cloned
- [ ] All service .env files copied
- [ ] .env.production created with strong password
- [ ] GitHub Secrets added (SERVER_IP, SSH_PRIVATE_KEY)
- [ ] Manual deployment successful
- [ ] All containers running
- [ ] Health checks passing
- [ ] Website accessible via IP

---

## 🆘 TROUBLESHOOTING

### Problem: Can't SSH into droplet

```bash
# Check if SSH key is correct
ssh -vvv root@YOUR_DROPLET_IP

# Try with password (if enabled)
ssh -o PreferredAuthentications=password root@YOUR_DROPLET_IP
```

### Problem: Docker not found

```bash
# Install Docker manually
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker
```

### Problem: Containers not starting

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h

# Restart Docker
systemctl restart docker
```

### Problem: Website not accessible

```bash
# Check if nginx/frontend is running
docker ps | grep frontend

# Check firewall
sudo ufw status

# Allow HTTP if needed
sudo ufw allow 80/tcp
```

### Problem: Database connection failed

```bash
# Check postgres container
docker-compose logs postgres

# Verify DATABASE_URL
cat Backend/services/user-service/.env | grep DATABASE_URL

# Restart postgres
docker-compose restart postgres
```

---

## 📊 MONITORING

### Check Server Resources

```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
htop

# Docker stats
docker stats
```

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway

# Last 100 lines
docker-compose logs --tail=100
```

---

## 🔄 AFTER SETUP

### Daily Workflow:

1. Write code locally
2. Test locally: `docker-compose up`
3. Commit: `git commit -m "Your changes"`
4. Push: `git push origin main`
5. **GitHub Actions automatically deploys!** 🎉

### Manual Deployment (Emergency):

```bash
ssh root@YOUR_DROPLET_IP
cd /root/vybzz
bash scripts/deploy.sh
```

---

## 💡 TIPS

1. **Backups:** Enable Digital Ocean backups ($4.80/month)
2. **Monitoring:** Setup DigitalOcean monitoring (free)
3. **Alerts:** Configure email alerts for high CPU/memory
4. **Snapshots:** Take manual snapshots before major changes
5. **Documentation:** Keep this guide handy!

---

## 📚 NEXT STEPS

After setup complete:

1. ✅ **Phase 4:** Environment Management
2. ✅ **Phase 5:** Nginx & SSL Setup
3. ✅ **Phase 6:** Monitoring & Backups
4. ✅ **Phase 7:** Documentation

---

**🎉 Droplet setup مکمل! اب Phase 4 کی طرف چلتے ہیں!**

**🎉 Droplet setup complete! Now let's move to Phase 4!**

