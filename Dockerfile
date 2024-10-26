# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache \
    bash \
    git \
    gcc \
    g++ \
    make

# Create directories for both frontend and backend
WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Build frontend
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Set up backend
WORKDIR /app/backend
COPY ./Server/package.json ./
RUN npm install
COPY ./Server ./

# Expose the backend port
EXPOSE 5000

# Command to run the backend application
CMD ["npx", "nodemon", "index.js"]
