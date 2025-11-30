const { query } = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    // Untuk sementara, kita simpan user ID di header
    // Nanti bisa diganti dengan JWT
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User ID required'
      });
    }

    // Verifikasi user exists
    const result = await query(
      'SELECT id, nama, email, role FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - User not found'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

module.exports = authMiddleware;