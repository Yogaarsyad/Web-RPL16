// reportController.js
const foodLogModel = require('../models/foodLogModel');
const sleepLogModel = require('../models/sleepLogModel');
const exerciseLogModel = require('../models/exerciseLogModel');

exports.getReportData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📊 Getting report data for user:', userId);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Mengambil semua data log
    const [foodLogs, sleepLogs, exerciseLogs] = await Promise.all([
      foodLogModel.getFoodLogsByUserId(userId),
      sleepLogModel.getSleepLogsByUserId(userId),
      exerciseLogModel.getExerciseLogsByUserId(userId) 
    ]);

    console.log('📈 Data counts - Food:', foodLogs.length, 'Sleep:', sleepLogs.length, 'Exercise:', exerciseLogs.length);

    // Filter data untuk 7 hari terakhir
    const filteredFoodLogs = foodLogs.filter(log => {
      const logDate = new Date(log.tanggal);
      return logDate >= sevenDaysAgo;
    });
    
    const filteredSleepLogs = sleepLogs.filter(log => {
      const logDate = new Date(log.tanggal);
      return logDate >= sevenDaysAgo;
    });
    
    const filteredExerciseLogs = exerciseLogs.filter(log => {
      const logDate = new Date(log.tanggal);
      return logDate >= sevenDaysAgo;
    });

    console.log('📈 Filtered data counts - Food:', filteredFoodLogs.length, 'Sleep:', filteredSleepLogs.length, 'Exercise:', filteredExerciseLogs.length);

    res.json({
      success: true,
      data: {
        foodLogs: filteredFoodLogs,
        sleepLogs: filteredSleepLogs,
        exerciseLogs: filteredExerciseLogs,
        period: {
          start: sevenDaysAgo,
          end: new Date()
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in getReportData:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data laporan'
    });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📊 Getting statistics for user:', userId);
    
    const [foodLogs, sleepLogs, exerciseLogs] = await Promise.all([
      foodLogModel.getFoodLogsByUserId(userId),
      sleepLogModel.getSleepLogsByUserId(userId),
      exerciseLogModel.getExerciseLogsByUserId(userId)
    ]);

    console.log('📈 Raw data counts:', {
      food: foodLogs.length,
      sleep: sleepLogs.length,
      exercise: exerciseLogs.length
    });

    // Hitung statistik dengan logging
    const totalCalories = foodLogs.reduce((sum, log) => {
      const calories = Number(log.kalori) || 0;
      return sum + calories;
    }, 0);

    const totalExerciseMinutes = exerciseLogs.reduce((sum, log) => {
      const minutes = Number(log.durasi_menit) || 0;
      return sum + minutes;
    }, 0);

    const totalCaloriesBurned = exerciseLogs.reduce((sum, log) => {
      const calories = Number(log.kalori_terbakar) || 0;
      return sum + calories;
    }, 0);

    const averageExerciseMinutes = exerciseLogs.length > 0 ? 
      Math.round(totalExerciseMinutes / exerciseLogs.length) : 0;

    const stats = {
      totalCalories: totalCalories,
      averageSleepHours: calculateAverageSleepHours(sleepLogs),
      totalExerciseMinutes: totalExerciseMinutes,
      totalCaloriesBurned: totalCaloriesBurned,
      averageExerciseMinutes: averageExerciseMinutes,
      totalExerciseSessions: exerciseLogs.length,
      totalFoodEntries: foodLogs.length,
      totalSleepEntries: sleepLogs.length
    };

    console.log('📊 Calculated statistics:', stats);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error in getStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik'
    });
  }
};

function calculateAverageSleepHours(sleepLogs) {
  if (sleepLogs.length === 0) return 0;
  
  const totalHours = sleepLogs.reduce((sum, log) => {
    try {
      const sleepTime = new Date(log.waktu_tidur);
      const wakeTime = new Date(log.waktu_bangun);
      const hours = (wakeTime - sleepTime) / (1000 * 60 * 60);
      return sum + (isNaN(hours) ? 0 : hours);
    } catch (error) {
      console.error('Error calculating sleep hours for log:', log);
      return sum;
    }
  }, 0);
  
  return Number((totalHours / sleepLogs.length).toFixed(1));
}

exports.getExerciseTrend = async (req, res) => {
  try {
    // TODO: Tambahkan logika untuk mengambil data exercise trend
    console.log('📊 Getting exercise trend for user:', req.user.id);
    
    // Kirim respons placeholder untuk saat ini
    res.json({
      success: true,
      message: 'Exercise trend data (placeholder)',
      data: [] 
    });

  } catch (error) {
    console.error('❌ Error in getExerciseTrend:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil tren olahraga'
    });
  }
};

module.exports = exports;