# Multi-stage Dockerfile for ShareIt

# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm install --production --legacy-peer-deps
RUN cp -R node_modules prod_node_modules
RUN npm install --legacy-peer-deps

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build:web

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy production dependencies
COPY --from=dependencies /app/prod_node_modules ./node_modules

# Copy built application
COPY --from=build /app/web-build ./web-build
COPY --from=build /app/package.json ./

# Copy port detection script
COPY docker/port-detector.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/port-detector.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port (will be overridden by docker-compose)
EXPOSE 4847

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["/bin/sh", "-c", "serve -s web-build -l ${PORT:-4847}"]

# Stage 4: Development
FROM node:18-alpine AS development
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ git bash curl

# Install ngrok globally for tunnel mode
RUN npm install -g @expo/ngrok@^4.1.0

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Expose ports for development
EXPOSE 4847 19000 19001

# Development command
CMD ["npm", "start"]