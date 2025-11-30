const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Kirim pesan (bisa dari admin ke user, atau user ke admin)
router.post('/', protect, messageController.sendMessage);

// Lihat kotak masuk
router.get('/', protect, messageController.getMyMessages);

module.exports = router;