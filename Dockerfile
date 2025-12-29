# Use official Node.js LTS image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose port (update if your app uses a different port)
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
