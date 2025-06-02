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

    console.log('✅ Database tables initialized successfully');
    
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

export { getPool, initializeDatabase };
export default sql;
