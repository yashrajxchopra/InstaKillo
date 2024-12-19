# Use an official Node.js runtime as a parent image
FROM node:20-alpine as build

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

# Copy the build output to the NGINX web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]