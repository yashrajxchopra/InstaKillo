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

# Expose the frontend port
EXPOSE 5173

# Command to run your application
CMD ["npm", "run", "dev"]  # Adjust as necessary for your setup
