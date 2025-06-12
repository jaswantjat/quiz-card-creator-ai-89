import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import userRoutes from './routes/users.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// CRITICAL: Health check MUST be first - no middleware before this
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({
    status: 'OK',
    message: 'iQube Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    uptime: process.uptime()
  });
});

// Root endpoint for debugging
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'iQube Backend API',
    health: '/health',
    port: PORT
  });
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint moved to top for Railway

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', authenticateToken, questionRoutes);
app.use('/api/users', authenticateToken, userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist.`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server - CRITICAL: Bind to :: for Railway IPv6 compatibility
const server = app.listen(PORT, '::', () => {
  console.log(`🚀 iQube Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Server running at http://[::]:${PORT}`);
  console.log(`🔗 Health check: http://[::]:${PORT}/health`);

  // Immediate health check test
  console.log('🧪 Testing health endpoint...');
  import('http').then(http => {
    const req = http.get(`http://localhost:${PORT}/health`, (res) => {
      console.log(`✅ Health check test: ${res.statusCode}`);
    });
    req.on('error', (err) => {
      console.log(`❌ Health check test failed: ${err.message}`);
    });
  });

  // Database connection (non-blocking, after server is ready)
  if (process.env.NODE_ENV === 'production') {
    setTimeout(async () => {
      try {
        const { getPool } = await import('./config/database.js');
        await getPool();
        console.log('✅ Database connection verified');
      } catch (error) {
        console.log('⚠️ Database connection failed (non-critical):', error.message);
      }
    }, 15000); // Increased delay for Railway
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
