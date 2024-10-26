# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for both frontend and backend
COPY package.json ./
COPY Server/package.json ./Server/

# Install dependencies for both frontend and backend
RUN npm install
RUN npm install --prefix ./Server

# Copy the rest of your application code
COPY . .

# Build the frontend (assuming you have a build script defined in package.json)
RUN npm run build

# Prepare for production
FROM node:18-alpine

# Set the working directory in the production container
WORKDIR /app

# Copy built frontend files from the previous stage
COPY --from=build /app/build ./build
COPY --from=build /app/Server ./Server

# Install only the production dependencies for the backend
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --only=production

# Expose ports for backend and frontend
EXPOSE 5000 5173

# Start both backend and frontend
CMD ["sh", "-c", "npm start --prefix ./Server & npx serve build -l 5173"]
