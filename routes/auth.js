import express from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { getPool } from '../config/database.js';
import { generateToken } from '../middleware/auth.js';
import sql from 'mssql';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register endpoint
router.post('/register', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const { email, password, firstName, lastName } = value;

    // Try to get database connection
    let pool;
    try {
      pool = await getPool();
    } catch (dbError) {
      console.error('Database connection failed during registration:', dbError.message);
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Database connection is currently unavailable. Please try the question generation features without logging in, or contact support if this issue persists.',
        code: 'DATABASE_UNAVAILABLE'
      });
    }

    // Check if user already exists
    const existingUser = await pool.request()
      .input('email', sql.NVarChar, email.toLowerCase())
      .query('SELECT id FROM users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with explicit credit initialization
    const result = await pool.request()
      .input('email', sql.NVarChar, email.toLowerCase())
      .input('passwordHash', sql.NVarChar, passwordHash)
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .query(`
        INSERT INTO users (email, password_hash, first_name, last_name, daily_credits, last_credit_refresh, timezone)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.first_name, INSERTED.last_name, INSERTED.daily_credits, INSERTED.last_credit_refresh, INSERTED.timezone, INSERTED.created_at
        VALUES (@email, @passwordHash, @firstName, @lastName, 10, GETUTCDATE(), 'UTC')
      `);

    const newUser = result.recordset[0];

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        dailyCredits: newUser.daily_credits,
        lastCreditRefresh: newUser.last_credit_refresh,
        timezone: newUser.timezone,
        createdAt: newUser.created_at
      },
      token
    });

  } catch (error) {
    next(error);
  }
});

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const { email, password } = value;

    // Try to get database connection
    let pool;
    try {
      pool = await getPool();
    } catch (dbError) {
      console.error('Database connection failed during login:', dbError.message);
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Database connection is currently unavailable. Please try the question generation features without logging in, or contact support if this issue persists.',
        code: 'DATABASE_UNAVAILABLE'
      });
    }

    // Find user
    const result = await pool.request()
      .input('email', sql.NVarChar, email.toLowerCase())
      .query(`
        SELECT id, email, password_hash, first_name, last_name, daily_credits, last_credit_refresh, timezone, is_active
        FROM users
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    const user = result.recordset[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account disabled',
        message: 'Your account has been disabled. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        dailyCredits: user.daily_credits,
        lastCreditRefresh: user.last_credit_refresh,
        timezone: user.timezone
      },
      token
    });

  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // This will be handled by the authenticateToken middleware when used
    res.json({
      message: 'This endpoint requires authentication middleware'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
