# Stage 1: Build the React application
FROM node:22.12.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install dependencies and build the app
RUN npm ci && npm run build

# Stage 2: Serve the production build
FROM alpine:latest

# Install the 'serve' package
RUN npm install -g serve

# Set the working directory for the server
WORKDIR /app

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist ./

# Expose the port
EXPOSE 3000

# Set the command to run the server
CMD ["serve", "-s", ".", "-l", "3000"]