const express = require('express');
const router = express.Router();
const foodLogController = require('../controllers/foodLogController');
const { protect } = require('../middleware/authMiddleware'); // GUNAKAN { protect }

router.post('/', protect, foodLogController.addFoodLog);
router.get('/', protect, foodLogController.getFoodLogs);
router.post('/calories', protect, foodLogController.getCalories);
router.delete('/:id', protect, foodLogController.deleteFoodLog);

module.exports = router;