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
Railway is now configured with definitive fixes for subdirectory deployment:

#### **Automatic Configuration**:
1. **Working Directory**: Set to `backend` in `railway.toml`
2. **Build Process**: `npm install --omit=dev` (resolves npm warnings)
3. **Start Command**: `node --experimental-specifier-resolution=node server.js`
4. **IPv6 Binding**: Server binds to `::` for Railway compatibility
5. **Health Check**: Optimized `/health` endpoint with 10s intervals

#### **Manual Railway Dashboard Settings**:
If automatic config fails, set manually:
- **Settings → Build → Root Directory**: `backend`
- **Settings → Deploy → Start Command**: `npm run railway:start`

### Troubleshooting Guide

| Error | Cause | Solution |
|-------|-------|----------|
| `ERR_MODULE_NOT_FOUND: express` | npm install not in backend dir | Verify Root Directory = `backend` |
| `service unavailable` | IPv4/IPv6 binding mismatch | Server now binds to `::` (IPv6) |
| `Address already in use` | PORT conflict | Railway sets PORT automatically |
| `Healthcheck timeout` | Slow startup | Increased timeout to 60s |

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
