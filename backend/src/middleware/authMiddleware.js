const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware untuk memproteksi route (Harus Login)
const protect = async (req, res, next) => {
    try {
        let token;

        // Check header for token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, no token'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            
            // Get user from token (Cek ke Database agar data selalu fresh)
            // Note: Kita handle 'userId' (dari kodemu) atau 'id' (jaga-jaga dari kode teman)
            const idToFind = decoded.userId || decoded.id;
            req.user = await User.findUserById(idToFind);
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Not authorized, user not found'
                });
            }

            // Tambahkan userId langsung ke request
            req.userId = idToFind;
            
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                error: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error in authentication'
        });
    }
};

// --- FITUR BARU DARI SERVER (JANGAN DIHAPUS) ---

// Middleware otorisasi berdasarkan peran (Admin Only)
const authorizeRoles = (...roles) => (req, res, next) => {
  // Cek apakah user ada dan apakah role-nya sesuai
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ 
        success: false,
        message: 'Forbidden: insufficient permissions' 
    });
  }
  next();
};

module.exports = { 
    protect, 
    authorizeRoles // Penting: Export kedua fungsi
};