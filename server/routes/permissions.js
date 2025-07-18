const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/permissionController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Get permission matrix (all groups and pages with their permissions)
router.get('/matrix', PermissionController.getPermissionMatrix);

// Get user's permissions for navigation
router.get('/user/permissions', PermissionController.getUserPermissions);

// Get menu structure based on user permissions
router.get('/user/menu', PermissionController.getMenuStructure);

// Get permissions for a specific group
router.get('/group/:groupId', PermissionController.getGroupPermissions);

// Get permissions for a specific page
router.get('/page/:pageId', PermissionController.getPagePermissions);

// Set permission for a group and page
router.post('/group/:groupId/page/:pageId', PermissionController.setPermission);

// Bulk update permissions for a group
router.post('/group/:groupId/bulk', PermissionController.bulkUpdateGroupPermissions);

// Check if user has specific permission
router.get('/user/check/:pageId/:permissionType', PermissionController.checkUserPermission);

// Delete permission
router.delete('/group/:groupId/page/:pageId', PermissionController.deletePermission);

// Initialize default permissions for superadmin (admin only)
router.post('/initialize/superadmin', PermissionController.initializeSuperAdminPermissions);

module.exports = router;
