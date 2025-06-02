# Azure SQL Firewall Configuration for Railway Deployment

## 🚨 Current Issue

Railway deployment shows authentication API failures:
```
❌ 500 Internal Server Error on /api/auth/login and /api/auth/register
❌ Database connection failed: Failed to connect to iqube-sql-jaswant.database.windows.net:1433
```

**Root Cause**: Railway's IP address is not allowed in Azure SQL Server firewall rules.

**Current Railway IP**: Check `/api/status/database` endpoint for current IP address in error message.

## 🔧 Solution: Add Railway IP to Azure SQL Firewall

### Step 1: Access Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Azure account
3. Navigate to **SQL servers**

### Step 2: Find Your SQL Server
1. Locate server: `iqube-sql-jaswant`
2. Click on the server name

### Step 3: Configure Firewall Rules
1. In the left sidebar, click **"Networking"**
2. Under **"Firewall rules"**, click **"Add a firewall rule"**
3. Add the following rule:

```
Rule Name: Railway-Deployment
Start IP: 208.77.244.3
End IP: 208.77.244.3
```

### Step 4: Save Configuration
1. Click **"Save"** at the top of the page
2. Wait for the configuration to apply (usually 1-2 minutes)

### Step 5: Verify Connection
1. Check Railway deployment logs for successful database connection
2. Look for: `✅ Database connection verified`

## 🔍 How to Find Railway's Current IP

Railway's IP address may change. To find the current IP:

1. **Check Railway Logs**:
   - Go to Railway dashboard → Your service → Deployments
   - Look for database connection error logs
   - The IP will be mentioned in the error message

2. **Alternative Method**:
   - Add a temporary rule allowing all IPs: `0.0.0.0` to `255.255.255.255`
   - Deploy and check logs for the actual IP being used
   - Replace with specific IP rule for security

## 🛡️ Security Best Practices

### Recommended Firewall Rules
```
Rule Name: Railway-Production
Start IP: 208.77.244.3
End IP: 208.77.244.3

Rule Name: Development-Local (optional)
Start IP: YOUR_LOCAL_IP
End IP: YOUR_LOCAL_IP

Rule Name: Azure-Services
Start IP: 0.0.0.0
End IP: 0.0.0.0
```

### Important Notes
- ✅ **Use specific IP ranges** instead of allowing all IPs
- ✅ **Remove unused rules** regularly
- ✅ **Monitor access logs** for suspicious activity
- ❌ **Avoid using 0.0.0.0-255.255.255.255** in production

## 🚀 Expected Result

After adding the firewall rule, your Railway deployment should show:

```
✅ Database connection verified
🚀 iQube Backend API running on port 8080
✅ Health check test: 200
```

## 🔄 If Issues Persist

1. **Double-check the IP address** in Railway logs
2. **Verify the rule is saved** in Azure portal
3. **Wait 2-3 minutes** for Azure to apply changes
4. **Redeploy on Railway** to test the connection
5. **Check environment variables** are correctly set in Railway

## 📞 Support

If you continue experiencing issues:
1. Check Railway logs for specific error messages
2. Verify Azure SQL server is running
3. Confirm database credentials in Railway environment variables
4. Test connection from Azure Query Editor to verify server is accessible
