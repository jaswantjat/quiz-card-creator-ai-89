# Railway Deployment Guide - UPDATED

## 🚀 Deploy to Railway (Fixed for Monorepo Structure)

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with this code
- Azure SQL Database (already configured)

### Step 1: Connect Repository
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose this repository

### Step 2: Configure Railway Service Settings
**CRITICAL**: Set the root directory to backend subdirectory:
1. In Railway dashboard, go to your service
2. Click "Settings" tab
3. Under "Build & Deploy", set:
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty - Docker will handle this)
   - **Start Command**: (leave empty - Docker will handle this)

### Step 3: Configure Environment Variables
In Railway dashboard, add these environment variables:

#### Required Environment Variables
```
NODE_ENV=production
PORT=${{RAILWAY_PORT}}
DB_SERVER=iqube-sql-jaswant.database.windows.net
DB_DATABASE=iqube_db
DB_USER=CloudSAaf673f5f
DB_PASSWORD=Mh15ga2226
JWT_SECRET=your-super-secure-jwt-secret-for-production-make-it-very-long-and-random
FRONTEND_URL=https://your-frontend-domain.com
```

#### Important Notes:
- `PORT=${{RAILWAY_PORT}}` - Railway will automatically set this
- Generate a strong JWT_SECRET for production
- Update FRONTEND_URL with your actual frontend domain

### Step 3: Deploy
Railway is now configured with Docker for maximum reliability:

#### **Docker Configuration** (Recommended):
1. **Builder**: Uses `dockerfile` for consistent environment
2. **Dependencies**: `npm install --omit=dev` (62% size reduction)
3. **Security**: Non-root user (nodejs:1001)
4. **Health Check**: Dynamic port support with curl
5. **ESM Support**: `--experimental-specifier-resolution=node`
6. **IPv6 Binding**: Server binds to `::` for Railway compatibility

#### **Automatic Features**:
- **Layer Caching**: Package.json copied first for faster rebuilds
- **Security**: Non-root container execution
- **Optimization**: Cache cleaning and dependency pruning
- **Health Monitoring**: 10s intervals, 5s timeout, 3 retries

#### **Alternative: Nixpacks**:
If Docker fails, Railway can fall back to Nixpacks:
- Uncomment `nixpacks.toml` configuration
- Update `railway.toml`: `builder = "nixpacks"`

### Troubleshooting Guide

#### Common Issues and Solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find package 'express'` | Wrong root directory or Nixpacks used | 1. Set Root Directory = `backend`<br>2. Ensure nixpacks.toml is commented out<br>3. Force redeploy |
| `Nixpacks detected instead of Docker` | nixpacks.toml file present | Comment out nixpacks.toml content |
| `service unavailable` | IPv4/IPv6 binding mismatch | Server binds to `::` (IPv6) - fixed in server.js |
| `Address already in use` | PORT conflict | Railway sets PORT automatically |
| `Healthcheck timeout` | Slow startup | Increased timeout to 60s |
| `Build fails with dependency errors` | Cache issues | Clear Railway build cache and redeploy |

#### Step-by-Step Troubleshooting:

1. **If Railway uses Nixpacks instead of Docker:**
   ```bash
   # Ensure nixpacks.toml is commented out (already done)
   # Force Railway to use Dockerfile by setting in railway.toml:
   # builder = "dockerfile"
   # dockerfilePath = "Dockerfile"
   ```

2. **If dependencies are not found:**
   ```bash
   # Check Railway service settings:
   # Root Directory MUST be set to: backend
   # This ensures Docker runs from the correct directory
   ```

3. **If build succeeds but app won't start:**
   ```bash
   # Check Railway logs for specific error
   # Verify environment variables are set
   # Test locally with: cd backend && npm run verify-deployment
   ```

### Post-Deployment Verification
```bash
# Check dependency installation
railway run npm ls express

# Test health endpoint
curl -I https://your-app.railway.app/health

# Verify IPv6 binding
railway run netstat -tuln | grep $PORT
```

### Step 4: Initialize Database
After deployment, run the database initialization:
1. Go to Railway dashboard
2. Open the service terminal
3. Run: `npm run init-db`

### Step 5: Test Deployment
- Health check: `https://your-app.railway.app/health`
- API endpoints: `https://your-app.railway.app/api/`

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_SERVER` | Azure SQL Server | `iqube-sql-jaswant.database.windows.net` |
| `DB_DATABASE` | Database name | `iqube_db` |
| `DB_USER` | Database username | `CloudSAaf673f5f` |
| `DB_PASSWORD` | Database password | `Mh15ga2226` |
| `JWT_SECRET` | JWT signing secret | `your-secure-secret` |
| `FRONTEND_URL` | Frontend domain | `https://your-frontend.com` |
| `PORT` | Server port (auto-set by Railway) | `3000` |

## 🚨 Security Notes
- Never commit `.env` files to git
- Use Railway's environment variables for production
- Generate a new JWT_SECRET for production
- Consider using Railway's database service for better integration
