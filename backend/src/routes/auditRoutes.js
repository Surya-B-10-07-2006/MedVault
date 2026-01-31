const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', auditController.getMyLogs);

module.exports = router;
