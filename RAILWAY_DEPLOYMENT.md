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

#### Database Configuration
```
DB_SERVER=iqube-sql-jaswant.database.windows.net
DB_DATABASE=iqube_db
DB_USER=CloudSAaf673f5f
DB_PASSWORD=Mh15ga2226
```

#### Security Configuration
```
JWT_SECRET=your-super-secure-jwt-secret-for-production-make-it-very-long-and-random
```

#### CORS Configuration
```
FRONTEND_URL=https://your-frontend-domain.com
```

### Step 3: Deploy
1. Railway will automatically detect the Node.js app
2. It will use the `railway.toml` configuration
3. The app will start with `cd backend && npm start`
4. Health check endpoint: `/health`

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
