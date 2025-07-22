const db = require('../database/connection');

class Group {
  constructor(data) {
    this.idGroup = data.idGroup;
    this.groupName = data.groupName;
    this.createdBy = data.createdBy;
    this.createdDateTime = data.createdDateTime;
    this.updateBy = data.updateBy;
    this.updatedDateTime = data.updatedDateTime;
    this.deleteBy = data.deleteBy;
    this.deletedDateTime = data.deletedDateTime;
    this.isActive = data.isActive || 1;
  }

  // Get all active groups
  static async findAll() {
    try {
      const query = `
        SELECT * FROM Groups 
        WHERE deletedDateTime IS NULL 
        ORDER BY idGroup
      `;
      
      const result = await db.query(query);
      return result.recordset.map(row => new Group(row));
    } catch (error) {
      console.error('Error fetching all groups:', error);
      throw error;
    }
  }

  // Get group by ID
  static async findById(groupId) {
    try {
      const query = `
        SELECT * FROM Groups 
        WHERE idGroup = @groupId AND deletedDateTime IS NULL
      `;
      
      const result = await db.query(query, { groupId });
      return result.recordset.length > 0 ? new Group(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error fetching group by ID:', error);
      throw error;
    }
  }

  // Get group by name
  static async findByName(groupName) {
    try {
      const query = `
        SELECT * FROM Groups 
        WHERE groupName = @groupName AND deletedDateTime IS NULL
      `;
      
      const result = await db.query(query, { groupName });
      return result.recordset.length > 0 ? new Group(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error fetching group by name:', error);
      throw error;
    }
  }

  // Get groups with user count
  static async findAllWithUserCount() {
    try {
      const query = `
      SELECT g.*, COUNT(u.id) as userCount
        FROM [group] g
        LEFT JOIN users_dash u ON g.idGroup = u.idGroup AND u.deletedDateTime IS NULL
        WHERE g.deletedDateTime IS NULL
        GROUP BY g.idGroup, g.groupName, g.createdBy, g.createdDateTime, 
                 g.updateBy, g.updatedDateTime, g.deleteBy, g.deletedDateTime, g.isActive
        ORDER BY g.idGroup
      `;
      
      const result = await db.query(query);
      // Map results to include user count
      
      return result.recordset.map(row => ({
        ...new Group(row).toJSON(),
        userCount: row.userCount
      }));
    } catch (error) {
      console.error('Error fetching groups with user count:', error);
      throw error;
    }
  }

  // Create new group
  static async create(groupData) {
    try {
      const { groupName, createdBy, isActive } = groupData;

      const query = `
        INSERT INTO Groups (groupName, createdBy, createdDateTime, isActive)
        OUTPUT INSERTED.*
        VALUES (@groupName, @createdBy, GETDATE(), @isActive)
      `;

      const result = await db.query(query, {
        groupName,
        createdBy,
        isActive: isActive || 1
      });

      return new Group(result.recordset[0]);
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  // Update group
  static async update(groupId, groupData) {
    try {
      const { groupName, isActive, updateBy } = groupData;

      const query = `
        UPDATE Groups 
        SET groupName = @groupName, isActive = @isActive, 
            updateBy = @updateBy, updatedDateTime = GETDATE()
        OUTPUT INSERTED.*
        WHERE idGroup = @groupId AND deletedDateTime IS NULL
      `;

      const result = await db.query(query, {
        groupName, isActive, updateBy, groupId
      });

      return result.recordset.length > 0 ? new Group(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }

  // Soft delete group
  static async delete(groupId, deleteBy) {
    try {
      // Check if group is superadmin (cannot be deleted)
      if (parseInt(groupId) === 1) {
        throw new Error('Cannot delete superadmin group');
      }

      // Check if group has active users
      const userCountQuery = `
        SELECT COUNT(*) as count FROM users_dash 
        WHERE idGroup = @groupId AND deletedDateTime IS NULL
      `;
      
      const userCountResult = await db.query(userCountQuery, { groupId });
      
      if (userCountResult.recordset[0].count > 0) {
        throw new Error('Cannot delete group with active users');
      }

      const query = `
        UPDATE Groups 
        SET deleteBy = @deleteBy, deletedDateTime = GETDATE()
        WHERE idGroup = @groupId
      `;

      await db.query(query, { deleteBy, groupId });
      return true;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }

  // Check if group name exists (for validation)
  static async nameExists(groupName, excludeId = null) {
    try {
      let query = `
        SELECT COUNT(*) as count FROM Groups 
        WHERE groupName = @groupName AND deletedDateTime IS NULL
      `;
      
      const params = { groupName };
      
      if (excludeId) {
        query += ` AND idGroup != @excludeId`;
        params.excludeId = excludeId;
      }
      
      const result = await db.query(query, params);
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error checking group name existence:', error);
      throw error;
    }
  }

  // Get group permissions
  async getPermissions() {
    try {
      const query = `
        SELECT pg.*, p.pageName, p.pageUrl, p.menuIcon
        FROM PageGroup pg
        INNER JOIN Pages p ON pg.idPages = p.idPages
        WHERE pg.idGroup = @groupId AND pg.isActive = 1 AND p.isActive = 1
        ORDER BY p.sort_no
      `;
      
      const result = await db.query(query, { groupId: this.idGroup });
      return result.recordset;
    } catch (error) {
      console.error('Error fetching group permissions:', error);
      throw error;
    }
  }

  toJSON() {
    return {
      idGroup: this.idGroup,
      groupName: this.groupName,
      createdBy: this.createdBy,
      createdDateTime: this.createdDateTime,
      updateBy: this.updateBy,
      updatedDateTime: this.updatedDateTime,
      isActive: this.isActive
    };
  }
}

module.exports = Group;
