const userModel = require('../models/userModel');
const foodLogModel = require('../models/foodLogModel');
const exerciseLogModel = require('../models/exerciseLogModel');
const sleepLogModel = require('../models/sleepLogModel');

// GET /api/admin/users
exports.listUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Failed to list users', error: e.message });
  }
};

// GET /api/admin/users/:id
exports.getUserDetail = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userModel.findUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // basic summary + latest logs
    const [food, exercise, sleep] = await Promise.all([
      foodLogModel.getFoodLogsByUserId(userId),
      exerciseLogModel.getExerciseLogsByUserId(userId),
      sleepLogModel.getSleepLogsByUserId(userId),
    ]);

    res.json({
      user: { id: user.id, nama: user.nama, email: user.email, role: user.role },
      counts: { food: food.length, exercise: exercise.length, sleep: sleep.length },
      latest: {
        food: food[0] || null,
        exercise: exercise[0] || null,
        sleep: sleep[0] || null,
      },
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to get user detail', error: e.message });
  }
};

// GET /api/admin/users/:id/logs?type=food|exercise|sleep
exports.getUserLogs = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const type = (req.query.type || '').toLowerCase();
    if (!['food', 'exercise', 'sleep'].includes(type)) {
      return res.status(400).json({ message: 'type must be one of food|exercise|sleep' });
    }

    let logs = [];
    if (type === 'food') logs = await foodLogModel.getFoodLogsByUserId(userId);
    if (type === 'exercise') logs = await exerciseLogModel.getExerciseLogsByUserId(userId);
    if (type === 'sleep') logs = await sleepLogModel.getSleepLogsByUserId(userId);

    res.json(logs);
  } catch (e) {
    res.status(500).json({ message: 'Failed to get user logs', error: e.message });
  }
};


exports.updateRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updated = await userModel.updateUserRole(userId, role);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update role', error: e.message });
  }
};
