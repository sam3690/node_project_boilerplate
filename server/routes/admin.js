const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all admin routes
router.use(auth);

// Apply superadmin check to all admin routes
router.use(AdminController.checkSuperAdmin);

// Users Management Routes
router.get('/users', AdminController.getAllUsers);
router.post('/users', AdminController.createUser);
router.put('/users/:userId', AdminController.updateUser);
router.delete('/users/:userId', AdminController.deleteUser);

// Groups Management Routes
router.get('/groups', AdminController.getAllGroups);
router.post('/groups', AdminController.createGroup);
router.put('/groups/:groupId', AdminController.updateGroup);
router.delete('/groups/:groupId', AdminController.deleteGroup);

// Pages Management Routes
router.get('/pages', AdminController.getAllPages);
router.post('/pages', AdminController.createPage);
router.put('/pages/:pageId', AdminController.updatePage);
router.delete('/pages/:pageId', AdminController.deletePage);

module.exports = router;
