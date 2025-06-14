import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: false, // Set to true for local dev / self-signed certs
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    try {
      poolPromise = new sql.ConnectionPool(config);
      await poolPromise.connect();
      console.log('✅ Connected to Azure SQL Database');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      poolPromise = null;
      throw error;
    }
  }
  return poolPromise;
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const pool = await getPool();
    
    // Create Users table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        email NVARCHAR(255) UNIQUE NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        first_name NVARCHAR(100),
        last_name NVARCHAR(100),
        daily_credits INT DEFAULT 10,
        last_credit_refresh DATETIME2 DEFAULT GETUTCDATE(),
        timezone NVARCHAR(50) DEFAULT 'UTC',
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE(),
        is_active BIT DEFAULT 1
      )
    `);

    // Create Topics table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='topics' AND xtype='U')
      CREATE TABLE topics (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(500),
        created_at DATETIME2 DEFAULT GETUTCDATE()
      )
    `);

    // Create Questions table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='questions' AND xtype='U')
      CREATE TABLE questions (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        topic_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES topics(id),
        question_text NVARCHAR(MAX) NOT NULL,
        options NVARCHAR(MAX), -- JSON string for MCQ options
        correct_answer INT, -- Index of correct answer for MCQ
        explanation NVARCHAR(MAX),
        difficulty NVARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
        question_type NVARCHAR(20) DEFAULT 'text' CHECK (question_type IN ('text', 'mcq')),
        created_at DATETIME2 DEFAULT GETUTCDATE()
      )
    `);

    // Create User_Questions table (saved questions)
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_questions' AND xtype='U')
      CREATE TABLE user_questions (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(id),
        question_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES questions(id),
        saved_at DATETIME2 DEFAULT GETUTCDATE(),
        UNIQUE(user_id, question_id)
      )
    `);

    // Create Question_Comments table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='question_comments' AND xtype='U')
      CREATE TABLE question_comments (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        question_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES questions(id) ON DELETE CASCADE,
        user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(id),
        comment_text NVARCHAR(MAX) NOT NULL,
        created_at DATETIME2 DEFAULT GETUTCDATE(),
        updated_at DATETIME2 DEFAULT GETUTCDATE()
      )
    `);

    // Create Credit_Transactions table for audit trail
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='credit_transactions' AND xtype='U')
      CREATE TABLE credit_transactions (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(id),
        transaction_type NVARCHAR(20) CHECK (transaction_type IN ('deduction', 'refresh', 'admin_adjustment')),
        amount INT NOT NULL,
        balance_after INT NOT NULL,
        description NVARCHAR(500),
        created_at DATETIME2 DEFAULT GETUTCDATE()
      )
    `);

    console.log('✅ Database tables initialized successfully');

    // Add credit fields to existing users table if they don't exist
    await migrateUserCredits(pool);

    // Insert default topics if they don't exist
    await insertDefaultTopics(pool);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

const insertDefaultTopics = async (pool) => {
  const topics = [
    { name: 'Business & AI', description: 'Questions about artificial intelligence in business contexts' },
    { name: 'Technology & Innovation', description: 'Questions about emerging technologies and innovation' },
    { name: 'Education & Learning', description: 'Questions about educational methods and learning processes' },
    { name: 'Health & Wellness', description: 'Questions about health, wellness, and healthcare' },
    { name: 'Science & Research', description: 'Questions about scientific research and methodologies' },
    { name: 'Marketing & Sales', description: 'Questions about marketing strategies and sales techniques' },
    { name: 'Leadership & Management', description: 'Questions about leadership and management practices' },
    { name: 'Creative Writing', description: 'Questions about creative writing techniques and processes' },
    { name: 'Philosophy & Ethics', description: 'Questions about philosophical concepts and ethical considerations' },
    { name: 'Environment & Sustainability', description: 'Questions about environmental issues and sustainability' }
  ];

  for (const topic of topics) {
    try {
      await pool.request()
        .input('name', sql.NVarChar, topic.name)
        .input('description', sql.NVarChar, topic.description)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM topics WHERE name = @name)
          INSERT INTO topics (name, description) VALUES (@name, @description)
        `);
    } catch (error) {
      console.error(`Error inserting topic ${topic.name}:`, error.message);
    }
  }
  
  console.log('✅ Default topics inserted successfully');
};

// Migration function to add credit fields to existing users
const migrateUserCredits = async (pool) => {
  try {
    // Check if credit fields already exist
    const columnCheck = await pool.request().query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME IN ('daily_credits', 'last_credit_refresh', 'timezone')
    `);

    const existingColumns = columnCheck.recordset.map(row => row.COLUMN_NAME);

    // Add missing credit columns
    if (!existingColumns.includes('daily_credits')) {
      await pool.request().query(`
        ALTER TABLE users ADD daily_credits INT DEFAULT 10
      `);
      console.log('✅ Added daily_credits column to users table');
    }

    if (!existingColumns.includes('last_credit_refresh')) {
      await pool.request().query(`
        ALTER TABLE users ADD last_credit_refresh DATETIME2 DEFAULT GETUTCDATE()
      `);
      console.log('✅ Added last_credit_refresh column to users table');
    }

    if (!existingColumns.includes('timezone')) {
      await pool.request().query(`
        ALTER TABLE users ADD timezone NVARCHAR(50) DEFAULT 'UTC'
      `);
      console.log('✅ Added timezone column to users table');
    }

    // Initialize credit values for existing users who don't have them set
    await pool.request().query(`
      UPDATE users
      SET daily_credits = 10,
          last_credit_refresh = GETUTCDATE(),
          timezone = 'UTC'
      WHERE daily_credits IS NULL OR last_credit_refresh IS NULL OR timezone IS NULL
    `);

    console.log('✅ Credit migration completed successfully');
  } catch (error) {
    console.error('❌ Credit migration failed:', error.message);
    // Don't throw error to prevent app startup failure
  }
};

export { getPool, initializeDatabase };
export default sql;
