# ⚡ QUICK START - PHASE 3: SERVER SETUP

**Goal:** Setup Digital Ocean server and deploy Vybzz

**Time:** ~45 minutes

**تیزی سے شروع کریں / Let's start quickly!**

---

## ✅ BEFORE YOU START

Make sure you have:
- [ ] Credit/Debit card or PayPal ($24/month)
- [ ] GitHub repository with Phase 1 & 2 files
- [ ] Local development working
- [ ] 45 minutes of time

---

## 📝 STEP-BY-STEP (10 Steps)

### STEP 1: Create Digital Ocean Account (5 min)

1. Go to: **https://www.digitalocean.com**
2. Click **"Sign Up"**
3. Use GitHub account (recommended)
4. Add payment method
5. ✅ Done! (New users get $200 credit)

---

### STEP 2: Create Droplet (5 min)

1. Click **"Create"** > **"Droplets"**

2. **Choose Region:**
   - Singapore ✅ (closest to Pakistan)

3. **Choose OS:**
   - Ubuntu 24.04 LTS ✅

4. **Choose Size:**
   - $24/month (4GB RAM, 2 vCPUs) ✅

5. **Authentication:**
   - SSH Keys ✅
   
   **Generate SSH Key (Windows):**
   ```powershell
   ssh-keygen -t ed25519 -C "vybzz"
   # Press Enter 3 times (defaults)
   
   # View public key:
   cat ~\.ssh\id_ed25519.pub
   # Copy output
   ```
   
   **Generate SSH Key (Mac/Linux):**
   ```bash
   ssh-keygen -t ed25519 -C "vybzz"
   # Press Enter 3 times
   
   cat ~/.ssh/id_ed25519.pub
   # Copy output
   ```
   
   - Paste in Digital Ocean
   - Name: "My PC"
   - Click "Add SSH Key"

6. **Hostname:** `vybzz-production`

7. Click **"Create Droplet"**

8. Wait 1-2 minutes

9. ✅ Copy your droplet IP (e.g., `164.92.123.456`)

---

### STEP 3: SSH into Server (2 min)

```bash
# Replace with your actual IP
ssh root@YOUR_DROPLET_IP

# Example:
ssh root@164.92.123.456

# First time: type 'yes'
```

✅ You're now on your server!

---

### STEP 4: Run Setup Script (10 min)

**پہلے repository پر push کریں / First push to repository:**

```bash
# On your local PC (C:\Vybzz)
git add .
git commit -m "Add Phase 3 setup scripts"
git push origin main
```

**Server پر / On server:**

```bash
# Download setup script (replace YOUR_USERNAME)
wget https://raw.githubusercontent.com/YOUR_USERNAME/vybzz/main/scripts/server-setup.sh

# Make executable
chmod +x server-setup.sh

# Run (takes ~10 minutes)
sudo bash server-setup.sh
```

**Script will:**
- Update system ✅
- Install Docker ✅
- Install Docker Compose ✅
- Configure firewall ✅
- Setup security ✅
- Generate SSH keys ✅

**⚠️ IMPORTANT:** آخر میں SSH keys دکھائے جائیں گے - save کریں!

---

### STEP 5: Save SSH Keys (2 min)

**Script کے آخر میں:**

```bash
# Public key (for authorized_keys - already added)
cat ~/.ssh/id_ed25519.pub

# Private key (for GitHub)
cat ~/.ssh/id_ed25519
```

**Copy private key** (including `-----BEGIN` and `-----END` lines)

---

### STEP 6: Add GitHub Secrets (3 min)

1. Go to: `https://github.com/YOUR_USERNAME/vybzz`
2. **Settings** > **Secrets and Variables** > **Actions**
3. **"New repository secret"**

**Add Secret 1:**
```
Name: SERVER_IP
Value: YOUR_DROPLET_IP (e.g., 164.92.123.456)
```

**Add Secret 2:**
```
Name: SSH_PRIVATE_KEY
Value: (Paste private key from Step 5)
```

✅ GitHub Actions can now deploy!

---

### STEP 7: Clone Repository (2 min)

```bash
# On your server
cd /root/vybzz

# Clone (replace YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/vybzz.git .

# Verify
ls -la
```

✅ Repository cloned!

---

### STEP 8: Copy .env Files (3 min)

**From your local PC:**

```powershell
# Windows PowerShell (from C:\Vybzz directory):

# API Gateway
scp Backend/api-gateway/.env root@YOUR_IP:/root/vybzz/Backend/api-gateway/

# Auth Service
scp Backend/services/auth-service/.env root@YOUR_IP:/root/vybzz/Backend/services/auth-service/

# User Service
scp Backend/services/user-service/.env root@YOUR_IP:/root/vybzz/Backend/services/user-service/

# Post Service
scp Backend/services/post-service/.env root@YOUR_IP:/root/vybzz/Backend/services/post-service/

# Live Streaming Service
scp Backend/services/live-streaming-service/.env root@YOUR_IP:/root/vybzz/Backend/services/live-streaming-service/
```

**Mac/Linux:**
```bash
# Same commands, just use forward slashes
scp Backend/api-gateway/.env root@YOUR_IP:/root/vybzz/Backend/api-gateway/
# ... etc
```

