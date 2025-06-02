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

// Predefined question sets (same as frontend)
const questionSets = {
  "Business & AI": [
    "What are the key factors to consider when implementing AI in business?",
    "How can machine learning improve customer experience?",
    "What ethical considerations should guide AI development in business?",
    "How do you measure the ROI of AI implementations?",
    "What are the emerging trends in artificial intelligence for business?",
    "How can AI help in decision-making processes?",
    "What are the challenges of integrating AI with existing business systems?",
    "How does AI impact workforce management and employment?"
  ],
  "Technology & Innovation": [
    "How is emerging technology reshaping traditional industries?",
    "What role does innovation play in competitive advantage?",
    "How can organizations foster a culture of technological innovation?",
    "What are the challenges of digital transformation?",
    "How do you balance innovation with security concerns?",
    "What are the key drivers of technological disruption?",
    "How can companies stay ahead in rapidly evolving tech landscapes?",
    "What role does open-source technology play in innovation?"
  ],
  "Education & Learning": [
    "How can technology enhance personalized learning experiences?",
    "What are the most effective methods for skill development?",
    "How do you create engaging educational content?",
    "What role does feedback play in the learning process?",
    "How can we measure learning effectiveness?",
    "What are the benefits of collaborative learning environments?",
    "How can gamification improve educational outcomes?",
    "What challenges do educators face in digital learning environments?"
  ],
  "Health & Wellness": [
    "What are the key components of a holistic wellness approach?",
    "How can technology improve healthcare accessibility?",
    "What role does mental health play in overall wellness?",
    "How can we promote preventive healthcare practices?",
    "What are the challenges in healthcare innovation?",
    "How does lifestyle impact long-term health outcomes?",
    "What are the benefits of telemedicine and remote healthcare?",
    "How can data analytics improve patient care?"
  ],
  "Science & Research": [
    "What methodologies ensure research reliability and validity?",
    "How do you approach interdisciplinary research collaboration?",
    "What are the ethical considerations in scientific research?",
    "How can research findings be effectively communicated to the public?",
    "What role does peer review play in scientific advancement?",
    "How can technology accelerate scientific discovery?",
    "What are the challenges of reproducibility in research?",
    "How do you manage research data and ensure its integrity?"
  ],
  "Marketing & Sales": [
    "How has digital marketing transformed customer engagement?",
    "What are the key metrics for measuring marketing success?",
    "How do you build authentic brand relationships?",
    "What role does data analytics play in sales strategies?",
    "How can businesses adapt to changing consumer behaviors?",
    "What are the most effective content marketing strategies?",
    "How do you optimize the customer journey and conversion funnel?",
    "What impact does social media have on brand perception?"
  ],
  "Leadership & Management": [
    "What qualities define effective leadership in the modern workplace?",
    "How do you manage and motivate remote teams?",
    "What are the challenges of organizational change management?",
    "How can leaders foster innovation within their teams?",
    "What role does emotional intelligence play in leadership?",
    "How do you build and maintain high-performing teams?",
    "What strategies help in conflict resolution and team dynamics?",
    "How can leaders adapt to rapidly changing business environments?"
  ],
  "Creative Writing": [
    "What techniques help develop compelling characters?",
    "How do you maintain consistency in world-building?",
    "What are effective methods for overcoming writer's block?",
    "How do you balance plot development with character growth?",
    "What role does research play in creative writing?",
    "How can writers develop their unique voice and style?",
    "What are the key elements of effective dialogue?",
    "How do you structure a narrative for maximum impact?"
  ],
  "Philosophy & Ethics": [
    "How do ethical frameworks guide decision-making?",
    "What is the relationship between individual rights and collective good?",
    "How do cultural perspectives influence ethical reasoning?",
    "What are the philosophical implications of artificial intelligence?",
    "How do we navigate moral dilemmas in complex situations?",
    "What role does virtue ethics play in modern society?",
    "How can philosophical thinking improve critical reasoning?",
    "What are the ethical considerations in emerging technologies?"
  ],
  "Environment & Sustainability": [
    "What are the most effective strategies for environmental conservation?",
    "How can businesses integrate sustainability into their operations?",
    "What role does individual action play in environmental protection?",
    "How do we balance economic growth with environmental responsibility?",
    "What are the challenges of implementing renewable energy solutions?",
    "How can technology help address climate change?",
    "What are the benefits of circular economy principles?",
    "How do environmental policies impact business and society?"
  ]
};

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

    const { topicName, count, difficulty, questionType } = value;

    // Get questions from predefined sets
    const topicQuestions = questionSets[topicName] || questionSets["Business & AI"];
    const selectedQuestions = topicQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map(questionText => ({
        id: uuidv4(),
        question: questionText,
        topic: topicName,
        difficulty: difficulty || 'medium',
        questionType: questionType || 'text',
        generated: true
      }));

    res.json({
      message: 'Questions generated successfully',
      questions: selectedQuestions,
      topic: topicName,
      count: selectedQuestions.length
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
