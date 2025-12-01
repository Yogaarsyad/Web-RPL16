const db = require('../config/db');

// Buat Jurnal Baru (Khusus Admin)
exports.createJournal = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }
    
    await db.query(
      'INSERT INTO journals (title, content, created_at) VALUES ($1, $2, NOW())', 
      [title, content]
    );
    res.status(201).json({ success: true, message: 'Journal created successfully' });
  } catch (err) {
    console.error('Journal creation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Ambil Semua Jurnal (Untuk User & Admin)
exports.getJournals = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM journals ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get journals error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Hapus Jurnal (Khusus Admin)
exports.deleteJournal = async (req, res) => {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM journals WHERE id = $1', [id]);
      res.json({ success: true, message: 'Journal deleted' });
    } catch (err) {
      console.error('Delete journal error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
};