✅ Environment files copied!

---

### STEP 9: Create Production Environment (3 min)

**Generate strong password:**

```bash
# On server
openssl rand -base64 32
# Copy the output
```

**Create .env.production:**

```bash
nano /root/vybzz/.env.production
```

**Paste this (replace YOUR_STRONG_PASSWORD):**

```bash
# PostgreSQL
POSTGRES_USER=vybzz_user
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE
POSTGRES_DB=vybzz

# Database URLs (use same password)
USER_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD_HERE@postgres:5432/vybzz?schema=users
POST_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD_HERE@postgres:5432/vybzz?schema=posts
LIVESTREAM_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD_HERE@postgres:5432/vybzz?schema=livestreams

# Domain (change to your domain later)
PRODUCTION_DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

**Save:** Ctrl+X, Y, Enter

✅ Production environment ready!

---

### STEP 10: First Deployment! (10 min)

```bash
# On server
cd /root/vybzz

# Deploy
bash scripts/deploy.sh
```

**پہلی بار 10-15 منٹ لگیں گے**

**What happens:**
1. ✅ Pull latest code
2. ✅ Build Docker images (slow first time)
3. ✅ Start containers
4. ✅ Run database migrations
5. ✅ Health checks
6. ✅ Cleanup

**When complete:**
```
✅ DEPLOYMENT SUCCESSFUL!
```

✅ Your website is LIVE!

---

## 🎉 VERIFY DEPLOYMENT

### On Server:

```bash
# Check containers
docker-compose ps

# All should be "Up" and "healthy"
```

### In Browser:

```
http://YOUR_DROPLET_IP
```

**آپ کی Vybzz website دکھنی چاہیے! 🎊**

---

## 🚀 TEST AUTOMATIC DEPLOYMENT

### Now test GitHub Actions:

```bash
# On your local PC
cd C:\Vybzz

# Make a small change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "Test automatic deployment"
git push origin main
```

**Check GitHub:**
1. Go to your repository
2. Click **"Actions"** tab
3. You'll see deployment running! ⏳

**3-5 minutes later:**
- ✅ Deployment complete
- ✅ Your website updated automatically!

---

## ✅ PHASE 3 COMPLETE CHECKLIST

- [ ] Digital Ocean account created
- [ ] Droplet created ($24/month, 4GB RAM)
- [ ] SSH working
- [ ] Setup script run successfully
- [ ] SSH keys saved
- [ ] GitHub Secrets added (SERVER_IP, SSH_PRIVATE_KEY)
- [ ] Repository cloned
- [ ] .env files copied
- [ ] .env.production created
- [ ] First deployment successful
- [ ] Website accessible at http://YOUR_IP
- [ ] Automatic deployment tested and working

---

## 🆘 COMMON ISSUES

### Issue: Can't SSH

```bash
# Make sure IP is correct
# Try with verbose:
ssh -vvv root@YOUR_IP

# Check if key permissions are correct:
chmod 600 ~/.ssh/id_ed25519
```

### Issue: Setup script fails

```bash
# Check internet connection on droplet
ping google.com

# Re-run script
sudo bash server-setup.sh
```

### Issue: Docker not found

```bash
# Reinstall Docker
curl -fsSL https://get.docker.com | sh
systemctl start docker
```

### Issue: Deployment fails

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Restart Docker
systemctl restart docker
```

### Issue: Website not accessible

```bash
# Check containers
docker-compose ps

# Check firewall
sudo ufw status

# Allow HTTP
sudo ufw allow 80/tcp
```

---

## 💡 QUICK COMMANDS

```bash
# SSH to server
ssh root@YOUR_IP

# Check containers
docker-compose ps

# View logs
docker-compose logs -f

# Deploy manually
cd /root/vybzz && bash scripts/deploy.sh

# Restart a service
docker-compose restart api-gateway

# Check health
curl http://localhost:3000/health
```

---

## 🎯 WHAT'S NEXT?

**Your workflow now:**

```bash
# 1. Code locally
# 2. Test: docker-compose up
# 3. Commit: git commit -m "Changes"
# 4. Push: git push origin main
# 5. ✨ GitHub Actions automatically deploys!
```

**No manual work!** 🎊

---

## 📞 WHEN READY

**Tell me:**
```
"Phase 3 complete!"
```

**Or ask:**
- "How do I add a domain?"
- "How do I check server logs?"
- "What if something breaks?"

---

## 📊 YOUR PROGRESS

```
✅ Phase 1: Environment Setup        [DONE]
✅ Phase 2: Docker Production       [DONE]
✅ Phase 3: Server Setup            [DONE] ✓
⏳ Phase 4: Environment Management  [NEXT]
⏳ Phase 5: Nginx & SSL
⏳ Phase 6: Monitoring
⏳ Phase 7: Documentation

Progress: 43% Complete (3/7)
```

---

**🎉 WEBSITE LIVE! آپ کی website live ہے! 🎊**

**🌐 Access at: `http://YOUR_DROPLET_IP`**

**تیار ہیں Phase 4 کے لیے! Ready for Phase 4!**

