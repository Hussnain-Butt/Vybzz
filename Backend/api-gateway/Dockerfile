# Stage 1: Base image
# Alpine image choti aur secure hoti hai
FROM node:20-alpine

# Container ke andar application ke liye directory banayein
WORKDIR /app

# Pehle sirf package.json aur package-lock.json copy karein
# Is se Docker ki caching behtar kaam karti hai aur build tez hota hai
COPY package*.json ./

# Tamam dependencies install karein (development ke liye nodemon bhi zaroori hai)
# Isliye --omit=dev nahi lagayenge
RUN npm install

# Ab baaqi tamam code copy karein
COPY . .

# Application ka port expose karein
EXPOSE 3000

# Application ko nodemon ke sath "dev" mode mein chalane ki command
# Yeh command aapki package.json mein "dev": "nodemon index.js" script ko chalayegi
CMD ["npm", "run", "dev"]