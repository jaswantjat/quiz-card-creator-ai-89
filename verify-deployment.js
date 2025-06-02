#!/usr/bin/env node

/**
 * Deployment Verification Script for iQube Backend
 * This script verifies that all dependencies are correctly installed
 * and the application can start properly.
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Starting deployment verification...\n');

// Check if we're in the correct directory
console.log('📁 Current working directory:', process.cwd());
console.log('📁 Script directory:', __dirname);

// Verify package.json exists
const packageJsonPath = join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found in backend directory!');
  process.exit(1);
}

console.log('✅ package.json found');

// Read and verify package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ package.json is valid JSON');
  console.log(`📦 Package name: ${packageJson.name}`);
  console.log(`📦 Package version: ${packageJson.version}`);
} catch (error) {
  console.error('❌ Failed to read package.json:', error.message);
  process.exit(1);
}

// Check critical dependencies
const criticalDeps = ['express', 'cors', 'helmet', 'dotenv', 'mssql'];
console.log('\n🔍 Checking critical dependencies...');

for (const dep of criticalDeps) {
  try {
    require.resolve(dep);
    console.log(`✅ ${dep} - OK`);
  } catch (error) {
    console.error(`❌ ${dep} - NOT FOUND`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// Check if node_modules exists
const nodeModulesPath = join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ node_modules directory not found!');
  console.error('   Run: npm install');
  process.exit(1);
}

console.log('✅ node_modules directory exists');

// Check server.js exists
const serverPath = join(__dirname, 'server.js');
if (!fs.existsSync(serverPath)) {
  console.error('❌ server.js not found!');
  process.exit(1);
}

console.log('✅ server.js found');

// Check environment variables
console.log('\n🔍 Checking environment variables...');
const requiredEnvVars = ['PORT', 'NODE_ENV'];
const optionalEnvVars = ['DB_SERVER', 'DB_DATABASE', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} = ${process.env[envVar]}`);
  } else {
    console.log(`⚠️  ${envVar} - NOT SET (will use default)`);
  }
}

for (const envVar of optionalEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} = ${envVar === 'JWT_SECRET' ? '[HIDDEN]' : process.env[envVar]}`);
  } else {
    console.log(`⚠️  ${envVar} - NOT SET`);
  }
}

// Test basic import
console.log('\n🔍 Testing basic imports...');
try {
  const express = await import('express');
  console.log('✅ Express import successful');
  
  const cors = await import('cors');
  console.log('✅ CORS import successful');
  
  const helmet = await import('helmet');
  console.log('✅ Helmet import successful');
  
} catch (error) {
  console.error('❌ Import test failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All verification checks passed!');
console.log('🚀 The application should be ready to start.');
console.log('\n💡 To start the server, run: npm run railway:start');
