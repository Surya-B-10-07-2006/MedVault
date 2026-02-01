require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const auditRoutes = require('./src/routes/auditRoutes');
const userRoutes = require('./src/routes/userRoutes');
const requestRoutes = require('./src/routes/requestRoutes');
const simpleAccessRoutes = require('./src/routes/simpleAccessRoutes');
const codeAccessRoutes = require('./src/routes/codeAccessRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs for auth routes
  message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes' },
});

app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/user', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/access', simpleAccessRoutes);
app.use('/api/code', codeAccessRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'MedVault API running' }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from frontend build
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ success: false, error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`MedVault server running on port ${PORT}`);
});
