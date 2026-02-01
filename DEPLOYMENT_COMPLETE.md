# MedVault Deployment Guide

Complete deployment guide for MedVault across multiple platforms.

## 🚀 Quick Deploy Commands

```bash
# Install all dependencies
npm run install:all

# Build for production
npm run build:all

# Deploy to specific platforms
npm run deploy:netlify    # Netlify
npm run deploy:vercel     # Vercel
npm run deploy:render     # Render
npm run deploy:heroku     # Heroku

# Docker deployment
npm run docker:build      # Build Docker image
npm run docker:run        # Run with Docker Compose
```

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account (recommended)
- Git repository
- Platform-specific CLI tools (optional)

## 🌐 Platform Deployments

### 1. Render (Recommended for Beginners)

**Setup:**
1. Fork/clone repository to GitHub
2. Create Render account
3. Create MongoDB Atlas database
4. Use `render.yaml` configuration

**Steps:**
1. Connect GitHub repository to Render
2. Render will auto-detect `render.yaml`
3. Set environment variables:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medvault
   JWT_SECRET=your_jwt_secret_32_chars_minimum
   REFRESH_SECRET=your_refresh_secret_32_chars_minimum
   ```
4. Deploy automatically triggers

**URLs:**
- Backend: `https://medvault-backend.onrender.com`
- Frontend: `https://medvault-frontend.onrender.com`

### 2. Netlify (Full-Stack Serverless)

**Setup:**
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Create MongoDB Atlas database

**Deploy:**
```bash
npm run build:all
netlify deploy --prod
```

**Environment Variables (Netlify Dashboard):**
```
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medvault
JWT_SECRET=your_jwt_secret_32_chars_minimum
REFRESH_SECRET=your_refresh_secret_32_chars_minimum
FRONTEND_URL=https://your-site.netlify.app
```

### 3. Vercel (Next.js Style)

**Setup:**
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`

**Deploy:**
```bash
vercel --prod
```

**Environment Variables:**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medvault
JWT_SECRET=your_jwt_secret_32_chars_minimum
REFRESH_SECRET=your_refresh_secret_32_chars_minimum
```

### 4. Heroku (Traditional PaaS)

**Setup:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create medvault-app`

**Deploy:**
```bash
git push heroku main
```

**Environment Variables:**
```bash
heroku config:set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medvault
heroku config:set JWT_SECRET=your_jwt_secret_32_chars_minimum
heroku config:set REFRESH_SECRET=your_refresh_secret_32_chars_minimum
```

### 5. Railway (Modern PaaS)

**Setup:**
1. Connect GitHub repository to Railway
2. Railway auto-detects `railway.json`
3. Set environment variables in Railway dashboard

### 6. DigitalOcean App Platform

**Setup:**
1. Use `.do/app.yaml` configuration
2. Connect GitHub repository
3. Set secrets in DO dashboard

### 7. Docker (Self-Hosted)

**Local Development:**
```bash
docker-compose up -d
```

**Production:**
```bash
docker build -t medvault .
docker run -p 80:5000 medvault
```

## 🔧 Environment Variables

### Required Variables
```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medvault
JWT_SECRET=minimum_32_characters_secure_random_string
REFRESH_SECRET=minimum_32_characters_secure_random_string
```

### Optional Variables
```bash
PORT=5000
JWT_EXPIRE=15m
REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for serverless)
4. Get connection string

### Local MongoDB (Development)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Connection string
MONGO_URI=mongodb://localhost:27017/medvault
```

## 🔒 Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] MongoDB connection secured
- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] File upload limits set

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm run install:all
```

**Database Connection:**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has correct permissions

**CORS Errors:**
- Update FRONTEND_URL environment variable
- Check domain spelling and protocol (https://)

**File Upload Issues:**
- Verify platform file size limits
- Check multer configuration
- Ensure GridFS is properly configured

### Platform-Specific Issues

**Netlify:**
- Functions timeout after 10 seconds (free tier)
- 50MB deployment size limit
- Use base64 encoding for file storage

**Vercel:**
- 50MB deployment limit
- Serverless function timeout limits
- Edge runtime limitations

**Render:**
- Free tier sleeps after 15 minutes
- Build time limits
- Persistent storage limitations

## 📊 Performance Optimization

### Frontend
- Code splitting implemented
- Static asset caching
- Gzip compression enabled
- Image optimization

### Backend
- Database indexing
- Query optimization
- Rate limiting
- Caching headers

## 🔄 CI/CD Pipeline

GitHub Actions workflow included:
- Automated testing
- Multi-platform deployment
- Environment-specific builds

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Verify environment variables
3. Review application logs
4. Test database connectivity

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and secured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Error tracking configured
- [ ] Performance monitoring active

## 🔗 Useful Links

- [MongoDB Atlas](https://cloud.mongodb.com)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com)
- [Railway Documentation](https://docs.railway.app)
- [DigitalOcean Documentation](https://docs.digitalocean.com/products/app-platform)