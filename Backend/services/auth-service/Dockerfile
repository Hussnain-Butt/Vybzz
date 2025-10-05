# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# ---------- runtime stage ----------
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# ✅ ADD CURL FOR HEALTHCHECK (apk for Alpine)
RUN apk add --no-cache curl

COPY --from=builder /app /app
RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp
USER nodeuser

EXPOSE 3000
CMD ["npm","start"]
