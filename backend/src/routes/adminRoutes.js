const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// All routes here are protected and admin-only
router.use(protect, authorizeRoles('admin'));

router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetail);
router.get('/users/:id/logs', adminController.getUserLogs);
router.patch('/users/:id/role', adminController.updateRole);

module.exports = router;
