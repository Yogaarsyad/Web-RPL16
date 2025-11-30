const db = require('../config/db');

const createSleepLog = async (userId, tanggal, waktu_tidur, waktu_bangun, kualitas_tidur) => {
  const result = await db.query(
    `INSERT INTO sleep_logs 
      (user_id, tanggal, waktu_tidur, waktu_bangun, kualitas_tidur) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, tanggal, waktu_tidur, waktu_bangun, kualitas_tidur]
  );
  return result.rows[0];
};

const getSleepLogsByUserId = async (userId) => {
  const result = await db.query(
      'SELECT * FROM sleep_logs WHERE user_id = $1 ORDER BY tanggal DESC',
      [userId]
    );
    return result.rows;
};

const deleteSleepLogById = async (logId, userId) => {
  const result = await db.query(
    'DELETE FROM sleep_logs WHERE id = $1 AND user_id = $2 RETURNING *',
    [logId, userId]
  );
  return result.rows[0];
};



module.exports = { createSleepLog, getSleepLogsByUserId, deleteSleepLogById };