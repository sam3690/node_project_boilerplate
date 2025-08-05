const db = require('../database/connection'); // Assuming a database connection module

class PermissionService {
  /**
   * Check if a user has permission to view a specific resource.
   * @param {number} userId - The ID of the user.
   * @param {string} permissionKey - The key representing the permission.
   * @returns {Promise<boolean>} - True if the user has permission, false otherwise.
   */
  static async canView(userId, permissionKey) {
    try {
      const query = `
        SELECT p.CanView
        FROM Permissions p
        INNER JOIN UserGroups ug ON p.idGroup = ug.idGroup
        WHERE ug.idUser = ? AND p.permissionKey = ?
      `;

      const [rows] = await db.execute(query, [userId, permissionKey]);

      return rows.length > 0 && rows[0].CanView === 1;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }
}

module.exports = PermissionService;
