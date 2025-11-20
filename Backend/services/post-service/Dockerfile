# File: Backend/services/post-service/Dockerfile (MUKAMMAL AUR FINAL CODE)

# ---------- build stage ----------
# Yeh stage dependencies install karega aur Prisma client banayega
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Prisma ko database se connect karne ke liye build-time par URL chahiye hota hai
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
COPY prisma ./prisma

# HAL: --unsafe-perm flag istemal karein. Yeh npm ko permissions kam karne se rokta hai,
# jis se baad mein 'chown' command sahi se kaam karti hai.
RUN npm ci --unsafe-perm

# Prisma client generate karein
RUN npx prisma generate

# Baaki application code ko copy karein
COPY . .


# ---------- runtime stage ----------
# Yeh stage application ko chalanay ke liye hai
FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

# Zaroori packages install karein (e.g., curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Security ke liye ek non-root user banayein
RUN useradd -m nodeuser

# Pehle builder stage se saara code copy karein
COPY --from=builder /app /app

# YEH SABSE AHEM STEP HAI:
# Saare code ki milkiyat (ownership) foran 'nodeuser' ko de dein.
# Ab 'nodeuser' ko har file (node_modules samait) mein likhne ki ijazat hogi.
RUN chown -R nodeuser:nodeuser /app

# Ab non-root user par switch karein
USER nodeuser

EXPOSE 3003
CMD ["npm", "start"]