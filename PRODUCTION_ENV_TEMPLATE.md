# 🔐 PRODUCTION ENVIRONMENT VARIABLES TEMPLATE

## 📋 OVERVIEW

یہ file production server پر استعمال ہونے والے environment variables کی template ہے۔

This file is a template for environment variables to be used on the production server.

---

## 📁 FILE TO CREATE ON SERVER

Server پر یہ file بنائیں: `/root/vybzz/.env.production`

Create this file on server: `/root/vybzz/.env.production`

---

## 📝 FILE CONTENTS

```bash
# =============================================================================
# VYBZZ PRODUCTION ENVIRONMENT VARIABLES
# =============================================================================

# =============================================================================
# DOCKER COMPOSE VARIABLES
# =============================================================================

# PostgreSQL Database Configuration
POSTGRES_USER=vybzz_user
POSTGRES_PASSWORD=CHANGE_THIS_TO_STRONG_PASSWORD
POSTGRES_DB=vybzz

# Strong password generate کرنے کا طریقہ:
# How to generate strong password:
#   openssl rand -base64 32

# =============================================================================
# DATABASE URLs FOR SERVICES
# =============================================================================

# User Service Database URL
USER_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD@postgres:5432/vybzz?schema=users

# Post Service Database URL
POST_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD@postgres:5432/vybzz?schema=posts

# Live Streaming Service Database URL
LIVESTREAM_SERVICE_DATABASE_URL=postgresql://vybzz_user:YOUR_STRONG_PASSWORD@postgres:5432/vybzz?schema=livestreams

# =============================================================================
# PRODUCTION DOMAIN
# =============================================================================

# آپ کی production website کا domain
PRODUCTION_DOMAIN=yourdomain.com
PRODUCTION_URL=https://yourdomain.com

# CORS Origins (production domains)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🔧 SETUP INSTRUCTIONS

### Step 1: Generate Strong Password

```bash
# Server پر یہ command چلائیں:
openssl rand -base64 32

# Output example:
# K9mW2xQp8zNvYr5tGh7jL3bF4cD6aE1sP0oI9uY8T=
```

### Step 2: Create File on Server

```bash
# Server پر file بنائیں
nano /root/vybzz/.env.production

# اوپر دیے گئے contents paste کریں
# Paste the contents from above

# Replace placeholders:
# - YOUR_STRONG_PASSWORD → generated password
# - yourdomain.com → your actual domain

# Save: Ctrl+X, Y, Enter
```

### Step 3: Set Permissions

```bash
# File کو secure کریں
chmod 600 /root/vybzz/.env.production

# Owner check کریں
ls -la /root/vybzz/.env.production
# Should show: -rw------- (only owner can read/write)
```

### Step 4: Test Configuration

```bash
# Environment variables load کریں
source /root/vybzz/.env.production

# Test
echo $POSTGRES_USER
echo $POSTGRES_DB

# Note: Password echo نہ کریں (security)
```

---

## 🚀 USAGE IN DEPLOYMENT

### Docker Compose کے ساتھ استعمال:

```bash
cd /root/vybzz

# Start with production config
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d
```

### GitHub Actions میں استعمال:

GitHub Actions workflow automatically یہ file server پر use کرے گا:

```yaml
# .github/workflows/deploy.yml میں
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d
```

---

## 🔐 SECURITY CHECKLIST

### ✅ DO / کریں:

- [x] Strong passwords استعمال کریں (32+ characters)
- [x] Password manager میں save کریں
- [x] File permissions 600 set کریں
- [x] Backup محفوظ جگہ پر رکھیں
- [x] ہر 3-6 ماہ میں passwords rotate کریں

### ❌ DON'T / نہ کریں:

- [ ] File کو Git میں commit نہ کریں
- [ ] Email/WhatsApp پر share نہ کریں
- [ ] Screenshots میں passwords نہ دکھائیں
- [ ] Local development میں production credentials نہ use کریں
- [ ] Weak passwords نہ رکھیں

---

## 📊 EXAMPLE VALUES

### Development (Local):
```bash
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz
```

### Production (Server):
```bash
POSTGRES_PASSWORD=K9mW2xQp8zNvYr5tGh7jL3bF4cD6aE1sP0oI9uY8T=
DATABASE_URL=postgresql://vybzz_user:K9mW2xQp8zNvYr5tGh7jL3bF4cD6aE1sP0oI9uY8T=@postgres:5432/vybzz
```

**یاد رکھیں**: یہ صرف example ہیں! اپنی actual passwords استعمال کریں!

**Remember**: These are just examples! Use your own actual passwords!

---

## 🆘 TROUBLESHOOTING

### Problem: Password میں special characters ہیں

```bash
# Password میں special characters ہوں تو URL encode کریں:
# @ → %40
# : → %3A
# / → %2F
# ? → %3F

# یا single quotes استعمال کریں:
DATABASE_URL='postgresql://user:pa$$w0rd@host:5432/db'
```

### Problem: Environment variables load نہیں ہو رہے

```bash
# Check if file exists
ls -la /root/vybzz/.env.production

# Check contents (password نہ دیکھیں)
head -5 /root/vybzz/.env.production

# Restart Docker Compose
docker-compose down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d
```

### Problem: Database connection failed

```bash
# Check if password matches
echo $POSTGRES_PASSWORD

# Check database logs
docker-compose logs postgres

# Verify DATABASE_URL format
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

---

## 📚 RELATED DOCUMENTATION

- **ENV_VARIABLES_GUIDE.md** - Local environment variables
- **PHASE_2_DOCKER_PRODUCTION_CONFIG.md** - Phase 2 complete guide
- **DEPLOYMENT_README.md** - Main deployment documentation

---

## 💡 PRO TIPS

1. **Password Manager**: اپنی passwords کو 1Password یا LastPass میں save کریں

2. **Backup**: `.env.production` کا encrypted backup رکھیں

3. **Rotation**: ہر 3-6 ماہ میں passwords change کریں

4. **Monitoring**: Wrong password attempts monitor کریں

5. **Separate Environments**: Dev/Staging/Production کے لیے مختلف credentials

---

**یاد رکھیں: Security سب سے اہم ہے! 🔒**

**Remember: Security is most important! 🔒**

