const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('doctor', 'admin'));

router.get('/shared', doctorController.getShared);
router.post('/request', doctorController.requestAccess);
router.get('/requests', doctorController.getMyRequests);
router.get('/patients', doctorController.getPatients);
router.get('/search-patients', doctorController.searchPatients);
router.get('/search-doctors', doctorController.searchDoctors);

module.exports = router;
