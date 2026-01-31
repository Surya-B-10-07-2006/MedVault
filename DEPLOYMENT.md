# MedVault Netlify Full-Stack Deployment Guide

## Prerequisites
- Node.js 18+
- Git
- Netlify CLI
- MongoDB Atlas account

## Deployment Steps

### 1. Setup MongoDB Atlas
1. Create MongoDB Atlas cluster
2. Get connection string
3. Whitelist 0.0.0.0/0 for serverless functions

### 2. Deploy to Netlify

**Option A: Git Integration (Recommended)**
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build settings:
   - Base directory: `.` (root directory)
   - Build command: `npm run build:all`
   - Publish directory: `frontend/dist`
   - Functions directory: `netlify/functions`

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
npm run build:all
netlify deploy --prod
```

### 3. Environment Variables
Set in Netlify Dashboard > Site Settings > Environment Variables:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medvault
JWT_SECRET=your_super_secure_jwt_secret_key_here
REFRESH_SECRET=your_super_secure_refresh_secret_key_here
JWT_EXPIRE=15m
REFRESH_EXPIRE=7d
FRONTEND_URL=https://your-site-name.netlify.app
```

### 4. Test Deployment
- Frontend: https://your-site-name.netlify.app
- API Health: https://your-site-name.netlify.app/.netlify/functions/api/health

## Architecture
- **Frontend**: React app served as static files
- **Backend**: Express.js API running as Netlify Functions
- **Database**: MongoDB Atlas (cloud)
- **File Storage**: Netlify Functions with base64 encoding

## Quick Commands
```bash
# Install all dependencies
npm run install:all

# Build for production
npm run build:all

# Deploy to Netlify
npm run deploy:netlify
```

## ✅ Single Platform Deployment Complete!
Both frontend and backend now run on Netlify infrastructure.