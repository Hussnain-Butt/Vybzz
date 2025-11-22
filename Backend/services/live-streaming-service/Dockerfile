# =================================================================
# === V Y B Z Z   -   L I V E   S T R E A M I N G   D O C K E R F I L E ===
# =================================================================
# Stage 1: Sirf Dependencies Install Karna
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ----- STAGE 2: Final Production Image Banana -----
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache ffmpeg openssl # OpenSSL bhi add karein
ENV NODE_ENV production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# FIX: Prisma generate command ko build process ka hissa banayein.
# Yeh command Docker ko kehti hai: 'Code copy karne ke baad, isi Linux
# environment ke liye zaroori database engine banao.'
RUN npx prisma generate

EXPOSE 3004
CMD ["node", "src/index.js"]