const { db } = require('../database/connection');

class PageGroup {
  constructor(data) {
    this.idPageGroup = data.idPageGroup;
    this.idGroup = data.idGroup;
    this.idPages = data.idPages;
    this.CanAdd = data.CanAdd || 0;
    this.CanEdit = data.CanEdit || 0;
    this.CanDelete = data.CanDelete || 0;
    this.CanView = data.CanView || 0;
    this.CanViewAllDetail = data.CanViewAllDetail || 0;
    this.isActive = data.isActive || 1;
  }

  // Get all permissions for a specific group
  static async getPermissionsByGroup(groupId) {
    try {
      const query = `
        SELECT pg.*, p.pageName, p.pageUrl, p.menuIcon
        FROM PageGroup pg
        INNER JOIN Pages p ON pg.idPages = p.idPages
        WHERE pg.idGroup = @groupId AND pg.isActive = 1 AND p.isActive = 1
        ORDER BY p.sort_no
      `;
      
      const result = await db.query(query, { groupId });
      return result.recordset.map(row => new PageGroup(row));
    } catch (error) {
      console.error('Error fetching permissions by group:', error);
      throw error;
    }
  }

  // Get all permissions for a specific page
  static async getPermissionsByPage(pageId) {
    try {
      const query = `
        SELECT pg.*, g.groupName
        FROM PageGroup pg
        INNER JOIN Groups g ON pg.idGroup = g.idGroup
        WHERE pg.idPages = @pageId AND pg.isActive = 1 AND g.isActive = 1
        ORDER BY g.groupName
      `;
      
      const result = await db.query(query, { pageId });
      return result.recordset.map(row => new PageGroup(row));
    } catch (error) {
      console.error('Error fetching permissions by page:', error);
      throw error;
    }
  }

  // Get specific permission for a group and page
  static async getPermission(groupId, pageId) {
    try {
      const query = `
        SELECT * FROM PageGroup
        WHERE idGroup = @groupId AND idPages = @pageId AND isActive = 1
      `;
      
      const result = await db.query(query, { groupId, pageId });
      return result.recordset.length > 0 ? new PageGroup(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error fetching specific permission:', error);
      throw error;
    }
  }

  // Check if user has specific permission
  static async hasPermission(userId, pageId, permissionType) {
    try {
      const query = `
        SELECT pg.${permissionType}
        FROM PageGroup pg
        INNER JOIN users_dash u ON pg.idGroup = u.idGroup
        WHERE u.id = @userId AND pg.idPages = @pageId AND pg.isActive = 1
      `;
      
      const result = await db.query(query, { userId, pageId });
      return result.recordset.length > 0 && result.recordset[0][permissionType] === 1;
    } catch (error) {
      console.error('Error checking permission:', error);
      throw error;
    }
  }

  // Get all permissions with page and group details
  static async getAllPermissions() {
    try {
      const query = `
        SELECT pg.*, p.pageName, p.pageUrl, g.groupName
        FROM PageGroup pg
        INNER JOIN Pages p ON pg.idPages = p.idPages
        INNER JOIN Groups g ON pg.idGroup = g.idGroup
        WHERE pg.isActive = 1 AND p.isActive = 1 AND g.isActive = 1
        ORDER BY g.groupName, p.sort_no
      `;
      
      const result = await db.query(query);
      return result.recordset.map(row => new PageGroup(row));
    } catch (error) {
      console.error('Error fetching all permissions:', error);
      throw error;
    }
  }

  // Create or update permission
  static async setPermission(groupId, pageId, permissions) {
    try {
      const { CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail } = permissions;
      
      // Check if permission already exists
      const existingPermission = await PageGroup.getPermission(groupId, pageId);
      
      if (existingPermission) {
        // Update existing permission
        const query = `
          UPDATE PageGroup 
          SET CanAdd = @CanAdd, CanEdit = @CanEdit, CanDelete = @CanDelete, 
              CanView = @CanView, CanViewAllDetail = @CanViewAllDetail
          WHERE idGroup = @groupId AND idPages = @pageId
        `;
        
        await db.query(query, {
          CanAdd: CanAdd || 0,
          CanEdit: CanEdit || 0,
          CanDelete: CanDelete || 0,
          CanView: CanView || 0,
          CanViewAllDetail: CanViewAllDetail || 0,
          groupId,
          pageId
        });
        
        return await PageGroup.getPermission(groupId, pageId);
      } else {
        // Create new permission
        const query = `
          INSERT INTO PageGroup (idGroup, idPages, CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail, isActive)
          OUTPUT INSERTED.*
          VALUES (@groupId, @pageId, @CanAdd, @CanEdit, @CanDelete, @CanView, @CanViewAllDetail, 1)
        `;
        
        const result = await db.query(query, {
          groupId,
          pageId,
          CanAdd: CanAdd || 0,
          CanEdit: CanEdit || 0,
          CanDelete: CanDelete || 0,
          CanView: CanView || 0,
          CanViewAllDetail: CanViewAllDetail || 0
        });
        
        return new PageGroup(result.recordset[0]);
      }
    } catch (error) {
      console.error('Error setting permission:', error);
      throw error;
    }
  }

  // Delete permission (soft delete)
  static async deletePermission(groupId, pageId) {
    try {
      const query = `
        UPDATE PageGroup 
        SET isActive = 0
        WHERE idGroup = @groupId AND idPages = @pageId
      `;
      
      await db.query(query, { groupId, pageId });
      return true;
    } catch (error) {
      console.error('Error deleting permission:', error);
      throw error;
    }
  }

  // Get user's permissions for all pages
  static async getUserPermissions(userId) {
    try {
      const query = `
        SELECT p.idPages, p.pageName, p.pageUrl, p.menuIcon, p.isParent, p.idParent,
               pg.CanAdd, pg.CanEdit, pg.CanDelete, pg.CanView, pg.CanViewAllDetail
        FROM Pages p
        LEFT JOIN PageGroup pg ON p.idPages = pg.idPages
        LEFT JOIN users_dash u ON pg.idGroup = u.idGroup
        WHERE u.id = @userId AND p.isActive = 1 AND (pg.isActive = 1 OR pg.isActive IS NULL)
        ORDER BY p.sort_no
      `;
      
      const result = await db.query(query, { userId });
      return result.recordset;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }

  toJSON() {
    return {
      idPageGroup: this.idPageGroup,
      idGroup: this.idGroup,
      idPages: this.idPages,
      CanAdd: this.CanAdd,
      CanEdit: this.CanEdit,
      CanDelete: this.CanDelete,
      CanView: this.CanView,
      CanViewAllDetail: this.CanViewAllDetail,
      isActive: this.isActive
    };
  }
}

module.exports = PageGroup;
