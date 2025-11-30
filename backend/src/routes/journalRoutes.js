const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Semua user yang login bisa baca jurnal
router.get('/', protect, journalController.getJournals);

// Hanya Admin yang bisa buat dan hapus jurnal
router.post('/', protect, authorizeRoles('admin'), journalController.createJournal);
router.delete('/:id', protect, authorizeRoles('admin'), journalController.deleteJournal);

module.exports = router;