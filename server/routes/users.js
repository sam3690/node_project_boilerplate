const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { updateProfileValidation, changePasswordValidation } = require('../utils/validators');

// All user routes require authentication
router.use(auth);

// User profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', updateProfileValidation, validateRequest, UserController.updateProfile);
router.post('/change-password', changePasswordValidation, validateRequest, UserController.changePassword);
router.delete('/account', UserController.deleteAccount);

// Admin routes (you can add role-based middleware here)
router.get('/all', UserController.getAllUsers);

module.exports = router;
