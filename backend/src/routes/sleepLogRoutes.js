const express = require('express');
const router = express.Router();
const sleepLogController = require('../controllers/sleepLogController');
const { protect } = require('../middleware/authMiddleware'); // GUNAKAN { protect }

router.post('/', protect, sleepLogController.addSleepLog);
router.get('/', protect, sleepLogController.getSleepLogs);
router.delete('/:id', protect, sleepLogController.deleteSleepLog);

module.exports = router;