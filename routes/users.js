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

export default router;
