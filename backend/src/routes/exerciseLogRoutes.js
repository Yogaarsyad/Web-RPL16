const express = require('express');
const router = express.Router();
const exerciseLogController = require('../controllers/exerciseLogController');
const controller = require('../controllers/exerciseLogController');
const { protect } = require('../middleware/authMiddleware');


// Apply auth middleware to individual routes
router.post('/', protect, exerciseLogController.addLog);
router.get('/', protect, exerciseLogController.getLogs);
router.delete('/:id', protect, controller.deleteLog);

module.exports = router;