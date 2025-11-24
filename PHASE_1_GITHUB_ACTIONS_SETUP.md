# 🚀 PHASE 1: GITHUB ACTIONS SETUP - COMPLETE

## ✅ کیا مکمل ہوا / What's Completed

Phase 1 میں ہم نے یہ files بنائے ہیں:

In Phase 1, we've created these files:

1. **`.github/workflows/deploy.yml`** - Automated deployment workflow
2. **`ENV_VARIABLES_GUIDE.md`** - Complete environment variables guide
3. **`scripts/setup-env-files.sh`** - Linux/Mac setup script
4. **`scripts/setup-env-files.bat`** - Windows setup script

---

## 📁 CREATED FILES / بنائی گئی فائلیں

### 1. `.github/workflows/deploy.yml`

**Location:** `.github/workflows/deploy.yml`

**کیا کرتی ہے / What it does:**

یہ GitHub Actions workflow file ہے جو ہر بار جب آپ `main` branch پر code push کرتے ہیں تو automatically:

This is a GitHub Actions workflow file that automatically runs whenever you push code to the `main` branch and:

1. ✅ Code checkout کرتی ہے / Checks out code
2. ✅ Digital Ocean server پر SSH connect کرتی ہے / Connects to Digital Ocean via SSH
3. ✅ Latest code pull کرتی ہے / Pulls latest code
4. ✅ Docker images build کرتی ہے / Builds Docker images
5. ✅ Old containers stop کرتی ہے / Stops old containers
6. ✅ New containers start کرتی ہے / Starts new containers
7. ✅ Database migrations چلاتی ہے / Runs database migrations
8. ✅ Health checks کرتی ہے / Performs health checks
9. ✅ اگر fail ہو تو automatic rollback کرتی ہے / Automatically rolls back if deployment fails
10. ✅ Old images cleanup کرتی ہے / Cleans up old images

**Features:**
- ✨ Detailed bilingual comments (Urdu + English)
- ✨ Automatic rollback on failure
- ✨ Health checks for all services
- ✨ Disk space monitoring
- ✨ Comprehensive error handling

---

### 2. `ENV_VARIABLES_GUIDE.md`

**Location:** `ENV_VARIABLES_GUIDE.md`

**کیا ہے / What it is:**

یہ ایک complete guide ہے جو بتاتی ہے:

This is a complete guide that explains:

- 📝 کون سے environment variables کہاں استعمال ہوتے ہیں / Which environment variables are used where
- 📝 ہر service کو کون سی values چاہیے / What values each service needs
- 📝 Credentials کہاں سے حاصل کریں / Where to get credentials (Clerk, Cloudinary, Mux)
- 📝 Local vs Production کا فرق / Difference between local and production
- 📝 Security best practices / سیکیورٹی کی بہترین تدابیر
- 📝 Troubleshooting common issues / عام مسائل کا حل

---

### 3. `scripts/setup-env-files.sh` (Linux/Mac)

**Location:** `scripts/setup-env-files.sh`

**کیا کرتا ہے / What it does:**

یہ script automatically سب services کے لیے `.env` files بناتا ہے placeholder values کے ساتھ۔

This script automatically creates `.env` files for all services with placeholder values.

**کیسے چلائیں / How to run:**

```bash
# Make executable
chmod +x scripts/setup-env-files.sh

# Run
./scripts/setup-env-files.sh
```

---

### 4. `scripts/setup-env-files.bat` (Windows)

**Location:** `scripts/setup-env-files.bat`

**کیا کرتا ہے / What it does:**

Windows کے لیے same functionality - automatically `.env` files بناتا ہے۔

Same functionality for Windows - automatically creates `.env` files.

**کیسے چلائیں / How to run:**

```cmd
scripts\setup-env-files.bat
```

یا simply file پر double-click کریں۔

Or simply double-click the file.

---

## 📋 NEXT STEPS - AAPKO KYA KARNA HAI

اب آپ کو Phase 1 complete کرنے کے لیے یہ کرنا ہوگا:

Now you need to do these steps to complete Phase 1:

### STEP 1: Setup Environment Variables Locally

```bash
# Windows
scripts\setup-env-files.bat

# Linux/Mac
chmod +x scripts/setup-env-files.sh
./scripts/setup-env-files.sh
```

یہ تمام `.env` files بنا دے گا۔

This will create all `.env` files.

---

### STEP 2: Get Required Credentials

آپ کو یہ accounts بنانے ہوں گے اور credentials حاصل کرنے ہوں گے:

You need to create these accounts and get credentials:

#### A) **CLERK** (Authentication)
1. https://clerk.com پر جائیں
2. Sign up کریں
3. New application بنائیں
4. Dashboard > API Keys سے copy کریں:
   - `CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)
5. Dashboard > Webhooks > Add Endpoint:
   - URL (بعد میں update کریں گے): `https://your-domain.com/api/webhooks/clerk`
   - Events select کریں: `user.created`, `user.updated`, `user.deleted`
   - Copy کریں: `CLERK_WEBHOOK_SIGNING_SECRET`

