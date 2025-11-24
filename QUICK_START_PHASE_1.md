# ⚡ QUICK START - PHASE 1

**Goal:** Setup automated deployment with GitHub Actions

**Time:** 30 minutes

**تیزی سے شروع کریں / Let's start quickly!**

---

## ✅ STEP 1: Run Setup Script (2 minutes)

### Windows:
```cmd
scripts\setup-env-files.bat
```

### Linux/Mac:
```bash
chmod +x scripts/setup-env-files.sh
./scripts/setup-env-files.sh
```

**یہ کیا کرے گا:**
- تمام services کے لیے `.env` files بنائے گا
- Placeholder values کے ساتھ

---

## ✅ STEP 2: Get Clerk Keys (5 minutes)

1. Open: https://clerk.com
2. Click **"Sign Up"**
3. Create account
4. Click **"+ Create Application"**
   - Name: `Vybzz`
   - Choose authentication methods: Google, Email
5. Click on application > **"API Keys"**
6. Copy these:

```bash
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXX...
CLERK_SECRET_KEY=sk_test_XXXXXXX...
```

7. Go to **"Webhooks"** > **"+ Add Endpoint"**
   - URL: `https://temp.com/webhooks/clerk` (بعد میں change کریں گے)
   - Events: Select `user.created`, `user.updated`, `user.deleted`
   - Click **"Create"**
   - Copy:
```bash
CLERK_WEBHOOK_SIGNING_SECRET=whsec_XXXXXXX...
```

---

## ✅ STEP 3: Get Cloudinary Keys (3 minutes)

1. Open: https://cloudinary.com
2. Click **"Sign Up Free"**
3. After login, Dashboard پر آپ کو ملیں گی:

```bash
CLOUDINARY_CLOUD_NAME=dxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXXXXXXXXX
```

---

## ✅ STEP 4: Get Mux Keys (5 minutes)

1. Open: https://mux.com
2. Click **"Sign Up"**
3. After login:
   - Go to **Settings** (gear icon) > **Access Tokens**
   - Click **"Generate new token"**
   - Name: `Vybzz Production`
   - Environment: `Development` (abhi ke liye)
   - Permissions: Select **"Mux Video"** (Read + Write)
   - Click **"Generate Token"**
   - Copy immediately (یہ دوبارہ نہیں ملے گی):

```bash
MUX_TOKEN_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MUX_TOKEN_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

4. Go to **Settings** > **Webhooks**
   - Click **"Create new webhook"**
   - URL: `https://temp.com/webhooks/mux` (بعد میں change کریں گے)
   - Click **"Create"**
   - Copy:

```bash
MUX_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## ✅ STEP 5: Update .env Files (5 minutes)

اب ہر service کی `.env` file open کریں اور keys paste کریں:

### File 1: `Backend/api-gateway/.env`

```bash
PORT=3000

AUTH_URL=http://auth-service:3001
USER_URL=http://user-service:3002
POST_URL=http://post-service:3003
LIVESTREAM_URL=http://live-streaming-service:3004

# Paste your Clerk keys:
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY

CORS_ORIGINS=http://localhost:5173,http://localhost:80,http://localhost:3000

NODE_ENV=development
DOCKER=true
```

### File 2: `Backend/services/auth-service/.env`

```bash
PORT=3001

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=auth

# Paste your Clerk keys:
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
CLERK_WEBHOOK_SIGNING_SECRET=whsec_YOUR_ACTUAL_SECRET

NODE_ENV=development
```

### File 3: `Backend/services/user-service/.env`

```bash
PORT=3002

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=users

# Clerk keys:
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
CLERK_WEBHOOK_SIGNING_SECRET=whsec_YOUR_ACTUAL_SECRET

# Cloudinary keys:
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret

NODE_ENV=development
```

### File 4: `Backend/services/post-service/.env`

```bash
PORT=3003

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=posts

# Cloudinary keys:
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret

# Mux keys:
MUX_TOKEN_ID=your_actual_token_id
MUX_TOKEN_SECRET=your_actual_token_secret
MUX_WEBHOOK_SECRET=your_actual_webhook_secret

NODE_ENV=development
```

### File 5: `Backend/services/live-streaming-service/.env`

```bash
PORT=3004

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=livestreams

# Mux keys:
MUX_TOKEN_ID=your_actual_token_id
MUX_TOKEN_SECRET=your_actual_token_secret

NODE_ENV=development
```

### File 6: `Frontend/.env` (Optional)

```bash
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
```

---

## ✅ STEP 6: Test Locally (5 minutes)

```bash
# Start all services
docker-compose up
```

**یہ check کریں:**
- ✅ سب services successfully start ہوں
- ✅ کوئی error نہ ہو
- ✅ Browser میں open کریں: http://localhost:80

**اگر errors ہوں:**
```bash
# Specific service کی logs دیکھیں
docker-compose logs auth-service
docker-compose logs user-service
```

**سب کچھ ٹھیک ہے تو:**
```bash
# Stop services
Ctrl + C

