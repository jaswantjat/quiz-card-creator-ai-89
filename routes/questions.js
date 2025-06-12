import express from 'express';
import Joi from 'joi';
import { getPool } from '../config/database.js';
import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const generateQuestionsSchema = Joi.object({
  topicName: Joi.string().required(),
  count: Joi.number().integer().min(1).max(10).default(3),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
  questionType: Joi.string().valid('text', 'mcq').default('text')
});

const saveQuestionSchema = Joi.object({
  questionText: Joi.string().required(),
  topicName: Joi.string().required(),
  options: Joi.array().items(Joi.string()).optional(),
  correctAnswer: Joi.number().integer().optional(),
  explanation: Joi.string().optional(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  questionType: Joi.string().valid('text', 'mcq').default('text')
});



// Generate questions endpoint
router.post('/generate', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = generateQuestionsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    // Return error - no demo questions available
    return res.status(501).json({
      error: 'Question generation not implemented',
      message: 'This endpoint requires integration with an AI service for question generation. Demo questions have been removed.',
      details: 'Please use the webhook-based question generation service instead.'
    });

  } catch (error) {
    next(error);
  }
});

// Save question to database (requires authentication)
router.post('/save', authenticateToken, async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = saveQuestionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const { questionText, topicName, options, correctAnswer, explanation, difficulty, questionType } = value;
    const userId = req.user.id;

    const pool = await getPool();

    // Get or create topic
    let topicResult = await pool.request()
      .input('topicName', sql.NVarChar, topicName)
      .query('SELECT id FROM topics WHERE name = @topicName');

    let topicId;
    if (topicResult.recordset.length === 0) {
      // Create new topic
      const newTopicResult = await pool.request()
        .input('topicName', sql.NVarChar, topicName)
        .query(`
          INSERT INTO topics (name, description)
          OUTPUT INSERTED.id
          VALUES (@topicName, 'User-created topic')
        `);
      topicId = newTopicResult.recordset[0].id;
    } else {
      topicId = topicResult.recordset[0].id;
    }

    // Save question
    const questionResult = await pool.request()
      .input('topicId', sql.UniqueIdentifier, topicId)
      .input('questionText', sql.NVarChar, questionText)
      .input('options', sql.NVarChar, options ? JSON.stringify(options) : null)
      .input('correctAnswer', sql.Int, correctAnswer || null)
      .input('explanation', sql.NVarChar, explanation || null)
      .input('difficulty', sql.NVarChar, difficulty)
      .input('questionType', sql.NVarChar, questionType)
      .query(`
        INSERT INTO questions (topic_id, question_text, options, correct_answer, explanation, difficulty, question_type)
        OUTPUT INSERTED.id, INSERTED.created_at
        VALUES (@topicId, @questionText, @options, @correctAnswer, @explanation, @difficulty, @questionType)
      `);

    const questionId = questionResult.recordset[0].id;

    // Link question to user
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('questionId', sql.UniqueIdentifier, questionId)
      .query(`
        INSERT INTO user_questions (user_id, question_id)
        VALUES (@userId, @questionId)
      `);

    res.status(201).json({
      message: 'Question saved successfully',
      questionId: questionId,
      createdAt: questionResult.recordset[0].created_at
    });

  } catch (error) {
    next(error);
  }
});

// Get user's saved questions (requires authentication)
router.get('/saved', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const pool = await getPool();

    // Get total count
    const countResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .query(`
        SELECT COUNT(*) as total
        FROM user_questions uq
        WHERE uq.user_id = @userId
      `);

    const total = countResult.recordset[0].total;

    // Get questions with pagination
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT 
          q.id,
          q.question_text,
          q.options,
          q.correct_answer,
          q.explanation,
          q.difficulty,
          q.question_type,
          q.created_at,
          t.name as topic_name,
          uq.saved_at
        FROM user_questions uq
        JOIN questions q ON uq.question_id = q.id
        JOIN topics t ON q.topic_id = t.id
        WHERE uq.user_id = @userId
        ORDER BY uq.saved_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    const questions = result.recordset.map(q => ({
      id: q.id,
      questionText: q.question_text,
      options: q.options ? JSON.parse(q.options) : null,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      questionType: q.question_type,
      topicName: q.topic_name,
      createdAt: q.created_at,
      savedAt: q.saved_at
    }));

    res.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get all topics
router.get('/topics', async (req, res, next) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .query(`
        SELECT id, name, description, created_at
        FROM topics
        ORDER BY name
      `);

    res.json({
      topics: result.recordset
    });

  } catch (error) {
    next(error);
  }
});

export default router;
