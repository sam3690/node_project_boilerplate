const PageGroup = require('../models/PageGroup');
const Page = require('../models/Page');
const Group = require('../models/Group');

class PermissionController {
  // Get all permissions matrix (groups vs pages)
  static async getPermissionMatrix(req, res) {
    try {
      const [groups, pages, permissions] = await Promise.all([
        Group.findAll(),
        Page.findAll(),
        PageGroup.getAllPermissions()
      ]);

      // Create a matrix structure
      const matrix = {};
      
      groups.forEach(group => {
        matrix[group.idGroup] = {
          groupInfo: group.toJSON(),
          permissions: {}
        };
        
        pages.forEach(page => {
          matrix[group.idGroup].permissions[page.idPages] = {
            pageInfo: page.toJSON(),
            CanAdd: 0,
            CanEdit: 0,
            CanDelete: 0,
            CanView: 0,
            CanViewAllDetail: 0
          };
        });
      });

      // Fill in the actual permissions
      permissions.forEach(permission => {
        if (matrix[permission.idGroup] && matrix[permission.idGroup].permissions[permission.idPages]) {
          matrix[permission.idGroup].permissions[permission.idPages] = {
            ...matrix[permission.idGroup].permissions[permission.idPages],
            CanAdd: permission.CanAdd,
            CanEdit: permission.CanEdit,
            CanDelete: permission.CanDelete,
            CanView: permission.CanView,
            CanViewAllDetail: permission.CanViewAllDetail
          };
        }
      });

      res.json({
        success: true,
        data: {
          matrix,
          groups: groups.map(g => g.toJSON()),
          pages: pages.map(p => p.toJSON())
        }
      });
    } catch (error) {
      console.error('Get permission matrix error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission matrix retrieval'
      });
    }
  }

  // Get permissions for a specific group
  static async getGroupPermissions(req, res) {
    try {
      const { groupId } = req.params;
      const permissions = await PageGroup.getPermissionsByGroup(groupId);
      
      res.json({
        success: true,
        data: permissions.map(p => p.toJSON())
      });
    } catch (error) {
      console.error('Get group permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission retrieval'
      });
    }
  }

  // Get permissions for a specific page
  static async getPagePermissions(req, res) {
    try {
      const { pageId } = req.params;
      const permissions = await PageGroup.getPermissionsByPage(pageId);
      
      res.json({
        success: true,
        data: permissions.map(p => p.toJSON())
      });
    } catch (error) {
      console.error('Get page permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission retrieval'
      });
    }
  }

  // Set permission for a group and page
  static async setPermission(req, res) {
    try {
      const { groupId, pageId } = req.params;
      const { CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail } = req.body;

      const permission = await PageGroup.setPermission(groupId, pageId, {
        CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail
      });

      res.json({
        success: true,
        message: 'Permission updated successfully',
        data: permission.toJSON()
      });
    } catch (error) {
      console.error('Set permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission update'
      });
    }
  }

  // Bulk update permissions for a group
  static async bulkUpdateGroupPermissions(req, res) {
    try {
      const { groupId } = req.params;
      const { permissions } = req.body; // Array of {pageId, CanAdd, CanEdit, CanDelete, CanView, CanViewAllDetail}

      const results = [];
      
      for (const perm of permissions) {
        const result = await PageGroup.setPermission(groupId, perm.pageId, {
          CanAdd: perm.CanAdd,
          CanEdit: perm.CanEdit,
          CanDelete: perm.CanDelete,
          CanView: perm.CanView,
          CanViewAllDetail: perm.CanViewAllDetail
        });
        results.push(result);
      }

      res.json({
        success: true,
        message: 'Permissions updated successfully',
        data: results.map(r => r.toJSON())
      });
    } catch (error) {
      console.error('Bulk update group permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during bulk update'
      });
    }
  }

  // Get user's permissions for navigation
  static async getUserPermissions(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      const permissions = await PageGroup.getUserPermissions(userId);
      
      // Filter pages user can view
      const accessiblePages = permissions.filter(p => p.CanView === 1);
      
      res.json({
        success: true,
        data: accessiblePages
      });
    } catch (error) {
      console.error('Get user permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission retrieval'
      });
    }
  }

  // Check if user has specific permission
  static async checkUserPermission(req, res) {
    try {
      const { pageId, permissionType } = req.params;
      const userId = req.user.id;

      const hasPermission = await PageGroup.hasPermission(userId, pageId, permissionType);
      
      res.json({
        success: true,
        data: { hasPermission }
      });
    } catch (error) {
      console.error('Check user permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  }

  // Delete permission
  static async deletePermission(req, res) {
    try {
      const { groupId, pageId } = req.params;
      
      await PageGroup.deletePermission(groupId, pageId);
      
      res.json({
        success: true,
        message: 'Permission deleted successfully'
      });
    } catch (error) {
      console.error('Delete permission error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during deletion'
      });
    }
  }

  // Initialize default permissions for superadmin
  static async initializeSuperAdminPermissions(req, res) {
    try {
      const superAdminGroupId = 1; // Assuming superadmin group ID is 1
      const pages = await Page.findAll();
      
      const results = [];
      
      for (const page of pages) {
        const result = await PageGroup.setPermission(superAdminGroupId, page.idPages, {
          CanAdd: 1,
          CanEdit: 1,
          CanDelete: 1,
          CanView: 1,
          CanViewAllDetail: 1
        });
        results.push(result);
      }

      res.json({
        success: true,
        message: 'Super admin permissions initialized successfully',
        data: results.map(r => r.toJSON())
      });
    } catch (error) {
      console.error('Initialize super admin permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during initialization'
      });
    }
  }

  // Get menu structure based on user permissions
  static async getMenuStructure(req, res) {
    try {
      // get all menu pages (already filters deleted and isMenu)
      const rows = await Page.findAll(); // returns array of Page instances or plain objects

      // build menu tree
      const buildMenuTree = (pages) => {
        const byId = new Map();

        // normalize and create shallow clone with children array
        pages.forEach(p => {
          const id = Number(p.idPages);
          byId.set(id, { ...p, idPages: id, idParent: p.idParent == null || p.idParent === '' ? null : Number(p.idParent), children: [] });
        });

        const parents = [];
        const standalone = [];

        // Attach children to their parentss
        byId.forEach(page => {
          const parentId = page.idParent;
          if (parentId && byId.has(parentId)) {
            byId.get(parentId).children.push(page);
          } else {
            // not attached as a child
            const isParentFlag = page.isParent === true || page.isParent === 1 || page.isParent === '1';
            if (isParentFlag) {
              parents.push(byId.get(page.idPages));
            } else {
              standalone.push(byId.get(page.idPages));
            }
          }
        });

        // Optional: sort children by sort_no (if present)
        const sortBySortNo = (a, b) => {
          const sa = a.sort_no == null ? 0 : Number(a.sort_no);
          const sb = b.sort_no == null ? 0 : Number(b.sort_no);
          return sa - sb;
        };

        parents.forEach(p => {
          if (Array.isArray(p.children) && p.children.length > 0) {
            p.children.sort(sortBySortNo);
          }
        });

        // Optional: sort parents and standalone as well (they came from DB ordered by sort_no already)
        parents.sort(sortBySortNo);
        standalone.sort(sortBySortNo);

        // Compose final menu:
        // Option A: parents first, then standalone
        const finalMenu = [...parents, ...standalone];

        // Option B (if you want everything at top-level in original DB order):
        // const finalMenu = pages
        //   .filter(p => !p.idParent) // top-level rows
        //   .map(p => byId.get(Number(p.idPages)));

        return finalMenu;
      };

      const menuStructure = buildMenuTree(rows);

      res.json({
        success: true,
        data: menuStructure
      });
    } 
    catch (error) {
      console.error('Get menu structure error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during menu structure retrieval'
      });
    }
  }
}

module.exports = PermissionController;
