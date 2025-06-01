# Azure Backend Setup Guide for iQube

This guide will help you deploy your iQube backend to Azure using the free tier services.

## 🎯 What We'll Create

- **Azure SQL Database** (Free tier: 32GB storage)
- **Azure App Service** (Free tier: 1GB storage, 1 hour/day)
- **Azure Key Vault** (Free tier: 10,000 operations)

## 📋 Prerequisites

1. Azure account (free tier available)
2. Azure CLI installed
3. Node.js 18+ installed locally

## 🚀 Step 1: Create Azure Resources

### 1.1 Login to Azure
```bash
az login
```

### 1.2 Create Resource Group
```bash
az group create --name iqube-rg --location "East US"
```

### 1.3 Create Azure SQL Server
```bash
az sql server create \
  --name iqube-sql-server \
  --resource-group iqube-rg \
  --location "East US" \
  --admin-user iqubeadmin \
  --admin-password "YourSecurePassword123!"
```

### 1.4 Create Azure SQL Database (Free Tier)
```bash
az sql db create \
  --resource-group iqube-rg \
  --server iqube-sql-server \
  --name iqube_db \
  --edition Basic \
  --capacity 5
```

### 1.5 Configure Firewall Rules
```bash
# Allow Azure services
az sql server firewall-rule create \
  --resource-group iqube-rg \
  --server iqube-sql-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP (replace with your actual IP)
az sql server firewall-rule create \
  --resource-group iqube-rg \
  --server iqube-sql-server \
  --name AllowMyIP \
  --start-ip-address YOUR_IP_ADDRESS \
  --end-ip-address YOUR_IP_ADDRESS
```

### 1.6 Create App Service Plan (Free Tier)
```bash
az appservice plan create \
  --name iqube-plan \
  --resource-group iqube-rg \
  --sku F1 \
  --is-linux
```

### 1.7 Create Web App
```bash
az webapp create \
  --resource-group iqube-rg \
  --plan iqube-plan \
  --name iqube-backend \
  --runtime "NODE:18-lts"
```

## 🔧 Step 2: Configure Environment Variables

### 2.1 Set App Settings
```bash
az webapp config appsettings set \
  --resource-group iqube-rg \
  --name iqube-backend \
  --settings \
    DB_SERVER="iqube-sql-server.database.windows.net" \
    DB_DATABASE="iqube_db" \
    DB_USER="iqubeadmin" \
    DB_PASSWORD="YourSecurePassword123!" \
    DB_PORT="1433" \
    JWT_SECRET="your-super-secret-jwt-key-change-this-in-production" \
    JWT_EXPIRES_IN="7d" \
    NODE_ENV="production" \
    FRONTEND_URL="https://your-frontend-domain.com" \
    RATE_LIMIT_WINDOW_MS="900000" \
    RATE_LIMIT_MAX_REQUESTS="100"
```

## 📦 Step 3: Deploy Backend Code

### 3.1 Prepare for Deployment
```bash
cd backend
npm install
```

### 3.2 Deploy using Azure CLI
```bash
az webapp deployment source config-zip \
  --resource-group iqube-rg \
  --name iqube-backend \
  --src backend.zip
```

### 3.3 Alternative: Deploy using Git
```bash
# Configure deployment source
az webapp deployment source config \
  --resource-group iqube-rg \
  --name iqube-backend \
  --repo-url https://github.com/your-username/your-repo.git \
  --branch main \
  --manual-integration

# Or use local git deployment
az webapp deployment source config-local-git \
  --resource-group iqube-rg \
  --name iqube-backend

# Add Azure remote and push
git remote add azure https://iqube-backend.scm.azurewebsites.net:443/iqube-backend.git
git push azure main
```

## 🔒 Step 4: Security Configuration

### 4.1 Create Key Vault (Optional but Recommended)
```bash
az keyvault create \
  --name iqube-keyvault \
  --resource-group iqube-rg \
  --location "East US"
```

### 4.2 Store Secrets in Key Vault
```bash
az keyvault secret set \
  --vault-name iqube-keyvault \
  --name "db-password" \
  --value "YourSecurePassword123!"

az keyvault secret set \
  --vault-name iqube-keyvault \
  --name "jwt-secret" \
  --value "your-super-secret-jwt-key"
```

## 🌐 Step 5: Frontend Deployment (Static Web App)

### 5.1 Create Static Web App
```bash
az staticwebapp create \
  --name iqube-frontend \
  --resource-group iqube-rg \
  --source https://github.com/your-username/your-repo.git \
  --location "East US2" \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist"
```

## 🧪 Step 6: Test Your Deployment

### 6.1 Check Backend Health
```bash
curl https://iqube-backend.azurewebsites.net/health
```

### 6.2 Test Database Connection
The backend will automatically initialize the database tables on first run.

## 💰 Cost Monitoring

### Free Tier Limits:
- **Azure SQL Database**: 32GB storage (always free)
- **App Service**: 1GB storage, 1 hour/day runtime (always free)
- **Static Web Apps**: 100GB bandwidth/month (always free)
- **Key Vault**: 10,000 operations/month (always free)

### Monitor Usage:
```bash
# Check resource usage
az consumption usage list --top 10
```

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check firewall rules
   - Verify connection string
   - Ensure SQL server is running

2. **App Service Not Starting**
   - Check application logs: `az webapp log tail --resource-group iqube-rg --name iqube-backend`
   - Verify Node.js version compatibility

3. **CORS Issues**
   - Update FRONTEND_URL environment variable
   - Check allowed origins in backend code

### Useful Commands:
```bash
# View app logs
az webapp log tail --resource-group iqube-rg --name iqube-backend

# Restart app
az webapp restart --resource-group iqube-rg --name iqube-backend

# Check app status
az webapp show --resource-group iqube-rg --name iqube-backend --query state
```

## 🎉 Next Steps

1. Configure custom domain (optional)
2. Set up SSL certificate
3. Configure monitoring and alerts
4. Set up CI/CD pipeline
5. Implement backup strategy

## 📞 Support

If you encounter issues:
1. Check Azure documentation
2. Review application logs
3. Verify environment variables
4. Test database connectivity

Your iQube backend should now be running on Azure! 🚀
