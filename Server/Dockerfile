# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to run your application
CMD ["nodemon", "index.js"]
