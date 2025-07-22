const User = require('../models/User');
const Group = require('../models/Group');
const Page = require('../models/Page');
const db = require('../database/connection');
const bcrypt = require('bcryptjs');

class AdminController {
  // Check if user is superadmin
  static checkSuperAdmin(req, res, next) {
    // For now, allow all authenticated users to access admin routes
    // In production, uncomment the permission check below
    /*
    if (!req.user || req.user.designation !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can access this resource.'
      });
    }
    */
    next();
  }

  // Users Management
  static async getAllUsers(req, res) {
    
    try {
      const query = `
        SELECT u.*, g.groupName 
        FROM users_dash u
        LEFT JOIN [group] g ON u.idGroup = g.idGroup
        WHERE u.deletedDateTime IS NULL
        ORDER BY u.created_at asc
      `;
      const result = await db.query(query);
            
      res.json({
        success: true,
        data: result.recordset
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async createUser(req, res) {
    try {
      const { name, username, email, password, designation, contact, district, idGroup, status } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users_dash (name, username, email, password, designation, contact, district, idGroup, status, createdBy, created_at)
        OUTPUT INSERTED.*
        VALUES (@name, @username, @email, @passwordHash, @designation, @contact, @district, @idGroup, @status, @createdBy, GETDATE())
      `;

      const result = await db.query(query, {
        name,
        username,
        email,
        passwordHash,
        designation: designation || null,
        contact: contact || null,
        district: district || null,
        idGroup: idGroup || 1,
        status: status || 1,
        createdBy: req.user.username
      });

      if (result.recordset.length > 0) {
        const newUser = new User(result.recordset[0]);
        res.status(201).json({
          success: true,
          message: 'User created successfully',
          data: { user: newUser.toJSON() }
        });
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Create user error:', error);
      
      if (error.number === 2627 || error.number === 2601) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error during user creation'
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { name, username, email, password, designation, contact, district, idGroup, status } = req.body;

      // Check if email is being changed and if it already exists
      if (email) {
        const emailExists = await User.emailExists(email, userId);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      // Check if username is being changed and if it already exists
      if (username) {
        const usernameExists = await User.usernameExists(username, userId);
        if (usernameExists) {
          return res.status(400).json({
            success: false,
            message: 'Username already exists'
          });
        }
      }

      let query;
      let queryParams;

      if (password && password.trim() !== '') {
        // Update with new password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        query = `
          UPDATE users_dash 
          SET name = @name, username = @username, email = @email, password = @passwordHash,
              designation = @designation, contact = @contact, district = @district,
              idGroup = @idGroup, status = @status, updateBy = @updateBy, updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @userId
        `;
        
        queryParams = {
          name, username, email, passwordHash, designation, contact, district, idGroup, status,
          updateBy: req.user.username, userId
        };
      } else {
        // Update without changing password
        query = `
          UPDATE users_dash 
          SET name = @name, username = @username, email = @email,
              designation = @designation, contact = @contact, district = @district,
              idGroup = @idGroup, status = @status, updateBy = @updateBy, updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @userId
        `;
        
        queryParams = {
          name, username, email, designation, contact, district, idGroup, status,
          updateBy: req.user.username, userId
        };
      }

      const result = await db.query(query, queryParams);

      if (result.recordset.length > 0) {
        const updatedUser = new User(result.recordset[0]);
        res.json({
          success: true,
          message: 'User updated successfully',
          data: { user: updatedUser.toJSON() }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    } catch (error) {
      console.error('Update user error:', error);
      
      if (error.number === 2627 || error.number === 2601) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during user update'
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      // Soft delete - update deleteBy and deletedDateTime
      const query = `
        UPDATE users_dash 
        SET deleteBy = @deleteBy, deletedDateTime = GETDATE()
        WHERE id = @userId
      `;

      await db.query(query, {
        deleteBy: req.user.username,
        userId
      });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during user deletion'
      });
    }
  }

  // Groups Management
  static async getAllGroups(req, res) {
    try {
      const groups = await Group.findAllWithUserCount();
      
      res.json({
        success: true,
        data: groups
      });
    } catch (error) {
      console.error('Get all groups error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async createGroup(req, res) {
    try {
      const { groupName, isActive } = req.body;

      // Check if group name already exists
      const nameExists = await Group.nameExists(groupName);
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'Group name already exists'
        });
      }

      const group = await Group.create({
        groupName,
        isActive: isActive || 1,
        createdBy: req.user.username
      });

      res.status(201).json({
        success: true,
        message: 'Group created successfully',
        data: group.toJSON()
      });
    } catch (error) {
      console.error('Create group error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during group creation'
      });
    }
  }

  static async updateGroup(req, res) {
    try {
      const { groupId } = req.params;
      const { groupName, isActive } = req.body;

      // Check if group name already exists (excluding current group)
      const nameExists = await Group.nameExists(groupName, groupId);
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'Group name already exists'
        });
      }

      const group = await Group.update(groupId, {
        groupName,
        isActive,
        updateBy: req.user.username
      });

      if (group) {
        res.json({
          success: true,
          message: 'Group updated successfully',
          data: group.toJSON()
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Group not found'
        });
      }
    } catch (error) {
      console.error('Update group error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during group update'
      });
    }
  }

  static async deleteGroup(req, res) {
    try {
      const { groupId } = req.params;

      await Group.delete(groupId, req.user.username);

      res.json({
        success: true,
        message: 'Group deleted successfully'
      });
    } catch (error) {
      console.error('Delete group error:', error);
      
      if (error.message === 'Cannot delete superadmin group') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete superadmin group'
        });
      }
      
      if (error.message === 'Cannot delete group with active users') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete group with active users'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error during group deletion'
      });
    }
  }

  // Pages Management
  static async getAllPages(req, res) {
    try {
      const pages = await Page.findAll();
      
      res.json({
        success: true,
        data: pages.map(page => page.toJSON())
      });
    } catch (error) {
      console.error('Get all pages error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async createPage(req, res) {
    try {
      const { 
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass, 
        isMenu, isTitle, titlePara, sort_no, isActive, langName 
      } = req.body;

      // Check if page URL already exists
      const urlExists = await Page.urlExists(pageUrl);
      if (urlExists) {
        return res.status(400).json({
          success: false,
          message: 'Page URL already exists'
        });
      }

      const page = await Page.create({
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass,
        isMenu, isTitle, titlePara, sort_no, isActive, langName,
        createdBy: req.user.username
      });

      res.status(201).json({
        success: true,
        message: 'Page created successfully',
        data: page.toJSON()
      });
    } catch (error) {
      console.error('Create page error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during page creation'
      });
    }
  }

  static async updatePage(req, res) {
    try {
      const { pageId } = req.params;
      const { 
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass, 
        isMenu, isTitle, titlePara, sort_no, isActive, langName 
      } = req.body;

      // Check if page URL already exists (excluding current page)
      const urlExists = await Page.urlExists(pageUrl, pageId);
      if (urlExists) {
        return res.status(400).json({
          success: false,
          message: 'Page URL already exists'
        });
      }

      const page = await Page.update(pageId, {
        pageName, pageUrl, isParent, idParent, menuIcon, menuClass,
        isMenu, isTitle, titlePara, sort_no, isActive, langName,
        updateBy: req.user.username
      });

      if (page) {
        res.json({
          success: true,
          message: 'Page updated successfully',
          data: page.toJSON()
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }
    } catch (error) {
      console.error('Update page error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during page update'
      });
    }
  }

  static async deletePage(req, res) {
    try {
      const { pageId } = req.params;

      await Page.delete(pageId, req.user.username);

      res.json({
        success: true,
        message: 'Page deleted successfully'
      });
    } catch (error) {
      console.error('Delete page error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during page deletion'
      });
    }
  }
}

module.exports = AdminController;
