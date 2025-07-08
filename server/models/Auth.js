const db = require('../database/connection');
const bcrypt = require('bcryptjs');
const User = require('./User');

class Auth {
  // Register a new user
  static async register(userData) {
    try {
      const { name, username, email, password, designation, contact, district, idGroup } = userData;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        throw new Error('Username already taken');
      }
      
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        name,
        username,
        email,
        passwordHash,
        designation,
        contact,
        district,
        idGroup,
        createdBy: 'system'
      });

      if (user) {
        return {
          user: user.toJSON()
        };
      }
      
      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Authenticate user login (Laravel-style)
  static async login(email, password) {
    try {
      const query = `
        SELECT * FROM users_dash 
        WHERE email = @email AND status = 1
      `;

      const result = await db.query(query, { email });

      if (result.recordset.length === 0) {
        throw new Error('Invalid credentials');
      }

      const userData = result.recordset[0];
      
      // Check password attempts and lockout
      if (userData.attempt >= 5) {
        throw new Error('Account locked due to too many failed attempts');
      }

      const isValidPassword = await bcrypt.compare(password, userData.password);

      if (!isValidPassword) {
        // Increment failed attempts
        await this.incrementFailedAttempts(userData.id);
        throw new Error('Invalid credentials');
      }

      // Reset failed attempts on successful login
      await this.resetFailedAttempts(userData.id);

      const user = new User(userData);

      return {
        user: user.toJSON()
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Increment failed login attempts
  static async incrementFailedAttempts(userId) {
    try {
      const query = `
        UPDATE users_dash 
        SET attempt = ISNULL(attempt, 0) + 1, 
            attemptDateTime = GETDATE(),
            updateBy = 'system',
            updated_at = GETDATE()
        WHERE id = @userId
      `;

      await db.query(query, { userId });
    } catch (error) {
      console.error('Error incrementing failed attempts:', error);
      throw error;
    }
  }

  // Reset failed login attempts
  static async resetFailedAttempts(userId) {
    try {
      const query = `
        UPDATE users_dash 
        SET attempt = 0, 
            attemptDateTime = NULL,
            updateBy = 'system',
            updated_at = GETDATE()
        WHERE id = @userId
      `;

      await db.query(query, { userId });
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
      throw error;
    }
  }

  // Change password (requires current password verification)
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const query = `
        SELECT password FROM users_dash 
        WHERE id = @id AND status = 1
      `;

      const result = await db.query(query, { id: userId });

      if (result.recordset.length === 0) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(currentPassword, result.recordset[0].password);

      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const updateQuery = `
        UPDATE users_dash 
        SET password = @newPasswordHash,
            lastPwdChangeBy = @userId,
            lastPwd_dt = GETDATE(),
            updateBy = @userId,
            updated_at = GETDATE(),
            isNewUser = 0
        WHERE id = @id
      `;

      await db.query(updateQuery, {
        newPasswordHash,
        id: userId,
        userId: userId.toString()
      });

      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Reset password (for forgot password functionality)
  static async resetPassword(email, newPassword) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const updateQuery = `
        UPDATE users_dash 
        SET password = @newPasswordHash,
            lastPwdChangeBy = 'admin',
            lastPwd_dt = GETDATE(),
            updateBy = 'system',
            updated_at = GETDATE(),
            attempt = 0,
            attemptDateTime = NULL
        WHERE id = @id
      `;

      await db.query(updateQuery, {
        newPasswordHash,
        id: user.id
      });

      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Check if user session is valid (for session-based auth)
  static async check(req) {
    try {
      if (req.session && req.session.userId) {
        const user = await User.findById(req.session.userId);
        if (user) {
          return user;
        }
      }
      return null;
    } catch (error) {
      console.error('Error checking auth session:', error);
      return null;
    }
  }

  // Logout (destroy session)
  static async logout(req) {
    try {
      if (req.session) {
        req.session.destroy();
      }
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

module.exports = Auth;
