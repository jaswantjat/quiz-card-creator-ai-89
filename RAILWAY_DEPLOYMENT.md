# Railway Deployment Guide

## 🚀 Deploy to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with this code
- Azure SQL Database (already configured)

### Step 1: Connect Repository
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose this repository

### Step 2: Configure Environment Variables
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
Railway is now configured to use Nixpacks with explicit subdirectory handling:

1. **Build Process**: `cd backend && npm ci --only=production`
2. **Dependency Verification**: Automatic verification of critical packages
3. **Start Command**: `cd backend && npm start`
4. **Health Check**: `/health` endpoint with immediate response

### Troubleshooting ERR_MODULE_NOT_FOUND
If you encounter "Cannot find package 'express'" errors:

1. **Check Build Logs**: Verify `npm ci` runs in `/backend` directory
2. **Dependency Verification**: Look for "✅ express - Found" in logs
3. **Manual Verification**: Use Railway terminal to run `npm run verify`

### Alternative: Docker Deployment
If Nixpacks fails, switch to Docker:
1. Update `railway.toml`: `builder = "dockerfile"`
2. The Dockerfile handles subdirectory dependencies automatically

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
