# File: Backend/services/live-streaming-service/Dockerfile (COMPLETE AND CORRECTED)

# Stage 1: Build
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Agar aapka frontend build process hai to yahan add karein

# Stage 2: Production
FROM node:18-slim
WORKDIR /app

# ---- YEH SABSE ZAROORI HAI ----
# FFMPEG install karein
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

COPY --from=builder /app ./

EXPOSE 3004
CMD ["node", "src/index.js"]