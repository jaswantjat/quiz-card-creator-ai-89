import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    message: 'iMocha Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    uptime: process.uptime()
  });
});

// Database status endpoint with detailed debugging information
app.get('/api/status/database', async (req, res) => {
  try {
    const { getPool } = await import('./config/database.js');
    const pool = await getPool();

    // Test actual query
    const request = pool.request();
    const result = await request.query('SELECT 1 as test, GETDATE() as server_time');

    res.json({
      status: 'connected',
      message: 'Database connection is working',
      server_info: {
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        server_time: result.recordset[0].server_time,
        test_query: result.recordset[0].test
      },
      client_info: {
        railway_ip: req.ip,
        user_agent: req.get('User-Agent'),
        forwarded_for: req.get('X-Forwarded-For'),
        real_ip: req.get('X-Real-IP')
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database status check failed:', error.message);

    // Determine if it's a firewall issue
    const isFirewallError = error.message.includes('not allowed to access') ||
                           error.message.includes('firewall') ||
                           error.message.includes('IP address');

    res.status(503).json({
      status: 'disconnected',
      message: 'Database connection failed',
      error: error.message,
      error_type: error.code || 'UNKNOWN',
      is_firewall_issue: isFirewallError,
      client_info: {
        railway_ip: req.ip,
        user_agent: req.get('User-Agent'),
        forwarded_for: req.get('X-Forwarded-For'),
        real_ip: req.get('X-Real-IP')
      },
      server_config: {
        server: process.env.DB_SERVER,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT || '1433'
      },
      timestamp: new Date().toISOString(),
      suggestions: isFirewallError ? [
        '🔥 FIREWALL ISSUE DETECTED - Railway IP not whitelisted',
        '💡 RECOMMENDED SOLUTION:',
        '1. Go to Azure Portal → SQL servers → iqube-sql-jaswant → Networking',
        '2. Enable "Allow Azure services and resources to access this server"',
        '3. Save firewall rules and wait 2-3 minutes',
        '4. Test again at /api/status/database',
        '',
        '🔧 ALTERNATIVE (less reliable):',
        `5. Add specific IP range: ${req.ip} - ${req.ip}`,
        '6. Note: Railway IPs change frequently, so this may break again',
        '',
        '📊 TROUBLESHOOTING:',
        '- Run: npm run test-db (locally with same env vars)',
        '- Check: Azure SQL server status and firewall logs'
      ] : [
        '🔑 AUTHENTICATION/CONNECTION ISSUE',
        '💡 TROUBLESHOOTING STEPS:',
        '1. Verify database credentials in Railway environment variables',
        '2. Check Azure SQL server status',
        '3. Verify server name and database name',
        '4. Test connection locally: npm run test-db',
        '5. Check network connectivity',
        '6. Review Azure SQL server logs'
      ]
    });
  }
});

// Root endpoint - serve React app in production, fallback HTML in development
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // Serve React app index.html in production
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    // Serve fallback HTML in development
    res.setHeader('Content-Type', 'text/html');
    // Create the HTML content directly if file doesn't exist
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iMocha - AI Question Generator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #ff6b6b, #ffa500);
            border-radius: 20px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: white;
        }
        h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
        .subtitle { color: #666; margin-bottom: 30px; font-size: 16px; }
        .form-group { margin-bottom: 20px; text-align: left; }
        label { display: block; margin-bottom: 5px; color: #333; font-weight: 500; }
        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        input:focus { outline: none; border-color: #667eea; }
        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .switch-mode { margin-top: 20px; color: #666; }
        .switch-mode a { color: #667eea; text-decoration: none; font-weight: 600; }
        .test-section {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            text-align: left;
        }
        .test-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin: 5px;
        }
        .result { margin-top: 10px; padding: 10px; background: #e9ecef; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">iM</div>
        <h1>Welcome to iMocha</h1>
        <p class="subtitle">AI-Powered Question Generator for iMocha</p>

        <form id="authForm">
            <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" required>
            </div>
            <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Sign Up</button>
        </form>

        <div class="switch-mode">
            Already have an account? <a href="#" onclick="switchToLogin()">Sign In</a>
        </div>

        <div class="test-section">
            <h3>🚀 Test API Endpoints</h3>
            <button class="test-btn" onclick="testQuestionGeneration()">Test Question Generation</button>
            <button class="test-btn" onclick="testTopics()">Test Topics</button>
            <div id="testResult" class="result" style="display:none;"></div>
        </div>
    </div>

    <script>
        let isLoginMode = false;

        function switchToLogin() {
            isLoginMode = !isLoginMode;
            const firstNameGroup = document.querySelector('[for="firstName"]').parentElement;
            const lastNameGroup = document.querySelector('[for="lastName"]').parentElement;
            const submitBtn = document.querySelector('.btn');
            const switchText = document.querySelector('.switch-mode');

            if (isLoginMode) {
                firstNameGroup.style.display = 'none';
                lastNameGroup.style.display = 'none';
                submitBtn.textContent = 'Sign In';
                switchText.innerHTML = 'Don\\'t have an account? <a href="#" onclick="switchToLogin()">Sign Up</a>';
            } else {
                firstNameGroup.style.display = 'block';
                lastNameGroup.style.display = 'block';
                submitBtn.textContent = 'Sign Up';
                switchText.innerHTML = 'Already have an account? <a href="#" onclick="switchToLogin()">Sign In</a>';
            }
        }

        async function testQuestionGeneration() {
            const resultDiv = document.getElementById('testResult');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = 'Testing question generation...';

            try {
                const response = await fetch('/api/questions/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topicName: 'Business & AI',
                        count: 2,
                        difficulty: 'medium'
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    resultDiv.innerHTML = \`<strong>✅ Success!</strong><br>Generated \${result.questions.length} questions:<br>\${result.questions.map(q => '• ' + q.question).join('<br>')}\`;
                } else {
                    resultDiv.innerHTML = \`<strong>❌ Error:</strong> \${result.message}\`;
                }
            } catch (error) {
                resultDiv.innerHTML = \`<strong>❌ Network Error:</strong> \${error.message}\`;
            }
        }

        async function testTopics() {
            const resultDiv = document.getElementById('testResult');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = 'Testing topics endpoint...';

            try {
                const response = await fetch('/api/questions/topics');
                const result = await response.json();
                if (response.ok) {
                    resultDiv.innerHTML = \`<strong>✅ Success!</strong><br>Available topics:<br>\${result.topics.map(t => '• ' + t.name).join('<br>')}\`;
                } else {
                    resultDiv.innerHTML = \`<strong>❌ Error:</strong> \${result.message}\`;
                }
            } catch (error) {
                resultDiv.innerHTML = \`<strong>❌ Network Error:</strong> \${error.message}\`;
            }
        }

        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            alert('Authentication endpoints require database setup. Use the test buttons above to try the working features!');
        });
    </script>
</body>
</html>`;

    res.send(htmlContent);
  }
});

// Trust proxy for Railway deployment (must be before rate limiting)
app.set('trust proxy', 1);

// Security middleware with custom CSP for webhook and Lottie animations
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Vite in development
        "'unsafe-eval'", // Required for Lottie animations
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for styled components and CSS-in-JS
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:", // Allow all HTTPS images for flexibility
      ],
      connectSrc: [
        "'self'",
        // Webhook endpoint
        "https://primary-production-1cd8.up.railway.app",
        // Lottie animation source
        "https://lottie.host",
        // CDN sources for DotLottie WASM files
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        // Allow local development
        "http://localhost:*",
        "ws://localhost:*",
        "wss://localhost:*",
      ],
      mediaSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://lottie.host", // For Lottie animations
      ],
      objectSrc: ["'none'"],
      frameSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting with proper proxy trust configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  // Properly handle Railway's proxy setup
  trustProxy: true,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Log slow requests (>1s)
      console.log(`⚠️ Slow request: ${req.method} ${req.url} took ${duration}ms`);
    }
  });
  next();
});

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));



