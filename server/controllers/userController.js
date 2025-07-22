const User = require('../models/User');
const db = require('../database/connection');

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
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

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, email } = req.body;

      // Check if email is being changed and if it already exists
      if (email && email !== req.user.email) {
        const emailExists = await User.emailExists(email, req.user.id);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      // Update user profile
      const updatedUser = await req.user.updateProfile({
        firstName,
        lastName,
        email
      });

      if (!updatedUser) {
        return res.status(400).json({
          success: false,
          message: 'Failed to update profile'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser.toJSON()
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      
      // Handle specific database errors
      if (error.number === 2627 || error.number === 2601) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during profile update'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      await req.user.changePassword(currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);

      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during password change'
      });
    }
  }

  // Delete user account (soft delete)
  static async deleteAccount(req, res) {
    try {
      // In a real application, you might want to implement soft delete
      // For now, we'll just deactivate the user
      await db.query(
        'UPDATE Users SET is_active = 0 WHERE id = @id',
        { id: req.user.id }
      );

      res.json({
        success: true,
        message: 'Account deactivated successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during account deletion'
      });
    }
  }

  // Get all users (admin only - you can add role-based access control)
  static async getAllUsers(req, res) {
    try {
      // This is a basic implementation - you should add proper admin role checking
      const query = `
        SELECT id, username, email,  created_at, updated_at
        FROM users_dash 
        WHERE deleteBy IS NULL or deleteby = ''
        ORDER BY created_at asc
      `;

      const result = await db.query(query);

      res.json({
        success: true,
        data: {
          users: result.recordset
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = UserController;
