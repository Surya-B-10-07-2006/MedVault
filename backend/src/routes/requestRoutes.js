const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('patient', 'admin'));

router.get('/', requestController.getForPatient);
router.patch('/:id/respond', requestController.respond);
router.delete('/clear-pending', requestController.clearPending);

module.exports = router;
