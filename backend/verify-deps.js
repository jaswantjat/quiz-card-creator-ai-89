#!/usr/bin/env node

import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verifying dependencies...');

// Read package.json
const packageJsonPath = join(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Check critical dependencies
const criticalDeps = ['express', 'cors', 'helmet', 'dotenv', 'mssql'];
const missingDeps = [];

for (const dep of criticalDeps) {
  const depPath = join(__dirname, 'node_modules', dep, 'package.json');
  if (!existsSync(depPath)) {
    missingDeps.push(dep);
  } else {
    console.log(`✅ ${dep} - Found`);
  }
}

if (missingDeps.length > 0) {
  console.error('❌ Missing critical dependencies:', missingDeps);
  console.error('🔧 Run: npm install');
  process.exit(1);
} else {
  console.log('✅ All critical dependencies verified');
}

// Verify node_modules exists
const nodeModulesPath = join(__dirname, 'node_modules');
if (!existsSync(nodeModulesPath)) {
  console.error('❌ node_modules directory not found');
  process.exit(1);
}

console.log('🎉 Dependency verification complete');
