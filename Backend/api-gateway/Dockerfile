# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# lockfile abhi mismatch me hai, isliye npm install use kar rahe hain
RUN npm install --omit=dev
COPY . .

# ---- runtime (non-root) ----
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
RUN addgroup -S nodegrp && adduser -S nodeuser -G nodegrp
USER nodeuser
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "index.js"]
