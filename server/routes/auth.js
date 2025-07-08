const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { registerValidation, loginValidation, changePasswordValidation } = require('../utils/validators');

// Public routes
router.post('/register', registerValidation, validateRequest, AuthController.register);
router.post('/login', loginValidation, validateRequest, AuthController.login);

// Protected routes
router.get('/profile', auth, AuthController.getProfile);
router.post('/logout', auth, AuthController.logout);
router.post('/change-password', auth, changePasswordValidation, validateRequest, AuthController.changePassword);

module.exports = router;
