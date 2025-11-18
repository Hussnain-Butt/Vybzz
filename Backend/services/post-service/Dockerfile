# ---------- build stage ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Accept a build-arg so CI or docker-compose can inject the DB URL at build time if desired.
ARG DATABASE_URL=postgresql://postgres:postgres@postgres:5432/vybzz
ENV DATABASE_URL=${DATABASE_URL}

# Install build tools / dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Generate Prisma client. Prisma's generate step can read schema and env vars.
# To avoid failures if DATABASE_URL is missing, the schema should reference env("DATABASE_URL").
# We provide a default via the build arg above so generate won't fail in typical builds.
RUN npx prisma generate

# Copy app source
COPY . .

# ---------- runtime stage ----------
FROM node:20-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app

# Add curl for healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy built node_modules and application from builder stage
COPY --from=builder /app /app

# Create non-root user
RUN useradd -m nodeuser
USER nodeuser

EXPOSE 3003
CMD ["npm","start"]
