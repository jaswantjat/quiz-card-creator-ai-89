import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { getPool } from '../config/database.js';
import sql from 'mssql';

const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Get current user profile
router.get('/profile', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT
          id,
          email,
          first_name,
          last_name,
          daily_credits,
          last_credit_refresh,
          timezone,
          created_at,
          (SELECT COUNT(*) FROM user_questions WHERE user_id = @userId) as saved_questions_count
        FROM users
        WHERE id = @userId AND is_active = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    const user = result.recordset[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        dailyCredits: user.daily_credits,
        lastCreditRefresh: user.last_credit_refresh,
        timezone: user.timezone,
        createdAt: user.created_at,
        savedQuestionsCount: user.saved_questions_count
      }
    });

  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const userId = req.user.id;
    const { firstName, lastName, email } = value;

    const pool = await getPool();

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await pool.request()
        .input('email', sql.NVarChar, email.toLowerCase())
        .input('userId', sql.UniqueIdentifier, userId)
        .query('SELECT id FROM users WHERE email = @email AND id != @userId');

      if (emailCheck.recordset.length > 0) {
        return res.status(409).json({
          error: 'Email already taken',
          message: 'This email is already associated with another account'
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const request = pool.request().input('userId', sql.UniqueIdentifier, userId);

    if (firstName !== undefined) {
      updates.push('first_name = @firstName');
      request.input('firstName', sql.NVarChar, firstName);
    }

    if (lastName !== undefined) {
      updates.push('last_name = @lastName');
      request.input('lastName', sql.NVarChar, lastName);
    }

    if (email !== undefined) {
      updates.push('email = @email');
      request.input('email', sql.NVarChar, email.toLowerCase());
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No updates provided',
        message: 'At least one field must be provided for update'
      });
    }

    updates.push('updated_at = GETUTCDATE()');

    const result = await request.query(`
      UPDATE users 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.id, INSERTED.email, INSERTED.first_name, INSERTED.last_name, INSERTED.updated_at
      WHERE id = @userId AND is_active = 1
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found or inactive'
      });
    }

    const updatedUser = result.recordset[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        updatedAt: updatedUser.updated_at
      }
    });

  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = value;

    const pool = await getPool();

    // Get current password hash
    const userResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query('SELECT password_hash FROM users WHERE id = @userId AND is_active = 1');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found or inactive'
      });
    }

    const user = userResult.recordset[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('passwordHash', sql.NVarChar, newPasswordHash)
      .query(`
        UPDATE users 
        SET password_hash = @passwordHash, updated_at = GETUTCDATE()
        WHERE id = @userId
      `);

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT 
          COUNT(uq.id) as total_saved_questions,
          COUNT(DISTINCT q.topic_id) as topics_explored,
          MIN(uq.saved_at) as first_question_saved,
          MAX(uq.saved_at) as last_question_saved
        FROM user_questions uq
        JOIN questions q ON uq.question_id = q.id
        WHERE uq.user_id = @userId
      `);

    const stats = result.recordset[0];

    // Get questions by difficulty
    const difficultyResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT 
          q.difficulty,
          COUNT(*) as count
        FROM user_questions uq
        JOIN questions q ON uq.question_id = q.id
        WHERE uq.user_id = @userId
        GROUP BY q.difficulty
      `);

    // Get questions by topic
    const topicResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT 
          t.name as topic_name,
          COUNT(*) as count
        FROM user_questions uq
        JOIN questions q ON uq.question_id = q.id
        JOIN topics t ON q.topic_id = t.id
        WHERE uq.user_id = @userId
        GROUP BY t.name
        ORDER BY count DESC
      `);

    res.json({
      stats: {
        totalSavedQuestions: stats.total_saved_questions || 0,
        topicsExplored: stats.topics_explored || 0,
        firstQuestionSaved: stats.first_question_saved,
        lastQuestionSaved: stats.last_question_saved
      },
      questionsByDifficulty: difficultyResult.recordset,
      questionsByTopic: topicResult.recordset
    });

  } catch (error) {
    next(error);
  }
});

// Delete user account (soft delete)
router.delete('/account', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pool = await getPool();

    // Soft delete user account
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        UPDATE users 
        SET is_active = 0, updated_at = GETUTCDATE()
        WHERE id = @userId AND is_active = 1
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found or already deactivated'
      });
    }

    res.json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Get user credits
router.get('/credits', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT daily_credits, last_credit_refresh, timezone
        FROM users
        WHERE id = @userId AND is_active = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found or inactive'
      });
    }

    const user = result.recordset[0];

    res.json({
      credits: user.daily_credits,
      lastRefresh: user.last_credit_refresh,
      timezone: user.timezone
    });

  } catch (error) {
    next(error);
  }
});

