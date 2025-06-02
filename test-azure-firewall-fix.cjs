#!/usr/bin/env node

/**
 * Azure SQL Firewall Fix Verification Script
 * Tests database connectivity after firewall rule updates
 */

const https = require('https');

const RAILWAY_URL = 'https://genrate-with-ai-feature-production.up.railway.app';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = res.headers['content-type']?.includes('application/json') 
            ? JSON.parse(data) 
            : data;
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testFirewallFix() {
  console.log('🔥 Testing Azure SQL Firewall Fix for Railway IP: 208.77.244.42');
  console.log('================================================================');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${RAILWAY_URL}/health`,
      description: 'Basic application health'
    },
    {
      name: 'Database Status',
      url: `${RAILWAY_URL}/api/status/database`,
      description: 'Direct database connectivity test'
    },
    {
      name: 'Question Topics',
      url: `${RAILWAY_URL}/api/questions/topics`,
      description: 'Database query functionality'
    },
    {
      name: 'Auth Endpoint',
      url: `${RAILWAY_URL}/api/auth/login`,
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass'
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      description: 'Authentication with database lookup'
    }
  ];

  const results = {};
  
  for (const test of tests) {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`📝 Description: ${test.description}`);
    console.log(`🔗 URL: ${test.url}`);
    
    try {
      const options = {
        method: test.method || 'GET',
        headers: test.headers || {},
        timeout: 10000
      };
      
      if (test.body) {
        options.body = test.body;
      }
      
      const result = await makeRequest(test.url, options);
      
      results[test.name] = {
        success: result.status < 500,
        status: result.status,
        data: result.data
      };
      
      if (result.status < 500) {
        console.log(`✅ ${test.name}: SUCCESS (${result.status})`);
        if (typeof result.data === 'object') {
          console.log(`📊 Response: ${JSON.stringify(result.data, null, 2)}`);
        } else {
          console.log(`📊 Response: ${result.data}`);
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (${result.status})`);
        console.log(`📊 Error: ${JSON.stringify(result.data, null, 2)}`);
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      results[test.name] = {
        success: false,
        error: error.message
      };
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FIREWALL FIX VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  const passed = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Result: ${passed}/${total} tests passed`);
  
  if (results['Database Status']?.success) {
    console.log('✅ DATABASE CONNECTIVITY: FIXED! 🎉');
    console.log('   Azure SQL firewall rule is working correctly');
  } else {
    console.log('❌ DATABASE CONNECTIVITY: STILL BLOCKED 🚨');
    console.log('   Firewall rule may not be applied yet or incorrect');
  }
  
  if (results['Question Topics']?.success) {
    console.log('✅ DATABASE QUERIES: WORKING! 🎉');
    console.log('   Application can successfully query the database');
  } else {
    console.log('❌ DATABASE QUERIES: FAILING 🚨');
    console.log('   Database connection issues persist');
  }
  
  if (results['Auth Endpoint']?.success) {
    console.log('✅ AUTHENTICATION: WORKING! 🎉');
    console.log('   User authentication with database lookup is functional');
  } else {
    console.log('❌ AUTHENTICATION: FAILING 🚨');
    console.log('   Authentication endpoints still have database issues');
  }
  
  console.log('\n🔧 Next Steps:');
  if (passed === total) {
    console.log('✅ All tests passed! Your firewall fix is working correctly.');
    console.log('✅ iQube application is fully functional with database access.');
  } else {
    console.log('⚠️  Some tests failed. Consider:');
    console.log('   1. Wait 2-3 minutes for firewall rules to propagate');
    console.log('   2. Verify the Railway IP address is correct: 208.77.244.42');
    console.log('   3. Check Azure portal for firewall rule status');
    console.log('   4. Restart Railway deployment if needed');
  }
  
  return results;
}

// Run the test
testFirewallFix().then((results) => {
  console.log('\n🎉 Firewall fix verification complete!');
  process.exit(Object.values(results).every(r => r.success) ? 0 : 1);
}).catch((error) => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
