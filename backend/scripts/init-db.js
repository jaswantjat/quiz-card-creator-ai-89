import { initializeDatabase } from '../config/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function initDB() {
  try {
    console.log('🚀 Starting database initialization...');
    await initializeDatabase();
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDB();
