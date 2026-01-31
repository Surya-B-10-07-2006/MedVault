const express = require('express');
const { generateCodeForRecord, accessRecordByCode } = require('../controllers/codeAccessController');
const { quickAccess } = require('../controllers/quickAccessController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate code for record (patient only)
router.post('/generate/:recordId', protect, generateCodeForRecord);

// Access record by code (doctor only)
router.post('/access', protect, accessRecordByCode);

// Quick access by code only (doctor only)
router.post('/quick-access', protect, quickAccess);

module.exports = router;