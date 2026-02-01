const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

// Import routes
const authRoutes = require('../../backend/src/routes/authRoutes');
const userRoutes = require('../../backend/src/routes/userRoutes');
const recordRoutes = require('../../backend/src/routes/recordRoutes');
const doctorRoutes = require('../../backend/src/routes/doctorRoutes');
const requestRoutes = require('../../backend/src/routes/requestRoutes');
const auditRoutes = require('../../backend/src/routes/auditRoutes');

// Import middleware
const { errorHandler } = require('../../backend/src/middleware/errorHandler');

// Import database connection
const connectDB = require('../../backend/src/config/db');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://medvault.netlify.app',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data sanitization
app.use(mongoSanitize());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/audit', auditRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports.handler = serverless(app);