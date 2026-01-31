const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/recordsController');
const { revokeAccess } = require('../controllers/revokeController');
const { protect, restrictTo } = require('../middleware/auth');
const { singleUpload } = require('../middleware/upload');

router.use(protect);

router.get('/access-summary', restrictTo('patient', 'admin'), recordsController.getAccessSummary);
router.get('/my-records', recordsController.getByPatient);
router.post('/upload', singleUpload, recordsController.upload);
router.get('/:patientId', recordsController.getByPatient);
router.patch('/:recordId/revoke', restrictTo('patient', 'admin'), revokeAccess);
router.get('/view/:recordId', recordsController.viewOne);
router.get('/download/:recordId', recordsController.download);
router.delete('/:recordId', restrictTo('patient', 'admin'), recordsController.deleteRecord);

module.exports = router;