// Refresh user credits (manual or automatic)
router.post('/credits/refresh', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pool = await getPool();

    // Get current user data
    const userResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT daily_credits, last_credit_refresh, timezone
        FROM users
        WHERE id = @userId AND is_active = 1
      `);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found or inactive'
      });
    }

    const user = userResult.recordset[0];
    const userTimezone = user.timezone || 'UTC';
    const now = new Date();

    // Calculate if it's been 24 hours since last refresh in user's timezone
    const lastRefresh = new Date(user.last_credit_refresh);
    const timeDiff = now.getTime() - lastRefresh.getTime();
    const hoursSinceRefresh = timeDiff / (1000 * 60 * 60);

    // Allow refresh if it's been more than 20 hours (to account for timezone differences)
    // or if this is a manual refresh and user has 0 credits
    const canRefresh = hoursSinceRefresh >= 20 || user.daily_credits === 0;

    if (!canRefresh) {
      return res.status(429).json({
        error: 'Refresh not available',
        message: 'Credits can only be refreshed once per day',
        nextRefreshAvailable: new Date(lastRefresh.getTime() + (24 * 60 * 60 * 1000)),
        hoursUntilRefresh: Math.ceil(24 - hoursSinceRefresh)
      });
    }

    // Refresh credits to 10 and update timestamp
    const refreshResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        UPDATE users
        SET daily_credits = 10,
            last_credit_refresh = GETUTCDATE(),
            updated_at = GETUTCDATE()
        OUTPUT INSERTED.daily_credits, INSERTED.last_credit_refresh
        WHERE id = @userId AND is_active = 1
      `);

    const updatedUser = refreshResult.recordset[0];

    // Log the credit refresh transaction
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('amount', sql.Int, 10)
      .input('balanceAfter', sql.Int, 10)
      .input('description', sql.NVarChar, 'Daily credit refresh')
      .query(`
        INSERT INTO credit_transactions (user_id, transaction_type, amount, balance_after, description)
        VALUES (@userId, 'refresh', @amount, @balanceAfter, @description)
      `);

    res.json({
      message: 'Credits refreshed successfully',
      credits: updatedUser.daily_credits,
      lastRefresh: updatedUser.last_credit_refresh,
      refreshedAt: now.toISOString()
    });

  } catch (error) {
    next(error);
  }
});

// Get credit transaction history
router.get('/credits/history', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('limit', sql.Int, Math.min(limit, 100)) // Cap at 100 records
      .query(`
        SELECT TOP (@limit)
          id,
          transaction_type,
          amount,
          balance_after,
          description,
          created_at
        FROM credit_transactions
        WHERE user_id = @userId
        ORDER BY created_at DESC
      `);

    res.json({
      transactions: result.recordset.map(transaction => ({
        id: transaction.id,
        type: transaction.transaction_type,
        amount: transaction.amount,
        balanceAfter: transaction.balance_after,
        description: transaction.description,
        createdAt: transaction.created_at
      })),
      total: result.recordset.length
    });

  } catch (error) {
    next(error);
  }
});

// Update user timezone
router.put('/timezone', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { timezone } = req.body;

    // Basic timezone validation
    if (!timezone || typeof timezone !== 'string') {
      return res.status(400).json({
        error: 'Invalid timezone',
        message: 'Timezone must be a valid string'
      });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('timezone', sql.NVarChar, timezone)
      .query(`
        UPDATE users
        SET timezone = @timezone, updated_at = GETUTCDATE()
        OUTPUT INSERTED.timezone
        WHERE id = @userId AND is_active = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found or inactive'
      });
    }

    res.json({
      message: 'Timezone updated successfully',
      timezone: result.recordset[0].timezone
    });

  } catch (error) {
    next(error);
  }
});

// Deduct credits (for question generation)
router.post('/credits/deduct', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, description } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Amount must be a positive number'
      });
    }

    const pool = await getPool();

    // Get current credits
    const userResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT daily_credits
        FROM users
        WHERE id = @userId AND is_active = 1
      `);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found or inactive'
      });
    }

    const currentCredits = userResult.recordset[0].daily_credits;

    if (currentCredits < amount) {
      return res.status(400).json({
        error: 'Insufficient credits',
        message: `You have ${currentCredits} credits but need ${amount}`,
        currentCredits,
        requiredCredits: amount
      });
    }

    const newBalance = currentCredits - amount;

    // Deduct credits atomically
    const deductResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('newBalance', sql.Int, newBalance)
      .query(`
        UPDATE users
        SET daily_credits = @newBalance, updated_at = GETUTCDATE()
        OUTPUT INSERTED.daily_credits
        WHERE id = @userId AND is_active = 1 AND daily_credits >= ${amount}
      `);

    if (deductResult.recordset.length === 0) {
      return res.status(409).json({
        error: 'Credit deduction failed',
        message: 'Credits may have been modified by another request. Please try again.'
      });
    }

    // Log the transaction
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('amount', sql.Int, -amount)
      .input('balanceAfter', sql.Int, newBalance)
      .input('description', sql.NVarChar, description || 'Question generation')
      .query(`
        INSERT INTO credit_transactions (user_id, transaction_type, amount, balance_after, description)
        VALUES (@userId, 'deduction', @amount, @balanceAfter, @description)
      `);

    res.json({
      message: 'Credits deducted successfully',
      creditsDeducted: amount,
      remainingCredits: newBalance,
      description: description || 'Question generation'
    });

  } catch (error) {
    next(error);
  }
});

export default router;
