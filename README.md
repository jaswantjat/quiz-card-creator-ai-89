# iQube - Full-Stack AI Question Generator for iMocha

A modern, full-stack web application that generates intelligent questions for educational and assessment purposes. Built with React frontend and Express backend, deployed as a single application on Railway.

## 🚀 Features

- **AI-Powered Question Generation**: Generate questions across various topics
- **Multiple Question Types**: Support for text-based and multiple-choice questions
- **Difficulty Levels**: Easy, Medium, and Hard question generation
- **User Authentication**: Secure login and registration system
- **Question Management**: Save and retrieve generated questions
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Full-Stack Deployment**: Single deployment serving both frontend and backend

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching

### Backend
- **Node.js** with Express.js
- **Azure SQL Database** for data storage
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for input validation
- **Rate limiting** and security middleware

### Deployment
- **Railway** with Nixpacks
- **Full-stack deployment** (React + Express)
- **Azure SQL** database integration

## 📦 Installation

### Prerequisites
- Node.js 18+
- Azure SQL Database (configured)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iqube-question-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run init-db
   ```

5. **Development**
   ```bash
   # Start both frontend and backend (recommended)
   npm run dev

   # Or start individually:
   npm run dev:frontend  # React dev server on :8080
   npm run dev:backend   # Express server on :3001
   ```

## 🚀 Full-Stack Deployment on Railway

### Automatic Deployment
1. **Connect Repository**: Link your GitHub repo to Railway
2. **Set Environment Variables** (see below)
3. **Deploy**: Push to main branch - Railway builds both frontend and backend

### Environment Variables (Railway Dashboard)
```bash
NODE_ENV=production
PORT=8080

# Azure SQL Database
DB_SERVER=iqube-sql-jaswant.database.windows.net
DB_DATABASE=iqube_db
DB_USER=CloudSAaf673f5f
DB_PASSWORD=Mh15ga2226

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-for-production

# CORS
FRONTEND_URL=https://your-app.railway.app
```

### Azure SQL Firewall Configuration
Add Railway's IP address to Azure SQL firewall rules:
1. Go to Azure Portal → SQL Server → Networking
2. Add Railway IP: `208.77.244.3` (check Railway logs for current IP)
3. Save firewall rules

### Deployment Process
```bash
# Railway automatically runs:
npm install                    # Install all dependencies
npm run railway:build         # Build React frontend
npm run railway:start         # Start Express server
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start React dev server (:8080)
- `npm run dev:backend` - Start Express server (:3001)

### Production
- `npm run build` - Build React app for production
- `npm run railway:build` - Build frontend + backend for Railway
- `npm run railway:start` - Start production server
- `npm start` - Start production server

### Database & Utilities
- `npm run init-db` - Initialize database tables
- `npm run verify-deployment` - Verify deployment configuration

## 🌐 How Full-Stack Deployment Works

### Production Mode
1. **Build Process**: Vite builds React app to `/dist` directory
2. **Server Setup**: Express serves React build files as static assets
3. **API Routes**: Express handles `/api/*` routes for backend functionality
4. **React Router**: Express catch-all route serves React app for client-side routing

### Development Mode
1. **Frontend**: Vite dev server on port 8080
2. **Backend**: Express server on port 3001
3. **API Calls**: Frontend makes requests to `http://localhost:3001/api`

### URL Structure
```
Production (Railway):
https://your-app.railway.app/          → React App
https://your-app.railway.app/api/      → Express API
https://your-app.railway.app/health    → Health Check

Development:
http://localhost:8080/                 → React App (Vite)
http://localhost:3001/api/             → Express API
http://localhost:3001/health           → Health Check
```

## 🚀 Deployment Status

✅ **Backend**: Running successfully on Railway
✅ **Health Check**: Working (200 response)
✅ **Question Generation**: Public API working
✅ **Topics Endpoint**: Available
⚠️ **Database**: Requires Azure SQL firewall configuration
🔄 **Frontend**: Deploying with this update

## 📄 License

This project is licensed under the MIT License.
