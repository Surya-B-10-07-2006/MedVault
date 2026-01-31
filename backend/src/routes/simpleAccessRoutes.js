const express = require('express');
const router = express.Router();
const simpleAccessController = require('../controllers/simpleAccessController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('doctor', 'admin'));

router.post('/request-by-name', simpleAccessController.requestAccessByName);
router.get('/my-accessible-records', simpleAccessController.getAccessibleRecords);

module.exports = router;