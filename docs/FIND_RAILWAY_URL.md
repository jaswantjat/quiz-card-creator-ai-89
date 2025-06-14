# 🔍 How to Find Your Railway Deployment URL

This guide helps you locate your actual Railway deployment URL for the iMocha project.

## 🚂 Method 1: Railway Dashboard (Recommended)

### Step-by-Step Instructions:
1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Sign in** with your Railway account
3. **Find your iMocha project**:
   - Look for project names like "imocha", "question-generator", "fullstack", etc.
   - Check the project description or repository name
4. **Click on the project** to open it
5. **Look for the deployment URL**:
   - Check the "Deployments" tab
   - Look for a URL like `https://[project-name].railway.app`
   - Or `https://[random-string].up.railway.app`

### What to Look For:
- ✅ **Active deployment** (green status)
- ✅ **Recent deployment** (within last few days/weeks)
- ✅ **Successful build** (no error indicators)

## 🔗 Method 2: Check Git Repository

### GitHub/GitLab Integration:
1. **Check your Git repository** for Railway integration
2. **Look for deployment badges** or links in README
3. **Check repository settings** for webhook URLs
4. **Review commit messages** for deployment URLs

## 🌐 Method 3: Test Common URL Patterns

If you know your Railway project name, try these patterns:
```bash
# Common Railway URL patterns
https://[project-name].railway.app
https://[project-name].up.railway.app
https://[random-id].railway.app
https://[random-id].up.railway.app

# Test with our detection script
npm run detect-railway-ip https://[your-url]
```

## 🧪 Method 4: Use Our Detection Script to Verify

Once you find a potential URL, verify it's the right one:

```bash
# Test if it's the iMocha app
npm run detect-railway-ip https://your-potential-url.railway.app

# Look for these indicators in the response:
# ✅ Database status endpoint exists (/api/status/database)
# ✅ Returns JSON response (not HTML)
# ✅ Shows database connection errors (expected)
# ✅ Mentions Azure SQL or database configuration
```

## 🔍 Method 5: Railway CLI (Advanced)

If you have Railway CLI installed:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and list projects
railway login
railway list

# Get project info
railway status
railway domain
```

## 🚨 Troubleshooting

### If You Can't Find the URL:
1. **Check if the project is deployed**:
   - Railway dashboard shows "Deployed" status
   - No build errors in the logs
   - Environment variables are set

2. **Verify the project is active**:
   - Recent deployments (not months old)
   - No "sleeping" or "paused" status
   - Health checks are passing

3. **Check for custom domains**:
   - Project might use a custom domain instead of .railway.app
   - Look in Railway dashboard under "Settings" → "Domains"

### If the URL Doesn't Work:
1. **Check the health endpoint**:
   ```bash
   curl https://your-url.railway.app/health
   ```

2. **Verify it's the right service**:
   ```bash
   curl https://your-url.railway.app/api/status/database
   ```

3. **Check Railway logs**:
   - Go to Railway dashboard
   - Select your project
   - Click "Logs" tab
   - Look for startup errors

## 📋 Quick Checklist

Before proceeding with IP detection:
- [ ] Found Railway deployment URL
- [ ] URL responds to requests (not 404)
- [ ] `/health` endpoint works
- [ ] `/api/status/database` endpoint exists
- [ ] Response is JSON (not HTML)
- [ ] Shows database connection errors (expected)

## 🎯 Next Steps

Once you have the correct Railway URL:
1. **Run IP detection**: `npm run detect-railway-ip https://your-url.railway.app`
2. **Follow firewall instructions** from the script output
3. **Test database connection** after firewall changes
4. **Monitor for IP changes** going forward

---

**Need Help?** If you still can't find your Railway URL, check:
- Railway dashboard project list
- Git repository deployment settings
- Recent deployment notifications/emails
- Railway CLI project status
