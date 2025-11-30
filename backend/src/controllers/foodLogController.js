
const foodLogModel = require('../models/foodLogModel');
const axios = require('axios');

exports.addFoodLog = async (req, res) => {
  const { nama_makanan, kalori, tanggal } = req.body;
  const userId = req.user.id;
  try {
    const newLog = await foodLogModel.createFoodLog(userId, nama_makanan, kalori, tanggal);
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFoodLogs = async (req, res) => {
  const userId = req.user.id;
  try {
    const logs = await foodLogModel.getFoodLogsByUserId(userId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getCalories = async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ message: 'Missing food name' });

    const q = encodeURIComponent(name);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&json=1&page_size=6`;
    const resp = await axios.get(url, { timeout: 8000 });
    const products = resp.data.products || [];

    for (const p of products) {
      const n = p.nutriments || {};
      // Common field for kcal per 100g
      const kcal = n['energy-kcal_100g'] ?? n['energy-kcal'] ?? n['energy-kcal_value'] ?? n['energy-kcal_100g_value'];
      if (kcal != null) {
        return res.json({
          query: name,
          matched_name: p.product_name || p.generic_name || p.brands || '',
          kcal_per_100g: Number(kcal),
          source: 'openfoodfacts',
          raw: p,
        });
      }
    }

    return res.status(404).json({ message: 'No calorie data found for that food' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch calories', error: error.message });
  }
};


exports.deleteFoodLog = async (req, res) => {
  try {
    const logId = parseInt(req.params.id);
    const userId = req.user.id;
    const deletedLog = await foodLogModel.deleteFoodLogById(logId, userId);
    
    if (!deletedLog) {
      return res.status(404).json({ message: 'Log tidak ditemukan atau Anda tidak berhak menghapusnya' });
    }
    res.json({ message: 'Log berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};