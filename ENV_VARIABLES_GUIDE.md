# 🔐 VYBZZ ENVIRONMENT VARIABLES GUIDE
# ماحولیاتی متغیرات کی رہنمائی

## 📋 OVERVIEW / جائزہ

یہ گائیڈ آپ کو بتاتی ہے کہ کون سے environment variables کہاں استعمال ہوتے ہیں اور انہیں کیسے set کریں۔

This guide explains which environment variables are used where and how to set them up.

---

## 🗂️ REQUIRED FILES / ضروری فائلیں

ہر service کو اپنی `.env` file کی ضرورت ہے:

Each service needs its own `.env` file:

```
Backend/api-gateway/.env
Backend/services/auth-service/.env
Backend/services/user-service/.env
Backend/services/post-service/.env
Backend/services/live-streaming-service/.env
Frontend/.env (optional)
```

---

## 🐙 GITHUB SECRETS

GitHub Repository Settings > Secrets and Variables > Actions میں یہ add کریں:

Add these to GitHub Repository Settings > Secrets and Variables > Actions:

### `SERVER_IP`
```
164.92.123.456
```
آپ کی Digital Ocean Droplet کا IP address

Your Digital Ocean Droplet's IP address

### `SSH_PRIVATE_KEY`
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
-----END OPENSSH PRIVATE KEY-----
```

**Generate کرنے کا طریقہ / How to generate:**

1. Server پر SSH key generate کریں:
```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github-deploy
```

2. Public key کو authorized_keys میں add کریں:
```bash
cat ~/.ssh/github-deploy.pub >> ~/.ssh/authorized_keys
```

3. Private key کو GitHub Secret میں copy کریں:
```bash
cat ~/.ssh/github-deploy
```

---

## 1️⃣ API GATEWAY `.env`

**File Location:** `Backend/api-gateway/.env`

```bash
# Port
PORT=3000

# Microservice URLs (Docker میں internal)
AUTH_URL=http://auth-service:3001
USER_URL=http://user-service:3002
POST_URL=http://post-service:3003
LIVESTREAM_URL=http://live-streaming-service:3004

# Clerk Keys
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# CORS Origins
# Local:
CORS_ORIGINS=http://localhost:5173,http://localhost:80,http://localhost:3000
# Production:
# CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Environment
NODE_ENV=development
# Production:
# NODE_ENV=production

# Docker Flag
DOCKER=true
```

---

## 2️⃣ AUTH SERVICE `.env`

**File Location:** `Backend/services/auth-service/.env`

```bash
# Port
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=auth

# Clerk Keys
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_WEBHOOK_SIGNING_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Environment
NODE_ENV=development
```

---

## 3️⃣ USER SERVICE `.env`

**File Location:** `Backend/services/user-service/.env`

```bash
# Port
PORT=3002

# Database (schema=users ضروری ہے)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=users

