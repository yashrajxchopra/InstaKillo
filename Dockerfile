# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Install build dependencies for native modules
RUN apk add --no-cache \
    bash \
    git \
    gcc \
    g++ \
    make

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install all dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the frontend port
EXPOSE 5173

# Command to run your application using npm run dev
CMD ["npm", "run", "dev"]