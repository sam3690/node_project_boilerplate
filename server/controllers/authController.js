const Auth = require('../models/Auth');
const User = require('../models/User');

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      // Use Auth model for registration
      const result = await Auth.register({
        username,
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific database errors
      if (error.number === 2627 || error.number === 2601) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error during registration'
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Use Auth model for login
      const result = await Auth.login(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid credentials'
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      // User is already attached to req by auth middleware
      res.json({
        success: true,
        data: {
          user: req.user.toJSON()
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      // Generate new token for current user
      const token = Auth.generateToken(req.user.id);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during token refresh'
      });
    }
  }

  // Logout (client-side token removal, could be enhanced with token blacklisting)
  static async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      await Auth.logout(token);
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await Auth.changePassword(req.user.id, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to change password'
      });
    }
  }
}

module.exports = AuthController;