// Serve static files with proper caching headers for performance
if (process.env.NODE_ENV === 'production') {
  // CRITICAL: Serve static files BEFORE API routes to prevent conflicts

  // EMERGENCY FIX: Multiple image serving strategies for Railway

  // Strategy 1: Serve from dist/assets/images (Vite processed)
  app.use('/assets/images', express.static(path.join(__dirname, 'dist', 'assets', 'images'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      console.log(`🖼️ Serving image from dist/assets/images: ${filePath}`);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      if (ext === 'png') {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  }));

  // Strategy 2: Serve from dist/lovable-uploads (backup copy)
  app.use('/lovable-uploads', express.static(path.join(__dirname, 'dist', 'lovable-uploads'), {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      console.log(`🖼️ Serving image from dist/lovable-uploads: ${filePath}`);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      if (ext === 'png') {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  }));

  // Strategy 3: Serve from public/lovable-uploads (original location)
  app.use('/lovable-uploads', express.static(path.join(__dirname, 'public', 'lovable-uploads'), {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      console.log(`🖼️ Serving image from public/lovable-uploads: ${filePath}`);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      if (ext === 'png') {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  }));



  // Serve JS/CSS/Image assets from dist/assets
  app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      console.log(`📁 Serving asset: ${filePath}`);
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for images
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      } else if (filePath.endsWith('.gif')) {
        res.setHeader('Content-Type', 'image/gif');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      } else if (filePath.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  }));

  // Serve animations from dist/animations
  app.use('/animations', express.static(path.join(__dirname, 'dist', 'animations'), {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      console.log(`🎬 Serving animation: ${filePath}`);
      if (filePath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      }
      if (filePath.endsWith('.lottie')) {
        res.setHeader('Content-Type', 'application/zip');
      }
    }
  }));

  // Serve other static files (favicon, robots.txt, etc.)
  app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1h',
    etag: true,
    lastModified: true,
    index: false, // Don't serve index.html for directories
    setHeaders: (res, filePath) => {
      console.log(`📄 Serving static file: ${filePath}`);
      if (filePath.endsWith('.ico')) {
        res.setHeader('Content-Type', 'image/x-icon');
      }
      if (filePath.endsWith('.txt')) {
        res.setHeader('Content-Type', 'text/plain');
      }
    }
  }));
} else {
  // Serve public directory in development
  app.use(express.static('public'));

  // Serve animations from public/animations in development
  app.use('/animations', express.static(path.join(__dirname, 'public', 'animations'), {
    setHeaders: (res, filePath) => {
      console.log(`🎬 Serving animation from public (dev): ${filePath}`);
      if (filePath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      }
      if (filePath.endsWith('.lottie')) {
        res.setHeader('Content-Type', 'application/zip');
      }
    }
  }));

  // Also serve images from public/lovable-uploads in development
  app.use('/lovable-uploads', express.static(path.join(__dirname, 'public', 'lovable-uploads'), {
    setHeaders: (res, filePath) => {
      console.log(`🖼️ Serving image from public (dev): ${filePath}`);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      if (ext === 'png') {
        res.setHeader('Content-Type', 'image/png');
      }
    }
  }));
}

