const express = require('express');
const router = express.Router();
const { createCompletion } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Optional: require auth. If you want it public, remove `protect`.
router.post('/', protect, createCompletion);

module.exports = router;
