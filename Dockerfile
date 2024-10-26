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
RUN cd ./frontend/
RUN npm install

# Copy backend package.json and install dependencies
RUN cd ..
COPY ./Server/package.json ./backend/
RUN cd ./backend
RUN npm install 

# Copy the rest of the application code
RUN cd ..
COPY . .

# Install concurrently to run both frontend and backend
RUN cd ./frontend
RUN npm install concurrently

# Expose the ports for both services
RUN cd ..
EXPOSE 5173 5000

# Command to run both applications using concurrently
CMD ["npx", "concurrently", "npm run dev --prefix ./frontend", "node ./backend index.js"]
