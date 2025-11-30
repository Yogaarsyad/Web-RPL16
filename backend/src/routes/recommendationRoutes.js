const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// Mendapatkan rekomendasi kesehatan untuk pengguna yang diautentikasi.
router.get('/', protect, recommendationController.getRecommendations);

module.exports = router;