// Health check endpoint moved to top for Railway

// Simple question generation endpoint (no database required) with performance monitoring
app.post('/api/questions/generate', (req, res) => {
  const startTime = Date.now();
  try {
    const { topicName, count, difficulty } = req.body;
    console.log(`🤖 Question generation request: topic=${topicName}, count=${count}, difficulty=${difficulty}`);

    const duration = Date.now() - startTime;
    console.error(`❌ Question generation failed after ${duration}ms: Demo questions removed`);

    res.status(501).json({
      error: 'Question generation not implemented',
      message: 'This endpoint requires integration with an AI service for question generation. Demo questions have been removed.',
      details: 'Please use the webhook-based question generation service instead.',
      performance: {
        failed_after_ms: duration
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Question generation failed after ${duration}ms:`, error.message);
    res.status(500).json({
      error: 'Generation failed',
      message: error.message,
      performance: {
        failed_after_ms: duration
      }
    });
  }
});

// Simple topics endpoint (no database required)
app.get('/api/questions/topics', (req, res) => {
  res.status(501).json({
    error: 'Topics endpoint not implemented',
    message: 'Demo topics have been removed. Please use the database-backed topics endpoint.',
    topics: []
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes); // Database-dependent routes
app.use('/api/users', authenticateToken, userRoutes);

// Catch-all handler for React Router (must be after API routes and static files)
app.get('*', (req, res) => {
  // Skip static file requests - they should have been handled by express.static middleware above
  // If we reach here for a static file, it means the file doesn't exist
  if (req.url.startsWith('/assets/') ||
      req.url.startsWith('/lovable-uploads/') ||
      req.url.startsWith('/animations/') ||
      req.url.endsWith('.ico') ||
      req.url.endsWith('.png') ||
      req.url.endsWith('.jpg') ||
      req.url.endsWith('.jpeg') ||
      req.url.endsWith('.gif') ||
      req.url.endsWith('.svg') ||
      req.url.endsWith('.css') ||
      req.url.endsWith('.js') ||
      req.url.endsWith('.json') ||
      req.url.endsWith('.lottie') ||
      req.url.endsWith('.txt') ||
      req.url.endsWith('.xml')) {
    console.log(`❌ Static file not found: ${req.url}`);
    return res.status(404).send('File not found');
  }

  if (process.env.NODE_ENV === 'production') {
    // Serve React app for all non-API, non-static routes in production
    console.log(`📱 Serving React app for: ${req.url}`);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    // 404 for non-API routes in development
    res.status(404).json({
      error: 'Route not found',
      message: `The requested route ${req.originalUrl} does not exist.`,
      note: 'In development mode. In production, this would serve the React app.'
    });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server - CRITICAL: Bind to :: for Railway IPv6 compatibility
const server = app.listen(PORT, '::', () => {
  console.log(`🚀 iMocha Backend API running on port ${PORT}`);
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
