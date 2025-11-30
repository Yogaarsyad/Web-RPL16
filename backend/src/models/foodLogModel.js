const db = require('../config/db');

const createFoodLog = async (userId, nama_makanan, kalori, tanggal) => {
 const result = await db.query(
 'INSERT INTO food_logs (user_id, nama_makanan, kalori, tanggal) VALUES ($1, $2, $3, $4) RETURNING *',
 [userId, nama_makanan, kalori, tanggal || new Date()] // Ditambahkan default tanggal
 );
 return result.rows[0];
};

const getFoodLogsByUserId = async (userId) => {
 const result = await db.query('SELECT * FROM food_logs WHERE user_id = $1 ORDER BY tanggal DESC', [userId]);
 return result.rows;
};

const deleteFoodLogById = async (logId, userId) => {
  const result = await db.query(
 'DELETE FROM food_logs WHERE id = $1 AND user_id = $2 RETURNING *',
 [logId, userId]
 );
 return result.rows[0];
};


module.exports = { 
 createFoodLog, 
 getFoodLogsByUserId, 
 deleteFoodLogById
};