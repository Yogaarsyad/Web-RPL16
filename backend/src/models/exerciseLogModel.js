const db = require('../config/db');

const createExerciseLog = async (userId, nama_olahraga, durasi_menit, kalori_terbakar, tanggal) => {
  try {
    console.log('🗄️ Creating exercise log with:', { 
      userId, nama_olahraga, durasi_menit, kalori_terbakar, tanggal 
    });
    
    // Use the CORRECT column names from your Neon database
    const result = await db.query(
      `INSERT INTO exercise_logs (user_id, jenis_olahraga, durasi_menit, kalori_terbakar, tanggal) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, nama_olahraga, parseInt(durasi_menit), parseInt(kalori_terbakar), tanggal || new Date().toISOString().split('T')[0]]
    );
    
    console.log('✅ Database insert successful:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Database error in createExerciseLog:', error);
    throw new Error(`Database error: ${error.message}`);
  }
};

const getExerciseLogsByUserId = async (userId) => {
  try {
    console.log('🗄️ Fetching exercise logs for user:', userId);
    
    const result = await db.query(
      `SELECT 
        id, 
        user_id, 
        jenis_olahraga as nama_olahraga,  -- Use alias to match frontend expectation
        durasi_menit, 
        kalori_terbakar, 
        tanggal, 
        created_at 
       FROM exercise_logs 
       WHERE user_id = $1 
       ORDER BY tanggal DESC`, 
      [userId]
    );
    
    console.log(`✅ Found ${result.rows.length} exercise logs`);
    return result.rows;
  } catch (error) {
    console.error('❌ Database error in getExerciseLogsByUserId:', error);
    throw new Error(`Database error: ${error.message}`);
  }
};


const deleteExerciseLogById = async (logId, userId) => {
  const result = await db.query(
    'DELETE FROM exercise_logs WHERE id = $1 AND user_id = $2 RETURNING *',
    [logId, userId]
  );
  return result.rows[0];
};

module.exports = {
  createExerciseLog,
  getExerciseLogsByUserId,
  deleteExerciseLogById
};