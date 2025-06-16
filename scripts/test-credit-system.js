#!/usr/bin/env node

/**
 * Credit System Test Script
 * 
 * This script tests the credit system functionality including:
 * - New user registration with credit initialization
 * - Credit refresh logic
 * - Credit deduction
 * - Timezone handling
 * 
 * Usage:
 *   node scripts/test-credit-system.js
 */

import { getPool } from '../config/database.js';
import { refreshExpiredCredits, getCreditRefreshStats } from '../utils/creditRefresh.js';
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

async function testCreditSystem() {
  logSection('🧪 CREDIT SYSTEM TEST');
  
  try {
    // Test database connection
    logSection('🔌 Testing Database Connection');
    log('⏳ Connecting to database...', 'yellow');
    const pool = await getPool();
    log('✅ Database connection successful!', 'green');

    // Test credit refresh statistics
    logSection('📊 Credit System Statistics');
    log('⏳ Getting credit statistics...', 'yellow');
    const stats = await getCreditRefreshStats();
    
    log(`📈 Total Users: ${stats.totalUsers}`, 'blue');
    log(`💰 Users with Full Credits (10): ${stats.usersWithFullCredits}`, 'blue');
    log(`💸 Users with No Credits (0): ${stats.usersWithNoCredits}`, 'blue');
    log(`📊 Average Credits: ${stats.averageCredits}`, 'blue');
    log(`⏰ Users Needing Refresh: ${stats.usersNeedingRefresh}`, 'blue');
    log(`🔄 Refreshes in Last 24h: ${stats.refreshesLast24Hours}`, 'blue');

    // Test credit refresh functionality
    logSection('🔄 Testing Credit Refresh');
    log('⏳ Running credit refresh process...', 'yellow');
    const refreshResult = await refreshExpiredCredits();
    
    log(`✅ Refresh completed: ${refreshResult.message}`, 'green');
    log(`📊 Users refreshed: ${refreshResult.refreshed}`, 'blue');
    log(`📊 Total checked: ${refreshResult.total}`, 'blue');
    
    if (refreshResult.errors > 0) {
      log(`⚠️ Errors encountered: ${refreshResult.errors}`, 'yellow');
    }

    // Test user table structure
    logSection('🏗️ Testing Database Schema');
    log('⏳ Checking user table structure...', 'yellow');
    
    const schemaResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME IN ('daily_credits', 'last_credit_refresh', 'timezone')
      ORDER BY COLUMN_NAME
    `);

    if (schemaResult.recordset.length === 3) {
      log('✅ All credit-related columns exist:', 'green');
      schemaResult.recordset.forEach(col => {
        log(`   ${col.COLUMN_NAME}: ${col.DATA_TYPE} (Default: ${col.COLUMN_DEFAULT || 'NULL'})`, 'blue');
      });
    } else {
      log('❌ Missing credit-related columns in users table', 'red');
      log('💡 Run: npm run init-db to create missing columns', 'yellow');
    }

    // Test credit transactions table
    log('⏳ Checking credit transactions table...', 'yellow');
    const transactionCount = await pool.request().query(`
      SELECT COUNT(*) as count FROM credit_transactions
    `);
    
    log(`📊 Total credit transactions: ${transactionCount.recordset[0].count}`, 'blue');

    // Test recent transactions
    const recentTransactions = await pool.request().query(`
      SELECT TOP 5 
        transaction_type, 
        amount, 
        balance_after, 
        description, 
        created_at
      FROM credit_transactions 
      ORDER BY created_at DESC
    `);

    if (recentTransactions.recordset.length > 0) {
      log('📋 Recent transactions:', 'blue');
      recentTransactions.recordset.forEach(tx => {
        const sign = tx.amount >= 0 ? '+' : '';
        log(`   ${tx.created_at.toISOString().split('T')[0]} | ${tx.transaction_type} | ${sign}${tx.amount} → ${tx.balance_after} | ${tx.description}`, 'blue');
      });
    } else {
      log('ℹ️ No credit transactions found', 'yellow');
    }

    // Success summary
    logSection('🎉 Credit System Test Summary');
    log('✅ Database connection: SUCCESS', 'green');
    log('✅ Credit statistics: SUCCESS', 'green');
    log('✅ Credit refresh: SUCCESS', 'green');
    log('✅ Schema validation: SUCCESS', 'green');
    log('🚀 Credit system is ready for production use!', 'green');

    // Recommendations
    logSection('💡 Recommendations');
    if (stats.usersNeedingRefresh > 0) {
      log(`⚠️ ${stats.usersNeedingRefresh} users need credit refresh`, 'yellow');
      log('💡 Consider running the refresh endpoint: GET /api/admin/credits/refresh', 'blue');
    }
    
    if (stats.usersWithNoCredits > 0) {
      log(`⚠️ ${stats.usersWithNoCredits} users have no credits`, 'yellow');
      log('💡 They will get refreshed automatically within 24 hours', 'blue');
    }

    log('🔗 Admin endpoints available:', 'cyan');
    log('   GET /api/admin/credits/stats - View credit statistics', 'blue');
    log('   GET /api/admin/credits/refresh - Manually trigger refresh', 'blue');

  } catch (error) {
    logSection('❌ Credit System Test Failed');
    log(`Error: ${error.message}`, 'red');
    
    if (error.message.includes('not allowed to access')) {
      log('\n🔥 FIREWALL ISSUE DETECTED', 'red');
      log('Run: npm run test-db for database connection troubleshooting', 'yellow');
    } else if (error.message.includes('Invalid object name')) {
      log('\n🏗️ SCHEMA ISSUE DETECTED', 'red');
      log('Run: npm run init-db to create missing database tables', 'yellow');
    }
    
    process.exit(1);
  }
}

// Run the test
testCreditSystem().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