# Clerk Keys
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_WEBHOOK_SIGNING_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Cloudinary (Image/Video Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXX

# Environment
NODE_ENV=development
```

---

## 4️⃣ POST SERVICE `.env`

**File Location:** `Backend/services/post-service/.env`

```bash
# Port
PORT=3003

# Database (schema=posts ضروری ہے)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=posts

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXX

# Mux (Video Streaming)
MUX_TOKEN_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
MUX_TOKEN_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MUX_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Environment
NODE_ENV=development
```

---

## 5️⃣ LIVE STREAMING SERVICE `.env`

**File Location:** `Backend/services/live-streaming-service/.env`

```bash
# Port
PORT=3004

# Database (schema=livestreams ضروری ہے)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=livestreams

# Mux (Live Streaming)
MUX_TOKEN_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
MUX_TOKEN_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Environment
NODE_ENV=development
```

---

## 6️⃣ FRONTEND `.env` (Optional)

**File Location:** `Frontend/.env`

```bash
# API URL
# Local:
VITE_API_URL=http://localhost:3000
# Production:
# VITE_API_URL=https://yourdomain.com/api

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔑 WHERE TO GET CREDENTIALS / اپنی credentials کہاں سے لیں

### 1. **CLERK** (Authentication)
- Website: https://clerk.com
- کھاتہ بنائیں / Create Account
- Dashboard > API Keys
- Copy کریں:
  - Publishable Key (Public)
  - Secret Key (Private)
- Webhooks:
  - Dashboard > Webhooks > Create Endpoint
  - URL: `https://yourdomain.com/api/webhooks/clerk`
  - Events: `user.created`, `user.updated`, `user.deleted`
  - Copy Signing Secret

### 2. **CLOUDINARY** (Image/Video Storage)
- Website: https://cloudinary.com
- کھاتہ بنائیں / Create Account
- Dashboard میں ملے گی:
  - Cloud Name
  - API Key
  - API Secret

### 3. **MUX** (Video Streaming)
- Website: https://mux.com
- کھاتہ بنائیں / Create Account
- Dashboard > Settings > Access Tokens
- Create New Token:
  - Permission: Mux Video (Read + Write)
  - Copy کریں:
    - Token ID
    - Token Secret
- Dashboard > Settings > Webhooks
  - Create webhook
  - URL: `https://yourdomain.com/api/webhooks/mux`
  - Copy Webhook Secret

---

## 🔒 PRODUCTION VS LOCAL

### LOCAL DEVELOPMENT (آپ کے کمپیوٹر پر)

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz?schema=SCHEMA

# Node Environment
NODE_ENV=development

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:80
```

### PRODUCTION (Digital Ocean Server پر)

```bash
# Database (Strong Password استعمال کریں)
DATABASE_URL=postgresql://vybzz_user:STRONG_PASSWORD@postgres:5432/vybzz?schema=SCHEMA

# Node Environment
NODE_ENV=production

# CORS (اپنی actual domain)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Strong Password Generate کریں:**
```bash
openssl rand -base64 32
```

---

## 📝 SETUP STEPS / سیٹ اپ کے قدم

### Step 1: .env Files بنائیں

ہر service کے folder میں `.env` file بنائیں:

```bash
# Windows PowerShell
New-Item -Path "Backend/api-gateway/.env" -ItemType File
New-Item -Path "Backend/services/auth-service/.env" -ItemType File
New-Item -Path "Backend/services/user-service/.env" -ItemType File
New-Item -Path "Backend/services/post-service/.env" -ItemType File
New-Item -Path "Backend/services/live-streaming-service/.env" -ItemType File
```

### Step 2: ہر File میں Values Copy کریں

اوپر دیے گئے sections سے appropriate values copy کریں اور اپنی actual credentials سے replace کریں۔

Copy the appropriate values from the sections above and replace with your actual credentials.

### Step 3: GitHub Secrets Add کریں

1. GitHub Repository پر جائیں
2. Settings > Secrets and Variables > Actions
3. "New repository secret" click کریں
4. Add کریں:
   - `SERVER_IP`: آپ کی Digital Ocean Droplet کا IP
   - `SSH_PRIVATE_KEY`: SSH private key

### Step 4: Test کریں

```bash
# Local development start کریں
docker-compose up

# Check کریں کہ سب services چل رہی ہیں
docker-compose ps
```

---

## ⚠️ SECURITY WARNINGS / سیکیورٹی انتباہات

### ❌ NEVER DO / کبھی نہ کریں:

1. `.env` files کو Git میں commit کرنا
2. Secrets کو email/WhatsApp/Slack پر share کرنا
3. Screenshots میں secrets دکھانا
4. Production credentials کو local میں استعمال کرنا
5. Weak passwords استعمال کرنا (مثلاً "123456")

### ✅ ALWAYS DO / ہمیشہ کریں:

1. Strong, unique passwords استعمال کریں
2. Credentials کو password manager میں store کریں
3. Production secrets کو الگ رکھیں
4. ہر 3-6 ماہ میں secrets rotate کریں
5. `.gitignore` میں `.env` شامل ہو

---

## 🆘 TROUBLESHOOTING / مسائل حل کرنا

### مسئلہ: Services start نہیں ہو رہیں

**حل:**
```bash
# .env files check کریں
ls Backend/api-gateway/.env
ls Backend/services/*//.env

# File کھولیں اور verify کریں کہ سب variables موجود ہیں
cat Backend/api-gateway/.env
```

### مسئلہ: Database connection error

**حل:**
```bash
# DATABASE_URL check کریں
# Ensure schema name صحیح ہے:
# - users service: ?schema=users
# - posts service: ?schema=posts
# - livestreams service: ?schema=livestreams
```

### مسئلہ: Clerk authentication نہیں کام کر رہا

**حل:**
```bash
# Check کریں:
# 1. CLERK_PUBLISHABLE_KEY صحیح ہے
# 2. CLERK_SECRET_KEY صحیح ہے
# 3. Clerk Dashboard میں domain whitelisted ہے
```

### مسئلہ: Images upload نہیں ہو رہیں

**حل:**
```bash
# Cloudinary credentials verify کریں:
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
#
# Cloudinary Dashboard میں check کریں کہ account active ہے
```

---

## 📞 SUPPORT / مدد

اگر کوئی مسئلہ ہو تو:

If you face any issues:

1. `.env` files double-check کریں
2. Service logs دیکھیں: `docker-compose logs service-name`
3. GitHub Actions logs check کریں
4. یہ guide دوبارہ پڑھیں

---

## ✅ FINAL CHECKLIST / آخری چیک لسٹ

Setup مکمل کرنے سے پہلے:

Before completing setup:

- [ ] تمام 5 services کی `.env` files بنا لیں
- [ ] Clerk account اور keys حاصل کیں
- [ ] Cloudinary account اور credentials حاصل کیں
- [ ] Mux account اور tokens حاصل کیں
- [ ] GitHub Secrets میں `SERVER_IP` add کیا
- [ ] GitHub Secrets میں `SSH_PRIVATE_KEY` add کیا
- [ ] Local development test کیا
- [ ] `.gitignore` میں `.env` شامل ہے

---

**مبارک ہو! آپ کا environment setup مکمل ہے! 🎉**

**Congratulations! Your environment setup is complete! 🎉**

