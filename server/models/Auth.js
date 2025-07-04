const db = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');

class Auth {
  // Register a new user
  static async register(userData) {
    try {
      const { username, email, password, firstName, lastName } = userData;
      
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

      const query = `
        INSERT INTO Users (username, email, password_hash, first_name, last_name)
        OUTPUT INSERTED.*
        VALUES (@username, @email, @passwordHash, @firstName, @lastName)
      `;

      const result = await db.query(query, {
        username,
        email,
        passwordHash,
        firstName,
        lastName
      });

      if (result.recordset.length > 0) {
        const user = new User(result.recordset[0]);
        const token = this.generateToken(user.id);
        
        return {
          user: user.toJSON(),
          token
        };
      }
      
      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Authenticate user login
  static async login(email, password) {
    try {
      const query = `
        SELECT * FROM Users 
        WHERE email = @email
      `;

      const result = await db.query(query, { email });

      if (result.recordset.length === 0) {
        throw new Error('Invalid credentials');
      }

      const userData = result.recordset[0];
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);

      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await this.updateLastLogin(userData.id);

      const user = new User(userData);
      const token = this.generateToken(user.id);

      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Generate JWT token
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Get authenticated user from token
  static async user(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      console.error('Error getting authenticated user:', error);
      throw error;
    }
  }

  // Update user's last login timestamp
  static async updateLastLogin(userId) {
    try {
      const query = `
        UPDATE Users 
        SET last_login = GETDATE() 
        WHERE id = @userId
      `;

      await db.query(query, { userId });
    } catch (error) {
      console.error('Error updating last login:', error);
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
        SELECT password_hash FROM Users 
        WHERE id = @id
      `;

      const result = await db.query(query, { id: userId });

      if (result.recordset.length === 0) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(currentPassword, result.recordset[0].password_hash);

      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const updateQuery = `
        UPDATE Users 
        SET password_hash = @newPasswordHash,
            updated_at = GETDATE()
        WHERE id = @id
      `;

      await db.query(updateQuery, {
        newPasswordHash,
        id: userId
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
        UPDATE Users 
        SET password_hash = @newPasswordHash,
            updated_at = GETDATE()
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

  // Logout (for token blacklisting if needed)
  static async logout(token) {
    // For JWT, typically just remove token from client
    // Could implement token blacklisting here if needed
    return true;
  }
}

module.exports = Auth;
