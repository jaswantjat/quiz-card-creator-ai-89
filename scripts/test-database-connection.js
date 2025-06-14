#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the Azure SQL database connection and provides detailed
 * diagnostic information for troubleshooting Railway deployment issues.
 * 
 * Usage:
 *   node scripts/test-database-connection.js
 * 
 * Environment Variables Required:
 *   - DB_SERVER: Azure SQL server name
 *   - DB_DATABASE: Database name
 *   - DB_USER: Database username
 *   - DB_PASSWORD: Database password
 */

import { getPool } from '../config/database.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

async function testDatabaseConnection() {
  logSection('🔍 DATABASE CONNECTION TEST');
  
  try {
    // Check environment variables
    logSection('📋 Environment Configuration');
    const requiredVars = ['DB_SERVER', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      log(`❌ Missing environment variables: ${missingVars.join(', ')}`, 'red');
      log('💡 Make sure to set these in your .env file or Railway environment variables', 'yellow');
      process.exit(1);
    }
    
    log('✅ All required environment variables are set', 'green');
    log(`📍 Server: ${process.env.DB_SERVER}`, 'blue');
    log(`📍 Database: ${process.env.DB_DATABASE}`, 'blue');
    log(`📍 User: ${process.env.DB_USER}`, 'blue');
    log(`📍 Port: ${process.env.DB_PORT || '1433'}`, 'blue');
    
    // Test database connection
    logSection('🔌 Testing Database Connection');
    log('⏳ Attempting to connect to Azure SQL Database...', 'yellow');
    
    const startTime = Date.now();
    const pool = await getPool();
    const connectionTime = Date.now() - startTime;
    
    log(`✅ Database connection successful! (${connectionTime}ms)`, 'green');
    
    // Test basic query
    logSection('🧪 Testing Database Query');
    log('⏳ Executing test query...', 'yellow');
    
    const queryStartTime = Date.now();
    const request = pool.request();
    const result = await request.query(`
      SELECT 
        1 as test_value,
        GETDATE() as server_time,
        @@VERSION as sql_version,
        DB_NAME() as current_database,
        USER_NAME() as current_user
    `);
    const queryTime = Date.now() - queryStartTime;
    
    log(`✅ Query executed successfully! (${queryTime}ms)`, 'green');
    
    const row = result.recordset[0];
    log(`📊 Test Value: ${row.test_value}`, 'blue');
    log(`🕐 Server Time: ${row.server_time}`, 'blue');
    log(`💾 Database: ${row.current_database}`, 'blue');
    log(`👤 User: ${row.current_user}`, 'blue');
    log(`🔧 SQL Version: ${row.sql_version.substring(0, 50)}...`, 'blue');
    
    // Test table existence
    logSection('📋 Checking Database Schema');
    log('⏳ Checking for required tables...', 'yellow');
    
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);
    
    const tables = tablesResult.recordset.map(row => row.TABLE_NAME);
    const requiredTables = ['users', 'topics', 'questions', 'user_questions', 'credit_transactions'];
    const existingTables = requiredTables.filter(table => tables.includes(table));
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    log(`📊 Found ${tables.length} tables in database`, 'blue');
    
    if (existingTables.length > 0) {
      log(`✅ Existing required tables: ${existingTables.join(', ')}`, 'green');
    }
    
    if (missingTables.length > 0) {
      log(`⚠️  Missing tables: ${missingTables.join(', ')}`, 'yellow');
      log(`💡 Run 'npm run init-db' to create missing tables`, 'yellow');
    }
    
    // Success summary
    logSection('🎉 Connection Test Summary');
    log('✅ Database connection: SUCCESS', 'green');
    log('✅ Query execution: SUCCESS', 'green');
    log('✅ Schema check: COMPLETED', 'green');
    log(`⚡ Total test time: ${Date.now() - startTime}ms`, 'blue');
    
    if (missingTables.length === 0) {
      log('🚀 Database is ready for production use!', 'green');
    } else {
      log('⚠️  Database needs initialization before full functionality', 'yellow');
    }
    
  } catch (error) {
    logSection('❌ Connection Test Failed');
    log(`Error: ${error.message}`, 'red');
    
    // Provide specific troubleshooting advice
    if (error.message.includes('not allowed to access')) {
      log('\n🔥 FIREWALL ISSUE DETECTED', 'red');
      log('This error indicates that Railway\'s IP address is not whitelisted in Azure SQL firewall.', 'yellow');
      log('\n💡 SOLUTION:', 'cyan');
      log('1. Go to Azure Portal → SQL servers → iqube-sql-jaswant → Networking', 'blue');
      log('2. Enable "Allow Azure services and resources to access this server"', 'blue');
      log('3. Save the firewall rules', 'blue');
      log('4. Wait 2-3 minutes for changes to take effect', 'blue');
      log('5. Run this test again', 'blue');
    } else if (error.message.includes('login failed')) {
      log('\n🔑 AUTHENTICATION ISSUE DETECTED', 'red');
      log('The database credentials appear to be incorrect.', 'yellow');
      log('\n💡 SOLUTION:', 'cyan');
      log('1. Verify DB_USER and DB_PASSWORD in Railway environment variables', 'blue');
      log('2. Check if the user account is active in Azure SQL', 'blue');
      log('3. Ensure the user has proper permissions', 'blue');
    } else if (error.message.includes('timeout')) {
      log('\n⏰ TIMEOUT ISSUE DETECTED', 'red');
      log('The connection is timing out, possibly due to network issues.', 'yellow');
      log('\n💡 SOLUTION:', 'cyan');
      log('1. Check Azure SQL server status', 'blue');
      log('2. Verify the server name is correct', 'blue');
      log('3. Try again in a few minutes', 'blue');
    }
    
    log(`\n🔧 Error Details:`, 'magenta');
    log(`   Code: ${error.code || 'N/A'}`, 'blue');
    log(`   Number: ${error.number || 'N/A'}`, 'blue');
    log(`   State: ${error.state || 'N/A'}`, 'blue');
    log(`   Class: ${error.class || 'N/A'}`, 'blue');
    
    process.exit(1);
  }
}

