# Production Dockerfile for Google Cloud Run
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Cloud Run defaults to PORT 8080
ENV PORT=8080
ENV NODE_ENV=production

# Expose container port
EXPOSE 8080

# Run backend service
CMD ["node", "server.js"]
