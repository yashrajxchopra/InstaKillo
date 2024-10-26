# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache \
    bash \
    git \
    gcc \
    g++ \
    make

# Set the working directory for the entire application
WORKDIR /app

# Copy frontend package.json and install dependencies
COPY package.json  ./frontend/
RUN npm install --prefix ./frontend

# Copy backend package.json and install dependencies
COPY ./Server/package.json ./backend/
RUN npm install --prefix ./backend

# Copy the rest of the application code
COPY . .

# Install concurrently to run both frontend and backend
RUN npm install --prefix ./frontend concurrently

# Expose the ports for both services
EXPOSE 5173 5000

# Command to run both applications using concurrently
CMD ["npx", "concurrently", "npm run dev --prefix ./frontend", "node --prefix ./backend index.js"]
