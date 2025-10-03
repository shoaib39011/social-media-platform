FROM node:20-alpine

# Update Alpine packages to fix vulnerabilities
RUN apk update && apk upgrade

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Set environment variables for database configuration
ENV PORT=3001

# Command to run the application
CMD ["node", "src/server.js"]

