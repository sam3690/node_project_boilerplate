const PageGroup = require('../models/PageGroup');
const Page = require('../models/Page');

// Middleware to check if user has specific permission
const checkPermission = (permissionType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const pageUrl = req.route?.path || req.path;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // For superadmin, bypass all permission checks
      if (req.user.designation === 'superadmin') {
        return next();
      }

      // Find page by URL
      const page = await Page.findByUrl(pageUrl);
      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      // Check if user has the required permission
      const hasPermission = await PageGroup.hasPermission(userId, page.idPages, permissionType);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have ${permissionType} permission for this resource.`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Middleware to check if user can view a page
const canView = checkPermission('CanView');

// Middleware to check if user can add to a page
const canAdd = checkPermission('CanAdd');

// Middleware to check if user can edit a page
const canEdit = checkPermission('CanEdit');

// Middleware to check if user can delete from a page
const canDelete = checkPermission('CanDelete');

// Middleware to check if user can view all details of a page
const canViewAllDetail = checkPermission('CanViewAllDetail');

// Middleware to check multiple permissions (user must have at least one)
const checkAnyPermission = (permissionTypes) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const pageUrl = req.route?.path || req.path;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // For superadmin, bypass all permission checks
      if (req.user.designation === 'superadmin') {
        return next();
      }

      // Find page by URL
      const page = await Page.findByUrl(pageUrl);
      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      // Check if user has any of the required permissions
      let hasAnyPermission = false;
      
      for (const permissionType of permissionTypes) {
        const hasPermission = await PageGroup.hasPermission(userId, page.idPages, permissionType);
        if (hasPermission) {
          hasAnyPermission = true;
          break;
        }
      }
      
      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have any of the required permissions: ${permissionTypes.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Middleware to check if user can perform CRUD operations
const canManage = checkAnyPermission(['CanAdd', 'CanEdit', 'CanDelete']);

// Middleware to check permissions by page ID (for API endpoints)
const checkPermissionById = (permissionType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const pageId = req.params.pageId || req.body.pageId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // For superadmin, bypass all permission checks
      if (req.user.designation === 'superadmin') {
        return next();
      }

      if (!pageId) {
        return res.status(400).json({
          success: false,
          message: 'Page ID is required'
        });
      }

      // Check if user has the required permission
      const hasPermission = await PageGroup.hasPermission(userId, pageId, permissionType);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have ${permissionType} permission for this resource.`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

// Check if user is superadmin or has specific permission
const checkSuperAdminOrPermission = (permissionType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // For superadmin, bypass all permission checks
      if (req.user.designation === 'superadmin') {
        return next();
      }

      // Use the regular permission check
      return checkPermission(permissionType)(req, res, next);
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission check'
      });
    }
  };
};

module.exports = {
  checkPermission,
  canView,
  canAdd,
  canEdit,
  canDelete,
  canViewAllDetail,
  checkAnyPermission,
  canManage,
  checkPermissionById,
  checkSuperAdminOrPermission
};
