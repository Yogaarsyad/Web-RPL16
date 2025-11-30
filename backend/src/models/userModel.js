const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Fungsi untuk membuat pengguna baru (Gabungan: support NPM/Jurusan DAN Role)
const createUser = async (userData) => {
    // Default role 'user' jika tidak diisi
    const { nama, email, password, npm, jurusan, role = 'user' } = userData; 
    
    console.log('👤 Creating user:', email);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Query digabung agar semua data masuk
    const result = await db.query(
        `INSERT INTO users (nama, email, password, npm, jurusan, role) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, email, nama, npm, jurusan, role`,
        [nama, email, hashedPassword, npm, jurusan, role]
    );
    
    console.log('✅ User created with ID:', result.rows[0].id);
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const findUserById = async (id) => {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

// Fungsi update user (Menggunakan versi Kamu yang lebih aman + Support Role)
const updateUser = async (userId, userData) => {
    try {
        const { nama, npm, jurusan, email, role } = userData;
        
        console.log('🔄 updateUser called with:', { userId, userData });

        // Cek jika email sudah digunakan oleh user lain (PENTING: Fitur ini dari kodemu)
        if (email && email !== '') {
            console.log('📧 Checking email availability:', email);
            const existingUser = await db.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2',
                [email, userId]
            );
            
            if (existingUser.rows.length > 0) {
                console.log('❌ Email already exists for another user');
                throw new Error('Email already exists');
            }
        }

        // Query update digabung agar role juga bisa diupdate jika perlu
        const query = `
            UPDATE users 
            SET nama = $1, npm = $2, jurusan = $3, email = $4, role = COALESCE($5, role)
            WHERE id = $6
            RETURNING id, nama, email, npm, jurusan, role
        `;
        
        // role || null agar jika role tidak dikirim, tidak error
        const params = [nama, npm, jurusan, email, role || null, userId];

        console.log('📝 Executing query params length:', params.length);
        
        const { rows } = await db.query(query, params);
        
        if (rows.length === 0) {
            console.log('❌ User not found with ID:', userId);
            throw new Error('User not found');
        }
        
        console.log('✅ User updated successfully:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error('💥 Error in updateUser:', error);
        throw new Error(`Failed to update user: ${error.message}`);
    }
};

// --- FITUR BARU DARI SERVER (JANGAN DIHAPUS) ---

/**
 * Mendapatkan semua pengguna (hanya untuk admin)
 */
async function getAllUsers() {
  const { rows } = await db.query('SELECT id, nama, email, role, npm, jurusan FROM users ORDER BY created_at DESC NULLS LAST, id DESC');
  return rows;
}

/**
 * Memperbarui role pengguna (admin-only)
 */
async function updateUserRole(userId, role) {
  const { rows } = await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, nama, email, role', [role, userId]);
  return rows[0];
}

module.exports = { 
    createUser, 
    findUserByEmail,
    findUserById,
    updateUser,
    getAllUsers,     // Baru
    updateUserRole   // Baru
};