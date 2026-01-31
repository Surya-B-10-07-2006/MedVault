# MedVault Netlify Full-Stack Deployment Checklist

## ✅ Files Created/Updated:
- [x] netlify.toml - Full-stack Netlify configuration
- [x] netlify/functions/api.js - Serverless backend handler
- [x] netlify/functions/package.json - Functions dependencies
- [x] frontend/.env.production - Netlify functions API URL
- [x] frontend/src/utils/api.js - Updated for Netlify functions
- [x] backend/src/config/db.js - Serverless database connection
- [x] package.json - Netlify build scripts
- [x] .env.netlify - Environment variables template

## 🚀 Single Platform Deployment:

### Netlify (Frontend + Backend):
1. Connect GitHub repo to Netlify
2. Set build settings:
   - Base: `frontend`
   - Build: `npm run build:all`
   - Publish: `frontend/dist`
   - Functions: `netlify/functions`
3. Add environment variables in Netlify dashboard

## 🔧 Environment Variables (Netlify Dashboard):
- NODE_ENV=production
- MONGO_URI=mongodb+srv://...
- JWT_SECRET=strong_secret
- REFRESH_SECRET=strong_secret
- FRONTEND_URL=https://your-site.netlify.app

## 🌐 URLs:
- App: https://your-site.netlify.app
- API: https://your-site.netlify.app/.netlify/functions/api/health

## ✅ Ready for Single Platform Deployment!