#### B) **CLOUDINARY** (Image/Video Storage)
1. https://cloudinary.com پر جائیں
2. Sign up کریں
3. Dashboard میں مل جائے گی:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

#### C) **MUX** (Video Streaming)
1. https://mux.com پر جائیں
2. Sign up کریں
3. Dashboard > Settings > Access Tokens
4. "Create New Token" click کریں
5. Permission: "Mux Video" (Read + Write)
6. Copy کریں:
   - `MUX_TOKEN_ID`
   - `MUX_TOKEN_SECRET`
7. Dashboard > Settings > Webhooks
   - Add webhook
   - URL (بعد میں update کریں گے): `https://your-domain.com/api/webhooks/mux`
   - Copy کریں: `MUX_WEBHOOK_SECRET`

---

### STEP 3: Update All .env Files

ہر service کی `.env` file میں placeholder values کو اپنی actual credentials سے replace کریں:

Replace placeholder values in each service's `.env` file with your actual credentials:

```bash
# Edit these files:
Backend/api-gateway/.env
Backend/services/auth-service/.env
Backend/services/user-service/.env
Backend/services/post-service/.env
Backend/services/live-streaming-service/.env
Frontend/.env
```

**تفصیلی ہدایات کے لیے دیکھیں / For detailed instructions see:**
- `ENV_VARIABLES_GUIDE.md`

---

### STEP 4: Test Locally

اب local development test کریں:

Now test local development:

```bash
# Start all services
docker-compose up

# یا background میں چلانے کے لیے
# Or to run in background
docker-compose up -d

# Logs دیکھنے کے لیے
# To view logs
docker-compose logs -f

# Services کی status check کرنے کے لیے
# To check status of services
docker-compose ps
```

**یہ check کریں / Check these:**
- ✅ سب services start ہو گئیں / All services started
- ✅ Database migrations چل گئیں / Database migrations ran
- ✅ Frontend `http://localhost:80` پر accessible ہے
- ✅ API Gateway `http://localhost:3000` پر accessible ہے

---

### STEP 5: Setup GitHub Secrets

اب GitHub repository میں secrets add کریں:

Now add secrets to your GitHub repository:

1. **GitHub Repository پر جائیں**
   - Your Vybzz repository

2. **Settings > Secrets and Variables > Actions**
   
3. **"New repository secret" click کریں**

4. **یہ دو secrets add کریں:**

   **Secret 1: `SERVER_IP`**
   ```
   Name: SERVER_IP
   Value: Your Digital Ocean Droplet IP (e.g., 164.92.123.456)
   ```

   **Secret 2: `SSH_PRIVATE_KEY`**
   ```
   Name: SSH_PRIVATE_KEY
   Value: Your SSH private key (ابھی نہیں ہے، Phase 3 میں generate کریں گے)
   ```

   *Note: SSH key abhi add نہ کریں اگر server setup نہیں ہوا۔ Phase 3 میں server setup کے بعد add کریں گے۔*
   
   *Note: Don't add SSH key yet if server is not setup. We'll add it in Phase 3 after server setup.*

---

## 🎯 WORKFLOW EXPLANATION / کیسے کام کرتا ہے

### LOCAL DEVELOPMENT (روزانہ کا کام)

```bash
# 1. Code لکھیں / Write code
# 2. Local test کریں / Test locally
docker-compose up

# 3. Git commit & push کریں
git add .
git commit -m "Your changes"
git push origin main

# 4. GitHub Actions automatically deployment کرے گا! 🎉
```

### AUTOMATED DEPLOYMENT PROCESS

جب آپ `main` branch پر push کرتے ہیں:

When you push to `main` branch:

1. **GitHub Actions trigger ہوتا ہے** (automatically)
2. **Workflow شروع ہوتا ہے:**
   - Server پر SSH connect
   - Latest code pull
   - Docker images build
   - Old containers stop
   - New containers start
   - Database migrations run
   - Health checks perform
3. **اگر سب کچھ ٹھیک ہو:**
   - ✅ Deployment successful!
   - ✅ آپ کی website latest version چلا رہی ہے
4. **اگر کچھ غلط ہو:**
   - ❌ Automatic rollback
   - ❌ پچھلی working version restore ہو جاتی ہے
   - ❌ آپ کو notification ملتی ہے

---

## 🔐 SECURITY NOTES / سیکیورٹی کی اہمیت

### ⚠️ NEVER DO / کبھی نہ کریں:

1. ❌ `.env` files کو Git میں commit کرنا
2. ❌ Secrets کو email/WhatsApp/Slack پر share کرنا
3. ❌ Screenshots میں credentials دکھانا
4. ❌ Production credentials کو local میں استعمال کرنا
5. ❌ Weak passwords استعمال کرنا

