# ---------- build stage ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate
COPY . .
RUN npm prune --omit=dev

# ---------- runtime stage ----------
FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

# ✅ ADD CURL FOR HEALTHCHECK
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app /app

RUN useradd -m nodeuser
USER nodeuser

EXPOSE 3000
CMD ["npm","start"]
