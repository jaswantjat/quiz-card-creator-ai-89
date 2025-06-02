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
const PORT = process.env.PORT || 3001;

// Trust proxy for Railway deployment (fixes rate limiting)
app.set('trust proxy', true);

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

// Serve static files from public directory
app.use(express.static('public'));

// Root endpoint - serve frontend or redirect to signup
app.get('/', (req, res) => {
  // Check if we have a frontend build
  const path = './public/index.html';
  try {
    res.sendFile(path, { root: '.' });
  } catch (error) {
    // Fallback: redirect to a signup page or show API info
    res.status(200).json({
      message: 'iQube Backend API',
      frontend: 'Please deploy your frontend to access the signup page',
      api: {
        health: '/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login'
        },
        questions: {
          generate: 'POST /api/questions/generate',
          topics: 'GET /api/questions/topics'
        }
      },
      port: PORT
    });
  }
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

// Simple question generation endpoint (no database required)
app.post('/api/questions/generate', (req, res) => {
  try {
    const { topicName = "Business & AI", count = 3, difficulty = "medium" } = req.body;

    const questionSets = {
      "Business & AI": [
        "What are the key factors to consider when implementing AI in business?",
        "How can machine learning improve customer experience?",
        "What ethical considerations should guide AI development in business?",
        "How do you measure the ROI of AI implementations?",
        "What are the emerging trends in artificial intelligence for business?"
      ],
      "Technology & Innovation": [
        "How is emerging technology reshaping traditional industries?",
        "What role does innovation play in competitive advantage?",
        "How can organizations foster a culture of technological innovation?",
        "What are the challenges of digital transformation?",
        "How do you balance innovation with security concerns?"
      ],
      "Education & Learning": [
        "How can technology enhance personalized learning experiences?",
        "What are the most effective methods for skill development?",
        "How do you create engaging educational content?",
        "What role does feedback play in the learning process?",
        "How can we measure learning effectiveness?"
      ]
    };

    const topicQuestions = questionSets[topicName] || questionSets["Business & AI"];
    const selectedQuestions = topicQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map((questionText, index) => ({
        id: `q-${Date.now()}-${index}`,
        question: questionText,
        topic: topicName,
        difficulty: difficulty,
        questionType: 'text',
        generated: true
      }));

    res.json({
      message: 'Questions generated successfully',
      questions: selectedQuestions,
      topic: topicName,
      count: selectedQuestions.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Generation failed',
      message: error.message
    });
  }
});

// Simple topics endpoint (no database required)
app.get('/api/questions/topics', (req, res) => {
  const topics = [
    { id: 1, name: "Business & AI", description: "AI applications in business" },
    { id: 2, name: "Technology & Innovation", description: "Emerging technologies and innovation" },
    { id: 3, name: "Education & Learning", description: "Educational technology and learning methods" },
    { id: 4, name: "Health & Wellness", description: "Healthcare and wellness topics" },
    { id: 5, name: "Science & Research", description: "Scientific research and methodologies" }
  ];

  res.json({ topics });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes); // Database-dependent routes
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

  // Database connection (optional, non-blocking)
  setTimeout(async () => {
    try {
      // Only try to connect if we have database environment variables
      if (process.env.DB_SERVER && process.env.DB_DATABASE) {
        const { getPool } = await import('./config/database.js');
        await getPool();
        console.log('✅ Database connection verified');
      } else {
        console.log('ℹ️ Database environment variables not set - running in standalone mode');
      }
    } catch (error) {
      console.log('⚠️ Database connection failed (non-critical):', error.message);
      console.log('ℹ️ App will continue running without database features');
    }
  }, 5000); // Reduced delay
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
