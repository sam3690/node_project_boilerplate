const db = require('../database/connection');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.name = userData.name;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
    this.lastLogin = userData.last_login;
  }

  // Create a new user (basic creation without auth logic)
  static async create(userData) {
    try {
      const { username, email, passwordHash, name } = userData;

      const query = `
        INSERT INTO users_dash (username, email, password, name)
        OUTPUT INSERTED.*
        VALUES (@username, @email, @passwordHash, @name)
      `;

      const result = await db.query(query, {
        username,
        email,
        passwordHash,
        firstName,
        lastName
      });

      if (result.recordset.length > 0) {
        return new User(result.recordset[0]);
      }
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = `
        SELECT * FROM users_dash 
        WHERE id = @id
      `;

      const result = await db.query(query, { id });

      if (result.recordset.length > 0) {
        return new User(result.recordset[0]);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = `
        SELECT * FROM users_dash 
        WHERE email = @email
      `;

      const result = await db.query(query, { email });

      if (result.recordset.length > 0) {
        return new User(result.recordset[0]);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const query = `
        SELECT * FROM users_dash 
        WHERE username = @username
      `;

      const result = await db.query(query, { username });

      if (result.recordset.length > 0) {
        return new User(result.recordset[0]);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(updateData) {
    try {
      const { firstName, lastName, email } = updateData;
      
      const query = `
        UPDATE users_dash 
        SET first_name = @firstName, 
            last_name = @lastName, 
            email = @email,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `;

      const result = await db.query(query, {
        firstName,
        lastName,
        email,
        id: this.id
      });

      if (result.recordset.length > 0) {
        const updatedUser = new User(result.recordset[0]);
        Object.assign(this, updatedUser);
        return this;
      }
      return null;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Check if email exists (for validation)
  static async emailExists(email, excludeUserId = null) {
    try {
      let query = `
        SELECT COUNT(*) as count FROM users_dash 
        WHERE email = @email
      `;

      const params = { email };

      if (excludeUserId) {
        query += ` AND id != @excludeUserId`;
        params.excludeUserId = excludeUserId;
      }

      const result = await db.query(query, params);
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  }

  // Check if username exists (for validation)
  static async usernameExists(username, excludeUserId = null) {
    try {
      let query = `
        SELECT COUNT(*) as count FROM users_dash 
        WHERE username = @username
      `;

      const params = { username };

      if (excludeUserId) {
        query += ` AND id != @excludeUserId`;
        params.excludeUserId = excludeUserId;
      }

      const result = await db.query(query, params);
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error checking username existence:', error);
      throw error;
    }
  }

  // Get all users (for admin purposes)
  static async all(limit = 50, offset = 0) {
    try {
      const query = `
        SELECT * FROM users_dash 
        ORDER BY created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;

      const result = await db.query(query, { limit, offset });
      return result.recordset.map(userData => new User(userData));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Get users count
  static async count() {
    try {
      const query = `SELECT COUNT(*) as count FROM users_dash`;
      const result = await db.query(query);
      return result.recordset[0].count;
    } catch (error) {
      console.error('Error getting users count:', error);
      throw error;
    }
  }

  // Delete user (soft delete by updating a deleted_at field if exists, or hard delete)
  async delete() {
    try {
      const query = `DELETE FROM users_dash WHERE id = @id`;
      await db.query(query, { id: this.id });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user public data (without sensitive information)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin
    };
  }
}

module.exports = User;
