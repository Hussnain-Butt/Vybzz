# =================================================================
# === V Y B Z Z   -   L I V E   S T R E A M I N G   D O C K E R F I L E ===
# =================================================================
# Stage 1: Builder - Dependencies aur Prisma Generate
FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies (including dev dependencies for Prisma)
RUN npm ci

# Generate Prisma Client
# ✅ FIX: Add retries and better error handling
RUN npx prisma generate || \
    (echo "First attempt failed, retrying..." && sleep 5 && npx prisma generate) || \
    (echo "Second attempt failed, retrying..." && sleep 10 && npx prisma generate)

# ----- STAGE 2: Final Production Image -----
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache ffmpeg openssl

ENV NODE_ENV production

# Copy node_modules and generated Prisma Client from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy application code
COPY . .

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

EXPOSE 3004
ENTRYPOINT ["./entrypoint.sh"]