#!/usr/bin/env node

/**
 * Railway IP Monitor for Azure SQL Firewall
 * Monitors Railway IP changes and provides Azure CLI commands
 */

const https = require('https');
const fs = require('fs');

const RAILWAY_URL = 'https://genrate-with-ai-feature-production.up.railway.app';
const IP_LOG_FILE = 'railway-ip-history.json';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = res.headers['content-type']?.includes('application/json') 
            ? JSON.parse(data) 
            : data;
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function loadIPHistory() {
  try {
    if (fs.existsSync(IP_LOG_FILE)) {
      return JSON.parse(fs.readFileSync(IP_LOG_FILE, 'utf8'));
    }
  } catch (error) {
    console.log('⚠️  Could not load IP history, starting fresh');
  }
  return { ips: [], lastCheck: null };
}

function saveIPHistory(history) {
  try {
    fs.writeFileSync(IP_LOG_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.log('⚠️  Could not save IP history:', error.message);
  }
}

function extractIPFromError(errorMessage) {
  const match = errorMessage.match(/Client with IP address '([^']+)'/);
  return match ? match[1] : null;
}

function generateAzureCLICommands(newIP) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const ruleName = `Railway-IP-${newIP.replace(/\./g, '-')}-${timestamp}`;
  
  return [
    '# Azure CLI commands to add new Railway IP:',
    '',
    'az sql server firewall-rule create \\',
    '  --resource-group "your-resource-group-name" \\',
    `  --server "iqube-sql-jaswant" \\`,
    `  --name "${ruleName}" \\`,
    `  --start-ip-address "${newIP}" \\`,
    `  --end-ip-address "${newIP}"`,
    '',
    '# Verify the rule was added:',
    'az sql server firewall-rule list \\',
    '  --resource-group "your-resource-group-name" \\',
    '  --server "iqube-sql-jaswant"'
  ].join('\n');
}

async function monitorRailwayIP() {
  console.log('🔍 Railway IP Monitor for Azure SQL Firewall');
  console.log('===========================================');
  
  const history = loadIPHistory();
  const currentTime = new Date().toISOString();
  
  console.log(`📅 Check time: ${currentTime}`);
  console.log(`📊 Known IPs: ${history.ips.length}`);
  
  try {
    // Test database status to get current IP
    console.log('\n🧪 Testing database connectivity...');
    const result = await makeRequest(`${RAILWAY_URL}/api/status/database`);
    
    let currentIP = null;
    let isBlocked = false;
    
    if (result.status === 503 && result.data.error) {
      currentIP = extractIPFromError(result.data.error);
      isBlocked = true;
      console.log(`🚨 Database blocked! Current Railway IP: ${currentIP}`);
    } else if (result.status === 200) {
      console.log('✅ Database connected! No firewall issues detected.');
      // Try to get IP from successful response if available
      if (result.data.client_info?.railway_ip) {
        currentIP = result.data.client_info.railway_ip;
      }
    }
    
    if (currentIP) {
      console.log(`🌐 Current Railway IP: ${currentIP}`);
      
      // Check if this is a new IP
      const existingIP = history.ips.find(ip => ip.address === currentIP);
      
      if (!existingIP) {
        console.log('🆕 NEW IP DETECTED!');
        console.log('===================');
        
        // Add to history
        history.ips.push({
          address: currentIP,
          firstSeen: currentTime,
          lastSeen: currentTime,
          blocked: isBlocked
        });
        
        // Generate Azure CLI commands
        console.log('\n🔧 Azure CLI Commands to Fix:');
        console.log('==============================');
        console.log(generateAzureCLICommands(currentIP));
        
        // Save updated history
        history.lastCheck = currentTime;
        saveIPHistory(history);
        
        console.log('\n📝 IP added to history file: railway-ip-history.json');
        
      } else {
        console.log('✅ Known IP - updating last seen time');
        existingIP.lastSeen = currentTime;
        existingIP.blocked = isBlocked;
        history.lastCheck = currentTime;
        saveIPHistory(history);
      }
    } else {
      console.log('⚠️  Could not determine current Railway IP');
    }
    
    // Display IP history
    console.log('\n📊 Railway IP History:');
    console.log('======================');
    history.ips.forEach((ip, index) => {
      const status = ip.blocked ? '🚨 BLOCKED' : '✅ ALLOWED';
      console.log(`${index + 1}. ${ip.address} - ${status}`);
      console.log(`   First seen: ${ip.firstSeen}`);
      console.log(`   Last seen: ${ip.lastSeen}`);
      console.log('');
    });
    
    // Recommendations
    console.log('💡 Recommendations:');
    console.log('===================');
    
    if (isBlocked) {
      console.log('🚨 IMMEDIATE ACTION REQUIRED:');
      console.log('   1. Run the Azure CLI commands above');
      console.log('   2. Wait 2-3 minutes for propagation');
      console.log('   3. Test again with: node test-azure-firewall-fix.cjs');
    } else {
      console.log('✅ No immediate action needed');
      console.log('   Database connectivity is working');
    }
    
    if (history.ips.length > 1) {
      console.log('\n🎯 Consider adding an IP range to prevent future issues:');
      const ips = history.ips.map(ip => ip.address);
      const ipParts = ips.map(ip => ip.split('.'));
      
      // Find common prefix
      let commonPrefix = ipParts[0].slice(0, 3).join('.');
      console.log(`   Suggested range: ${commonPrefix}.0 - ${commonPrefix}.255`);
      
      console.log('\n   Azure CLI command for range:');
      console.log('   az sql server firewall-rule create \\');
      console.log('     --resource-group "your-resource-group-name" \\');
      console.log('     --server "iqube-sql-jaswant" \\');
      console.log('     --name "Railway-IP-Range" \\');
      console.log(`     --start-ip-address "${commonPrefix}.0" \\`);
      console.log(`     --end-ip-address "${commonPrefix}.255"`);
    }
    
  } catch (error) {
    console.log('❌ Error monitoring Railway IP:', error.message);
  }
}

// Run the monitor
monitorRailwayIP().then(() => {
  console.log('\n🎉 Railway IP monitoring complete!');
}).catch((error) => {
  console.error('💥 Monitor failed:', error);
});
