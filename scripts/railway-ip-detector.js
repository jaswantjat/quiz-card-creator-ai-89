#!/usr/bin/env node

/**
 * Railway IP Detection and Azure SQL Firewall Configuration Helper
 * 
 * This script helps identify Railway's current IP address and provides
 * specific instructions for configuring Azure SQL firewall rules.
 * 
 * Usage:
 *   node scripts/railway-ip-detector.js [railway-url]
 * 
 * Example:
 *   node scripts/railway-ip-detector.js https://your-app.railway.app
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ANSI color codes
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

async function detectRailwayIP(railwayUrl) {
  logSection('🔍 Detecting Railway IP Address');
  
  if (!railwayUrl) {
    log('❌ Railway URL not provided', 'red');
    log('💡 Usage: node scripts/railway-ip-detector.js https://your-app.railway.app', 'yellow');
    return null;
  }
  
  // Ensure URL has proper format
  if (!railwayUrl.startsWith('http')) {
    railwayUrl = `https://${railwayUrl}`;
  }
  
  const statusUrl = `${railwayUrl}/api/status/database`;
  log(`🌐 Testing Railway deployment: ${railwayUrl}`, 'blue');
  log(`🔍 Checking database status: ${statusUrl}`, 'blue');
  
  try {
    log('⏳ Fetching Railway IP information...', 'yellow');
    
    const response = await fetch(statusUrl, {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Railway-IP-Detector/1.0'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Database is connected - show success info
      log('✅ Database connection is working!', 'green');
      
      if (data.client_info && data.client_info.railway_ip) {
        log(`🎯 Railway IP Address: ${data.client_info.railway_ip}`, 'green');
        return data.client_info.railway_ip;
      } else {
        log('⚠️  Railway IP not found in response', 'yellow');
        return null;
      }
    } else {
      // Database connection failed - extract IP from error
      log('❌ Database connection failed (expected for IP detection)', 'red');
      log(`📊 Status: ${response.status}`, 'blue');
      log(`📝 Message: ${data.message || 'No message'}`, 'blue');
      
      // Look for IP in error message or suggestions
      let detectedIP = null;
      
      if (data.error && typeof data.error === 'string') {
        const ipMatch = data.error.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
        if (ipMatch) {
          detectedIP = ipMatch[1];
        }
      }
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        for (const suggestion of data.suggestions) {
          const ipMatch = suggestion.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
          if (ipMatch) {
            detectedIP = ipMatch[1];
            break;
          }
        }
      }
      
      if (data.client_info) {
        log('📊 Client Information:', 'blue');
        Object.entries(data.client_info).forEach(([key, value]) => {
          log(`   ${key}: ${value}`, 'cyan');
          if (key.toLowerCase().includes('ip') && value && value.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
            detectedIP = value;
          }
        });
      }
      
      if (detectedIP) {
        log(`🎯 Detected Railway IP: ${detectedIP}`, 'green');
        return detectedIP;
      } else {
        log('⚠️  Could not extract IP address from error response', 'yellow');
        log('📋 Full response:', 'magenta');
        console.log(JSON.stringify(data, null, 2));
        return null;
      }
    }
  } catch (error) {
    log(`❌ Failed to fetch Railway IP: ${error.message}`, 'red');
    
    if (error.code === 'ENOTFOUND') {
      log('🔍 DNS resolution failed - check if the Railway URL is correct', 'yellow');
    } else if (error.code === 'ECONNREFUSED') {
      log('🔍 Connection refused - Railway app might not be running', 'yellow');
    } else if (error.name === 'AbortError') {
      log('🔍 Request timeout - Railway app might be slow to respond', 'yellow');
    }
    
    return null;
  }
}

function generateAzureFirewallInstructions(railwayIP) {
  logSection('🔥 Azure SQL Firewall Configuration');
  
  if (!railwayIP) {
    log('❌ No Railway IP detected - cannot provide specific instructions', 'red');
    log('💡 Try running the script again with a valid Railway URL', 'yellow');
    return;
  }
  
  log('📋 Step-by-step instructions to whitelist Railway IP:', 'blue');
  log('', 'reset');
  
  log('1. 🌐 Open Azure Portal:', 'bright');
  log('   https://portal.azure.com', 'cyan');
  log('', 'reset');
  
  log('2. 🗄️ Navigate to SQL Server:', 'bright');
  log('   → Search for "SQL servers"', 'blue');
  log('   → Click "iqube-sql-jaswant"', 'blue');
  log('', 'reset');
  
  log('3. 🔧 Configure Networking:', 'bright');
  log('   → Click "Networking" in the left sidebar', 'blue');
  log('   → Scroll to "Firewall rules" section', 'blue');
  log('', 'reset');
  
  log('4. ➕ Add Firewall Rule:', 'bright');
  log('   → Click "Add firewall rule"', 'blue');
  log(`   → Rule name: "Railway-Dynamic-IP-${new Date().toISOString().split('T')[0]}"`, 'blue');
  log(`   → Start IP address: ${railwayIP}`, 'green');
  log(`   → End IP address: ${railwayIP}`, 'green');
  log('   → Click "Save"', 'blue');
  log('', 'reset');
  
  log('5. ⏰ Wait and Test:', 'bright');
  log('   → Wait 2-3 minutes for changes to propagate', 'blue');
  log('   → Test the connection again', 'blue');
  log('', 'reset');
  
  log('🔧 Alternative: Broader IP Range (if single IP doesn\'t work):', 'yellow');
  const ipParts = railwayIP.split('.');
  const broadRange = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0 - ${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.255`;
  log(`   → Start IP: ${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0`, 'cyan');
  log(`   → End IP: ${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.255`, 'cyan');
  log('   → This covers the entire /24 subnet', 'blue');
  log('', 'reset');
  
  log('⚠️  Important Notes:', 'yellow');
  log('   • Railway IPs can change frequently', 'blue');
  log('   • Monitor the database status endpoint regularly', 'blue');
  log('   • Consider using "Allow Azure services" if available', 'blue');
  log('   • Keep this script handy for future IP changes', 'blue');
}

function generateTestCommands(railwayUrl, railwayIP) {
  logSection('🧪 Testing Commands');
  
  if (railwayUrl) {
    log('📡 Test Railway Database Status:', 'blue');
    log(`curl "${railwayUrl}/api/status/database"`, 'cyan');
    log('', 'reset');
  }
  
  log('🔍 Test Local Database Connection:', 'blue');
  log('npm run test-db', 'cyan');
  log('', 'reset');
  
  if (railwayIP) {
    log('🌐 Check IP Geolocation:', 'blue');
    log(`curl "https://ipapi.co/${railwayIP}/json/"`, 'cyan');
    log('', 'reset');
  }
  
  log('📊 Monitor Railway Logs:', 'blue');
  log('1. Go to Railway Dashboard', 'blue');
  log('2. Select your project', 'blue');
  log('3. Click "Logs" tab', 'blue');
  log('4. Look for database connection errors', 'blue');
}

async function main() {
  const railwayUrl = process.argv[2];
  
  logSection('🚂 Railway IP Detection Tool');
  log('This tool helps identify Railway\'s current IP address for Azure SQL firewall configuration.', 'blue');
  
  if (!railwayUrl) {
    log('', 'reset');
    log('💡 Usage Examples:', 'yellow');
    log('   node scripts/railway-ip-detector.js https://your-app.railway.app', 'cyan');
    log('   node scripts/railway-ip-detector.js your-app.railway.app', 'cyan');
    log('', 'reset');
    log('🔍 To find your Railway URL:', 'blue');
    log('   1. Go to Railway Dashboard: https://railway.app/dashboard', 'blue');
    log('   2. Find your iMocha/question-generator project', 'blue');
    log('   3. Look for deployment URL in Deployments tab', 'blue');
    log('   4. URL format: https://[name].railway.app or https://[id].up.railway.app', 'blue');
    log('', 'reset');
    log('📖 Detailed guide: docs/FIND_RAILWAY_URL.md', 'cyan');
    log('🧪 Test health endpoint: curl https://your-url.railway.app/health', 'cyan');
    process.exit(1);
  }
  
  try {
    const railwayIP = await detectRailwayIP(railwayUrl);
    generateAzureFirewallInstructions(railwayIP);
    generateTestCommands(railwayUrl, railwayIP);
    
    logSection('✅ Summary');
    if (railwayIP) {
      log(`🎯 Railway IP: ${railwayIP}`, 'green');
      log('📋 Follow the Azure firewall instructions above', 'blue');
      log('⏰ Wait 2-3 minutes after adding the firewall rule', 'yellow');
      log('🧪 Test the connection using the commands provided', 'blue');
    } else {
      log('❌ Could not detect Railway IP address', 'red');
      log('💡 Check if the Railway URL is correct and the app is running', 'yellow');
      log('🔍 Try accessing the URL manually in a browser', 'blue');
    }
    
  } catch (error) {
    log(`💥 Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the tool
main();
