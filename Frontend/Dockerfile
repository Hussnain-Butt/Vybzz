# =================================================================
# === V Y B Z Z   -   F R O N T E N D   D O C K E R F I L E ===
# =================================================================
# Yeh ek "multi-stage" Dockerfile hai. Iske do hisse hain:
# 1. Stage 1: React app ko build karna.
# 2. Stage 2: Build ki hui files ko Nginx server par serve karna.
# Iska faida yeh hai ke final image bohot choti aur secure hoti hai.

# ----- STAGE 1: React App ko Build Karna (Builder Stage) -----

# Hum Node.js v18 ki ek halki phulki (alpine) image se shuruaat kar rahe hain.
# Is stage ka naam humne 'builder' rakha hai.
FROM node:18-alpine AS builder

# Container ke andar '/app' naam ka ek folder banayein aur usay working directory set karein.
WORKDIR /app

# Pehle sirf package.json aur package-lock.json ko copy karein.
# Is se Docker ki caching behtar kaam karti hai. Dependencies tab hi dobara install hongi
# jab in files mein koi tabdeeli aayegi.
COPY package*.json ./

# Tamam zaroori dependencies (node_modules) ko install karein.
RUN npm install

# Ab baaki tamam project files (src, public, etc.) ko copy karein.
COPY . .

# Vite build command chalayein. Yeh production-ready static files (HTML, CSS, JS)
# '/app/dist' folder ke andar bana dega.
RUN npm run build


# ----- STAGE 2: App ko Nginx Par Serve Karna (Final Stage) -----

# Ab hum ek naye, fresh Nginx server ki image se shuruaat kar rahe hain.
FROM nginx:stable-alpine

# --- YEH LINE BOHT ZAROORI HAI ---
# Pichle stage ('builder') se, '/app/dist' folder ke andar ka saara content
# Nginx ke default web server folder ('/usr/share/nginx/html') mein copy kar dein.
COPY --from=builder /app/dist /usr/share/nginx/html

# Apni custom Nginx configuration file (nginx.conf) ko container ke andar
# Nginx ke configuration directory mein copy karein. Yahi file WebSocket ko handle karegi.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Dunya ko batayein ke yeh container port 80 par requests sunega.
EXPOSE 80

# Container shuru hone par Nginx server ko foreground mein start karne ka command.
# "-g 'daemon off;'" zaroori hai taake container chalta rahe.
CMD ["nginx", "-g", "daemon off;"]