# Or if running in background:
docker-compose down
```

---

## ✅ STEP 7: Add GitHub Secrets (3 minutes)

1. اپنی GitHub repository پر جائیں
2. **Settings** > **Secrets and Variables** > **Actions**
3. Click **"New repository secret"**

### Secret 1:
```
Name: SERVER_IP
Value: YOUR_DROPLET_IP (ابھی نہیں ہے تو empty رکھیں)
```

*Note: اگر ابھی Digital Ocean droplet نہیں بنایا تو skip کریں۔ Phase 3 میں add کریں گے۔*

---

## ✅ STEP 8: Test Git Workflow (2 minutes)

```bash
# Add changes to git
git add .

# Commit
git commit -m "Add environment configuration for Phase 1"

# Push (ابھی deployment نہیں ہوگی کیونکہ server setup نہیں)
git push origin main
```

GitHub پر check کریں:
- Repository > **Actions** tab
- آپ کو workflow نظر آئے گا (fail ہو سکتا ہے کیونکہ server نہیں)
- یہ normal ہے!

---

## 🎉 PHASE 1 COMPLETE!

### آپ نے یہ کر لیا:
- ✅ تمام `.env` files setup کیں
- ✅ Clerk, Cloudinary, Mux accounts بنائے
- ✅ Local development test کیا
- ✅ GitHub Actions workflow ready ہے
- ✅ Git workflow test کیا

---

## 📋 VERIFICATION CHECKLIST

Check کریں کہ سب کچھ ٹھیک ہے:

- [ ] ✅ `docker-compose up` successfully چلا
- [ ] ✅ http://localhost:80 پر frontend open ہوا
- [ ] ✅ کوئی "invalid API key" errors نہیں ہیں
- [ ] ✅ `.github/workflows/deploy.yml` file موجود ہے
- [ ] ✅ سب `.env` files میں actual keys ہیں (placeholder نہیں)

---

## 🚀 READY FOR PHASE 2?

جب آپ کا local development properly چل رہا ہو:

**مجھے بتائیں:**
```
Phase 1 complete! Ready for Phase 2.
```

**Phase 2 میں ہم کریں گے:**
- Production Docker configuration
- Optimize images for production
- Security improvements
- Production environment variables

---

## 🆘 COMMON ISSUES

### Issue: Script file not found

**Windows:**
```cmd
cd C:\Vybzz
dir scripts
scripts\setup-env-files.bat
```

**Linux/Mac:**
```bash
cd ~/Vybzz
ls -la scripts/
chmod +x scripts/setup-env-files.sh
./scripts/setup-env-files.sh
```

### Issue: Services not starting

```bash
# Check logs
docker-compose logs

# Check if ports are free
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Remove old containers
docker-compose down -v
docker-compose up
```

### Issue: "Invalid API key" errors

**Check:**
1. `.env` file میں actual keys paste کیں؟
2. Keys میں extra spaces نہیں؟
3. Keys complete copy ہوئیں؟

**Fix:**
```bash
# Re-copy keys from:
# - Clerk: https://dashboard.clerk.com
# - Cloudinary: https://cloudinary.com/console
# - Mux: https://dashboard.mux.com
```

### Issue: Database connection failed

**Fix:**
```bash
# Restart PostgreSQL container
docker-compose restart postgres

# Check if running
docker ps | grep postgres

# Check logs
docker-compose logs postgres
```

---

## 📚 HELPFUL COMMANDS

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs user-service

# Restart a service
docker-compose restart user-service

# Rebuild and start
docker-compose up --build

# Remove everything (including database)
docker-compose down -v
```

---

## 💡 PRO TIPS

1. **Password Manager:** اپنی credentials کو password manager میں save کریں (1Password, LastPass)

2. **Backup:** `.env` files کا backup لیں (لیکن Git میں نہ رکھیں!)

3. **Testing:** ہر service individually test کریں:
   ```bash
   curl http://localhost:3000/health  # API Gateway
   curl http://localhost:3001/health  # Auth Service
   curl http://localhost:3002/health  # User Service
   ```

4. **Documentation:** `ENV_VARIABLES_GUIDE.md` bookmark کر لیں

---

## ❓ QUESTIONS?

اگر کوئی سوال ہو تو مجھے بتائیں!

Common questions:
- "Keys کہاں سے لیں؟" → ⬆️ Steps 2-4 دیکھیں
- "Local test کیسے کریں؟" → ⬆️ Step 6 دیکھیں
- "Errors کیوں آ رہیں؟" → ⬆️ Common Issues section دیکھیں

---

**Ready? Let's complete Phase 1! 🚀**

**تیار ہیں؟ Phase 1 مکمل کریں! 🚀**

