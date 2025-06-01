# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["npm", "start"]
