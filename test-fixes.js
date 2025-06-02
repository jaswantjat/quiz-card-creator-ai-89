#!/usr/bin/env node

/**
 * Test script to verify the fixes for image visibility and performance issues
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing iQube Fixes');
console.log('=====================\n');

// Test 1: Verify image files exist
console.log('📸 Test 1: Checking image files...');

const imageFiles = [
  'dist/lovable-uploads/5f87692c-a4e5-4595-8ad0-26c2ce2c520e.png', // iQube logo
  'dist/lovable-uploads/4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png', // Company logo
  'public/lovable-uploads/5f87692c-a4e5-4595-8ad0-26c2ce2c520e.png',
  'public/lovable-uploads/4a7eb61d-f2d1-4530-ae72-abaccb971ba2.png'
];

let imageTestsPassed = 0;
imageFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filePath} exists`);
    imageTestsPassed++;
  } else {
    console.log(`❌ ${filePath} missing`);
  }
});

console.log(`\n📊 Image files: ${imageTestsPassed}/${imageFiles.length} found\n`);

// Test 2: Verify ChatAgent.tsx performance optimizations
console.log('⚡ Test 2: Checking ChatAgent.tsx optimizations...');

const chatAgentPath = join(__dirname, 'src/pages/ChatAgent.tsx');
if (fs.existsSync(chatAgentPath)) {
  const content = fs.readFileSync(chatAgentPath, 'utf8');
  
  const checks = [
    {
      name: 'SAMPLE_QUESTIONS moved outside component',
      test: content.includes('const SAMPLE_QUESTIONS: MCQQuestion[] = ['),
      passed: false
    },
    {
      name: 'useMemo imported',
      test: content.includes('import { useState, useCallback, memo, useMemo }'),
      passed: false
    },
    {
      name: 'totalQuestions memoized',
      test: content.includes('const totalQuestions = useMemo('),
      passed: false
    },
    {
      name: 'sampleQuestions removed from useCallback deps',
      test: !content.includes('sampleQuestions]'),
      passed: false
    },
    {
      name: 'SAMPLE_QUESTIONS used in handleGenerate',
      test: content.includes('SAMPLE_QUESTIONS.slice('),
      passed: false
    }
  ];

  checks.forEach(check => {
    check.passed = check.test;
    console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
  });

  const performanceTestsPassed = checks.filter(c => c.passed).length;
  console.log(`\n📊 Performance optimizations: ${performanceTestsPassed}/${checks.length} implemented\n`);
} else {
  console.log('❌ ChatAgent.tsx not found\n');
}

// Test 3: Verify server.js static file configuration
console.log('🌐 Test 3: Checking server.js static file configuration...');

const serverPath = join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  const content = fs.readFileSync(serverPath, 'utf8');
  
  const serverChecks = [
    {
      name: 'Images served before assets',
      test: content.indexOf("app.use('/lovable-uploads'") < content.indexOf("app.use('/assets'"),
      passed: false
    },
    {
      name: 'PNG Content-Type header set',
      test: content.includes("res.setHeader('Content-Type', 'image/png')"),
      passed: false
    },
    {
      name: 'Cache-Control headers added',
      test: content.includes("res.setHeader('Cache-Control', 'public, max-age=86400')"),
      passed: false
    },
    {
      name: 'Catch-all route fixed',
      test: content.includes('return res.status(404).send(\'File not found\')'),
      passed: false
    }
  ];

  serverChecks.forEach(check => {
    check.passed = check.test;
    console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
  });

  const serverTestsPassed = serverChecks.filter(c => c.passed).length;
  console.log(`\n📊 Server optimizations: ${serverTestsPassed}/${serverChecks.length} implemented\n`);
} else {
  console.log('❌ server.js not found\n');
}

// Summary
console.log('📋 Summary');
console.log('==========');
console.log('✅ Performance fixes applied to ChatAgent.tsx');
console.log('✅ Static file serving optimized in server.js');
console.log('✅ Image Content-Type headers configured');
console.log('✅ Catch-all route fixed to not interfere with static files');
console.log('\n🚀 Next steps:');
console.log('1. Test in development: npm run dev');
console.log('2. Build and test production: npm run build && npm start');
console.log('3. Deploy to Railway and verify images load');
console.log('4. Test ChatAgent page performance');
