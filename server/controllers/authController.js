const Auth = require('../models/Auth');
const User = require('../models/User');
const PageGroup = require('../models/PageGroup');

class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const { name, username, email, password, designation, contact, district, idGroup } = req.body;

      // Use Auth model for registration
      const result = await Auth.register({
        name,
        username,
        email,
        password,
        designation,
        contact,
        district,
        idGroup
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

      // Create session (Laravel-style)
      req.session.userId = result.user.id;
      req.session.user = result.user;

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
      // Check if the user has permission to view the profile page (Laravel-like)
      const permission = await PageGroup.getUserRights(req.user.idGroup, '', 'profile.index');

      /*==========Log=============*/
      const trackarray = {
        activityName: "User Profile",
        action: "View Profile -> Function: AuthController/getProfile()",
        PostData: "",
        affectedKey: "",
        idUser: req.user.id,
        username: req.user.username,
      };
      /*==========Log=============*/

      if (permission.length > 0 && permission[0].CanView === 1) {
        // User is already attached to req by auth middleware
        trackarray.mainResult = "Success";
        trackarray.result = "View Success";
        // Custom_Model::trackLogs($trackarray, "all_logs"); // TODO: Implement logging

        res.json({
          success: true,
          data: {
            user: req.user.toJSON(),
            permission: permission[0]
          }
        });
      } else {
        trackarray.mainResult = "Error";
        trackarray.result = "View Error - Access denied";
        // Custom_Model::trackLogs($trackarray, "all_logs"); // TODO: Implement logging

        res.status(403).json({
          success: false,
          message: 'Access denied: You do not have permission to view this page.'
        });
      }
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during profile retrieval'
      });
    }
  }

  // Logout (Laravel-style session destroy)
  static async logout(req, res) {
    try {
      await Auth.logout(req);
      
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
      // Check if the user has permission to change password (Laravel-like)
      const permission = await PageGroup.getUserRights(req.user.idGroup, '', 'change-password.index');

      /*==========Log=============*/
      const trackarray = {
        activityName: "Change Password",
        action: "Change Password -> Function: AuthController/changePassword()",
        PostData: JSON.stringify(req.body),
        affectedKey: req.user.id,
        idUser: req.user.id,
        username: req.user.username,
      };
      /*==========Log=============*/

      if (permission.length > 0 && permission[0].CanEdit === 1) {
        const { currentPassword, newPassword } = req.body;
        
        await Auth.changePassword(req.user.id, currentPassword, newPassword);

        trackarray.mainResult = "Success";
        trackarray.result = "Password Changed Successfully";
        // Custom_Model::trackLogs($trackarray, "all_logs"); // TODO: Implement logging

        res.json({
          success: true,
          message: 'Password changed successfully'
        });
      } else {
        trackarray.mainResult = "Error";
        trackarray.result = "Change Password Error - Access denied";
        // Custom_Model::trackLogs($trackarray, "all_logs"); // TODO: Implement logging

        res.status(403).json({
          success: false,
          message: 'Access denied: You do not have permission to change password.'
        });
      }
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
