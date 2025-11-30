const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Mendapatkan data laporan kesehatan untuk pengguna yang diautentikasi.
router.get('/data', protect, reportController.getReportData);

router.get(
  '/statistics', 
  protect, // <-- PERBAIKAN 1: Ganti authMiddleware menjadi protect
  reportController.getStatistics
);

router.get('/exercise-trend', protect, reportController.getExerciseTrend); // PERBAIKAN 2: Pastikan ini ada

module.exports = router;