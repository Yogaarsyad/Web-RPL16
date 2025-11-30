const model = require('../models/exerciseLogModel');

exports.addLog = async (req, res) => {
  try {
    console.log('=== EXERCISE LOG ADD ATTEMPT ===');
    console.log('User:', req.user);
    console.log('Request body:', req.body);

    // Validate authentication
    if (!req.user || !req.user.id) {
      console.log('❌ No user in request');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Validate input
    const { nama_olahraga, durasi_menit, kalori_terbakar, tanggal } = req.body;
    
    if (!nama_olahraga || !durasi_menit || !kalori_terbakar) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['nama_olahraga', 'durasi_menit', 'kalori_terbakar']
      });
    }

    // Create log
    const newLog = await model.createExerciseLog(
      req.user.id,
      nama_olahraga,
      durasi_menit,
      kalori_terbakar,
      tanggal || new Date().toISOString().split('T')[0]
    );
    
    console.log('✅ SUCCESS - New exercise log created');
    res.status(201).json(newLog);
    
  } catch (error) {
    console.error('❌ ERROR in addLog:', error.message);
    console.error('❌ ERROR stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to add exercise log',
      error: error.message
    });
  }
};

exports.getLogs = async (req, res) => {
  try {
    console.log('=== GET EXERCISE LOGS ===');
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const logs = await model.getExerciseLogsByUserId(req.user.id);
    console.log(`✅ Found ${logs.length} exercise logs`);
    res.json(logs);
    
  } catch (error) {
    console.error('❌ ERROR in getLogs:', error);
    res.status(500).json({ 
      message: 'Failed to fetch exercise logs',
      error: error.message
    });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const logId = parseInt(req.params.id);
    const userId = req.user.id;
    const deletedLog = await model.deleteExerciseLogById(logId, userId);
    
    if (!deletedLog) {
      return res.status(404).json({ message: 'Log tidak ditemukan atau Anda tidak berhak menghapusnya' });
    }
    res.json({ message: 'Log berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};