// Function to get Railway deployment URL
async function getRailwayDeploymentInfo() {
  logSection('🚂 Railway Deployment Information');

  // Check for Railway environment variables
  const railwayVars = {
    'RAILWAY_DEPLOYMENT': process.env.RAILWAY_DEPLOYMENT,
    'RAILWAY_ENVIRONMENT': process.env.RAILWAY_ENVIRONMENT,
    'RAILWAY_PROJECT_ID': process.env.RAILWAY_PROJECT_ID,
    'RAILWAY_SERVICE_ID': process.env.RAILWAY_SERVICE_ID,
    'RAILWAY_DEPLOYMENT_ID': process.env.RAILWAY_DEPLOYMENT_ID,
    'RAILWAY_PUBLIC_DOMAIN': process.env.RAILWAY_PUBLIC_DOMAIN,
    'RAILWAY_PRIVATE_DOMAIN': process.env.RAILWAY_PRIVATE_DOMAIN
  };

  log('📊 Railway Environment Variables:', 'blue');
  Object.entries(railwayVars).forEach(([key, value]) => {
    if (value) {
      log(`   ${key}: ${value}`, 'green');
    } else {
      log(`   ${key}: Not set`, 'yellow');
    }
  });

  // Try to determine the Railway URL
  let railwayUrl = null;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    railwayUrl = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  } else if (process.env.RAILWAY_PRIVATE_DOMAIN) {
    railwayUrl = `https://${process.env.RAILWAY_PRIVATE_DOMAIN}`;
  }

  if (railwayUrl) {
    log(`🌐 Detected Railway URL: ${railwayUrl}`, 'green');
    log(`🔍 Database Status Endpoint: ${railwayUrl}/api/status/database`, 'cyan');
    log(`💡 To check current IP and errors, visit the endpoint above`, 'yellow');
  } else {
    log('⚠️  Railway URL not detected from environment variables', 'yellow');
    log('💡 Check Railway dashboard for your deployment URL', 'blue');
  }

  return railwayUrl;
}

// Enhanced main function
async function main() {
  try {
    // Get Railway deployment info first
    const railwayUrl = await getRailwayDeploymentInfo();

    // Run database connection test
    await testDatabaseConnection();

    // Provide next steps
    logSection('🎯 Next Steps for Railway IP Whitelisting');
    if (railwayUrl) {
      log('1. Visit the database status endpoint to get current Railway IP:', 'blue');
      log(`   ${railwayUrl}/api/status/database`, 'cyan');
    } else {
      log('1. Find your Railway deployment URL in Railway dashboard', 'blue');
      log('2. Visit: https://your-app.railway.app/api/status/database', 'cyan');
    }
    log('3. Note the IP address shown in any error message', 'blue');
    log('4. Add that IP to Azure SQL firewall rules', 'blue');
    log('5. Test again after 2-3 minutes', 'blue');

  } catch (error) {
    // Error handling is already done in testDatabaseConnection
    process.exit(1);
  }
}

// Run the enhanced test
main().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
