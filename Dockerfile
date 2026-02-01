# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd backend && npm install --legacy-peer-deps
RUN cd frontend && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy backend files and built frontend
COPY backend/ ./backend/
COPY --from=builder /app/frontend/dist ./frontend/dist

# Install only production dependencies
RUN cd backend && npm install --only=production --legacy-peer-deps

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S medvault -u 1001

# Change ownership
RUN chown -R medvault:nodejs /app
USER medvault

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "backend/server.js"]