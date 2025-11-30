const db = require('../config/db');

exports.sendMessage = async (req, res) => {
  try {
    const sender_id = req.userId; 
    const { receiver_id, message } = req.body;
    
    if (!receiver_id || !message) {
        return res.status(400).json({ success: false, error: 'Receiver and message required' });
    }

    await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3)',
      [sender_id, receiver_id, message]
    );
    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getMyMessages = async (req, res) => {
  try {
    const userId = req.userId;
    

    const query = `
      SELECT m.*, u.nama as sender_name, u.role as sender_role 
      FROM messages m 
      JOIN users u ON m.sender_id = u.id 
      WHERE m.receiver_id = $1 
      ORDER BY m.created_at DESC
    `;
    
    const { rows } = await db.query(query, [userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};