### ✅ ALWAYS DO / ہمیشہ کریں:

1. ✅ Strong, unique passwords استعمال کریں
2. ✅ Password manager استعمال کریں (1Password, LastPass)
3. ✅ Production secrets الگ رکھیں
4. ✅ ہر 3-6 ماہ میں credentials rotate کریں
5. ✅ 2FA enable کریں سب accounts پر

---

## 📊 FILES CHECKLIST

Phase 1 complete کرنے کے لیے check کریں:

To complete Phase 1, check:

- [x] ✅ `.github/workflows/deploy.yml` بنایا / Created
- [x] ✅ `ENV_VARIABLES_GUIDE.md` بنایا / Created
- [x] ✅ `scripts/setup-env-files.sh` بنایا / Created
- [x] ✅ `scripts/setup-env-files.bat` بنایا / Created
- [ ] ⏳ Clerk account بنایا اور keys حاصل کیں / Created Clerk account and got keys
- [ ] ⏳ Cloudinary account بنایا / Created Cloudinary account
- [ ] ⏳ Mux account بنایا / Created Mux account
- [ ] ⏳ تمام services کی `.env` files بنائیں / Create all services `.env` files
- [ ] ⏳ `.env` files میں actual credentials add کیں / Added actual credentials to `.env` files
- [ ] ⏳ Local development test کیا / Tested local development
- [ ] ⏳ GitHub Secrets add کیں (SERVER_IP) / Added GitHub Secrets

---

## 🆘 TROUBLESHOOTING

### Problem: Script run نہیں ہو رہا

**Linux/Mac:**
```bash
# Permission دیں
chmod +x scripts/setup-env-files.sh

# Phir run کریں
./scripts/setup-env-files.sh
```

**Windows:**
```cmd
# File پر right-click > "Run as Administrator"
```

### Problem: `.env` files already exist

یہ ٹھیک ہے! Script existing files کو overwrite نہیں کرے گا۔

This is fine! The script won't overwrite existing files.

اگر نئی files بنانی ہوں:
```bash
# Backup لیں
cp Backend/api-gateway/.env Backend/api-gateway/.env.backup

# Delete کریں
rm Backend/api-gateway/.env

# Script دوبارہ چلائیں
./scripts/setup-env-files.sh
```

### Problem: Clerk keys نہیں مل رہیں

1. https://clerk.com پر login کریں
2. Dashboard > API Keys
3. اگر application نہیں بنی:
   - "Create Application" click کریں
   - Name دیں: "Vybzz"
   - Authentication method select کریں

### Problem: Local services start نہیں ہو رہیں

```bash
# Logs دیکھیں
docker-compose logs

# Specific service کی logs
docker-compose logs user-service

# .env files check کریں
cat Backend/api-gateway/.env
```

---

## 📚 ADDITIONAL RESOURCES

- **ENV_VARIABLES_GUIDE.md** - Complete environment variables guide
- **Clerk Documentation:** https://clerk.com/docs
- **Cloudinary Documentation:** https://cloudinary.com/documentation
- **Mux Documentation:** https://docs.mux.com
- **GitHub Actions Documentation:** https://docs.github.com/en/actions

---

## ✅ PHASE 1 COMPLETION CHECKLIST

Phase 1 مکمل کرنے سے پہلے:

Before completing Phase 1:

- [ ] تمام required accounts بنائے (Clerk, Cloudinary, Mux)
- [ ] `setup-env-files` script چلایا
- [ ] تمام `.env` files میں actual credentials add کیں
- [ ] Local development test کیا (`docker-compose up`)
- [ ] سب services successfully start ہوئیں
- [ ] Frontend browser میں open ہوا
- [ ] GitHub Secrets add کیں (SERVER_IP)

---

## 🎉 READY FOR PHASE 2?

جب آپ نے یہ سب complete کر لیا ہو تو:

When you've completed all the above:

**مجھے بتائیں:** "Phase 1 complete! Let's move to Phase 2"

**Tell me:** "Phase 1 complete! Let's move to Phase 2"

Phase 2 میں ہم production Docker configuration بنائیں گے۔

In Phase 2, we'll create production Docker configuration.

---

## ❓ QUESTIONS?

اگر کوئی سوال ہو یا کہیں اٹک جائیں تو مجھے بتائیں!

If you have any questions or get stuck anywhere, let me know!

Common questions:
1. "Clerk webhook URL کیا ہونی چاہیے?" - ابھی placeholder رکھیں، بعد میں update کریں گے
2. "Database password کیا رکھوں?" - Local میں `postgres` رکھ سکتے ہیں
3. "SSH key کیسے generate کروں?" - Phase 3 میں detail سے بتاؤں گا

---

**تیار ہیں؟ Phase 1 شروع کریں! 🚀**

**Ready? Let's start Phase 1! 🚀**

