const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/avatar', userController.updateAvatar);

module.exports = router;
