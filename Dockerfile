# Use Node.js 18 LTS
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy backend package files first for better caching
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --omit=dev && npm cache clean --force

# Copy backend source code
COPY backend/ ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

# Expose port (Railway will set PORT env var dynamically)
EXPOSE $PORT

# Health check with dynamic port support
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3001}/health || exit 1

# Start the application with ESM support
CMD ["npm", "run", "railway:start"]
