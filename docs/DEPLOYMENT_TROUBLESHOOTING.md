# 🚀 iMocha Deployment Troubleshooting Guide

This guide helps resolve common deployment issues, particularly database connectivity problems with Railway and Azure SQL.

## 🔥 Critical Issue: Database Connection Failures

### Problem
Railway deployments fail to connect to Azure SQL Database with errors like:
- "Client with IP address 'X.X.X.X' is not allowed to access the server"
- "Login timeout expired"
- "A network-related or instance-specific error occurred"

### Root Cause
Railway uses **dynamic IP addresses** that change frequently. Static IP whitelisting in Azure SQL firewall rules becomes unreliable.

## ✅ SOLUTION 1: Enable Azure Services (Recommended)

This is the most reliable solution for Railway deployments:

### Steps:
1. **Open Azure Portal**: https://portal.azure.com
2. **Navigate to SQL Server**:
   - Go to "SQL servers"
   - Select "iqube-sql-jaswant"
3. **Configure Networking**:
   - Click "Networking" in the left sidebar
   - Under "Firewall rules"
   - **Enable**: "Allow Azure services and resources to access this server"
   - Click "Save"
4. **Wait**: 2-3 minutes for changes to propagate
5. **Test**: Visit your Railway app at `/api/status/database`

### Why This Works:
- Railway runs on Azure infrastructure
- This setting allows all Azure-hosted services to connect
- No need to manage changing IP addresses
- More secure than broad IP ranges

### ⚠️ If This Doesn't Work:
Railway might be using non-Azure infrastructure or specific IP ranges that don't qualify for "Azure services". In this case, proceed to Solution 2.

## 🔧 SOLUTION 2: Railway IP Whitelisting (When Azure Services Fails)

Use this when Solution 1 doesn't work (Railway not recognized as Azure service):

### 🔍 Step 1: Detect Railway's Current IP
```bash
# Automated detection (recommended)
npm run detect-railway-ip https://your-app.railway.app

# Manual detection
curl https://your-app.railway.app/api/status/database
```

### 🔥 Step 2: Add IP to Azure SQL Firewall
1. **Open Azure Portal**: https://portal.azure.com
2. **Navigate**: SQL servers → iqube-sql-jaswant → Networking
3. **Add Firewall Rule**:
   - Click "Add firewall rule"
   - **Name**: `Railway-Dynamic-IP-[YYYY-MM-DD]`
   - **Start IP**: [IP from Step 1]
   - **End IP**: [Same IP from Step 1]
   - Click "Save"

### ⏰ Step 3: Wait and Test
- **Wait**: 2-3 minutes for Azure to propagate changes
- **Test**: `npm run test-db` or visit `/api/status/database`
- **Verify**: Look for successful database connection

### 🔄 Step 4: Monitor for IP Changes
Railway IPs can change frequently. Set up monitoring:
```bash
# Check IP weekly
npm run detect-railway-ip https://your-app.railway.app

# Monitor database status
curl https://your-app.railway.app/api/status/database
```

### 🛡️ Advanced: Subnet Range Whitelisting
If single IP doesn't work, try whitelisting the subnet:
- **Start IP**: `X.X.X.0` (replace X.X.X with first 3 octets of Railway IP)
- **End IP**: `X.X.X.255`
- **Example**: If Railway IP is `203.0.113.45`, use `203.0.113.0 - 203.0.113.255`

### ⚠️ Important Notes:
- Railway IPs change frequently (daily/weekly)
- Monitor the `/api/status/database` endpoint regularly
- Update firewall rules when IP changes
- Consider automated monitoring for production apps

## 🧪 Testing Database Connection

### Local Testing:
```bash
# Set environment variables in .env file
npm run test-db
```

### Production Testing:
```bash
# Check Railway deployment
curl https://your-app.railway.app/api/status/database
```

### Expected Success Response:
```json
{
  "status": "connected",
  "message": "Database connection is working",
  "server_info": {
    "server": "iqube-sql-jaswant.database.windows.net",
    "database": "iqube_db",
    "server_time": "2024-01-15T10:30:00.000Z",
    "test_query": 1
  },
  "client_info": {
    "railway_ip": "X.X.X.X"
  }
}
```

## 🔍 Troubleshooting Steps

### 1. Verify Environment Variables
Ensure these are set in Railway:
```
DB_SERVER=iqube-sql-jaswant.database.windows.net
DB_DATABASE=iqube_db
DB_USER=CloudSAaf673f5f
DB_PASSWORD=Mh15ga2226
JWT_SECRET=your-secure-secret
NODE_ENV=production
PORT=8080
```

### 2. Check Azure SQL Server Status
- Azure Portal → SQL servers → iqube-sql-jaswant
- Verify server is running and accessible
- Check for any service outages

### 3. Test Locally
```bash
# Copy Railway environment variables to .env
npm run test-db
```

### 4. Monitor Railway Logs
- Railway Dashboard → Your App → Logs
- Look for database connection errors
- Note any IP address changes

### 5. Verify Firewall Rules
- Azure Portal → SQL servers → iqube-sql-jaswant → Networking
- Check "Allow Azure services" is enabled
- Review firewall rules list

## 🚨 Common Error Messages

### "Client with IP address is not allowed"
**Solution**: Enable "Allow Azure services" or add IP to firewall

### "Login failed for user"
**Solution**: Verify DB_USER and DB_PASSWORD environment variables

### "Timeout expired"
**Solution**: Check Azure SQL server status and network connectivity

### "Server was not found"
**Solution**: Verify DB_SERVER environment variable

## 📊 Monitoring & Maintenance

### Regular Checks:
1. **Weekly**: Test `/api/status/database` endpoint
2. **After Railway deployments**: Verify database connectivity
3. **Monitor**: Railway logs for connection errors

### Automated Monitoring:
Consider setting up health checks that alert on database failures:
```bash
# Add to your monitoring system
curl -f https://your-app.railway.app/api/status/database || alert
```

## 🎯 Best Practices

1. **Use "Allow Azure services"** instead of IP whitelisting
2. **Monitor the status endpoint** regularly
3. **Keep environment variables secure** and up-to-date
4. **Test locally** before deploying
5. **Have a rollback plan** for database issues

## 📞 Support

If issues persist:
1. Check Railway status page
2. Check Azure status page
3. Review Railway logs
4. Test database connection locally
5. Contact Railway support with specific error messages

## 🧹 Project Structure Cleanup

### Legacy Backend Directory Removed
The `/backend` directory has been removed as part of project cleanup:
- **Reason**: Files were duplicated between `/backend` and root directory
- **Current Structure**: All backend files are now in the root directory
- **Railway Deployment**: Uses root-level configuration files
- **No Impact**: Existing functionality remains unchanged

### Current Clean Structure:
```
├── src/                    # React frontend source
├── routes/                 # Express API routes
├── middleware/             # Express middleware
├── config/                 # Database configuration
├── scripts/                # Database utilities
├── docs/                   # Documentation
├── dist/                   # Built React app (production)
└── server.js              # Main Express server
```

---

**Last Updated**: January 2024
**Tested With**: Railway, Azure SQL Database, Node.js 18+
