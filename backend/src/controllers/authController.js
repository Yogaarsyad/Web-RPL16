const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const register = async (req, res) => {
  try {
    const { 
      nama, 
      email, 
      password, 
      confirmPassword,
      tanggal_lahir,
      jenis_kelamin,
      tinggi_badan,
      berat_badan,
      npm,
      jurusan
    } = req.body;

    // Validasi required fields
    if (!nama || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Nama, email, dan password harus diisi' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Password tidak cocok' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password minimal 6 karakter' 
      });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Format email tidak valid' 
      });
    }

    // Cek jika email sudah ada
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email sudah terdaftar' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Simpan user baru
    const userResult = await query(
      `INSERT INTO users (
        nama, email, password, tanggal_lahir, jenis_kelamin, 
        tinggi_badan, berat_badan, npm, jurusan, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING id, nama, email, tanggal_lahir, jenis_kelamin, tinggi_badan, berat_badan, npm, jurusan, role, created_at`,
      [
        nama, 
        email, 
        passwordHash,
        tanggal_lahir || null,
        jenis_kelamin || null,
        tinggi_badan || null,
        berat_badan || null,
        npm || null,
        jurusan || null,
        'user' // Default role
      ]
    );

    const newUser = userResult.rows[0];

    // Buat profile untuk user baru
    await query(
      'INSERT INTO user_profiles (user_id) VALUES ($1)',
      [newUser.id]
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        tanggal_lahir: newUser.tanggal_lahir,
        jenis_kelamin: newUser.jenis_kelamin,
        tinggi_badan: newUser.tinggi_badan,
        berat_badan: newUser.berat_badan,
        npm: newUser.npm,
        jurusan: newUser.jurusan,
        role: newUser.role,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ 
        success: false,
        error: 'Email sudah terdaftar' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Terjadi kesalahan server' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email dan password harus diisi' 
      });
    }

    // Cari user by email dengan profile
    const result = await query(
      `SELECT u.*, up.phone, up.alamat, up.bio, up.avatar_url 
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Email atau password salah' 
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Email atau password salah' 
      });
    }

    // Update last login
    await query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login berhasil',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Terjadi kesalahan server' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT u.*, up.phone, up.alamat, up.bio, up.avatar_url 
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User tidak ditemukan' 
      });
    }

    const user = result.rows[0];
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Terjadi kesalahan server' 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      nama,
      tanggal_lahir,
      jenis_kelamin,
      tinggi_badan,
      berat_badan,
      npm,
      jurusan,
      phone,
      alamat,
      bio
    } = req.body;

    // Update users table
    await query(
      `UPDATE users 
       SET nama = $1, tanggal_lahir = $2, jenis_kelamin = $3, 
           tinggi_badan = $4, berat_badan = $5, npm = $6, jurusan = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8`,
      [nama, tanggal_lahir, jenis_kelamin, tinggi_badan, berat_badan, npm, jurusan, userId]
    );

    // Update or insert user_profiles
    const profileResult = await query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (profileResult.rows.length > 0) {
      // Update existing profile
      await query(
        `UPDATE user_profiles 
         SET phone = $1, alamat = $2, bio = $3, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4`,
        [phone, alamat, bio, userId]
      );
    } else {
      // Insert new profile
      await query(
        `INSERT INTO user_profiles (user_id, phone, alamat, bio) 
         VALUES ($1, $2, $3, $4)`,
        [userId, phone, alamat, bio]
      );
    }

    // Get updated user data
    const updatedResult = await query(
      `SELECT u.*, up.phone, up.alamat, up.bio, up.avatar_url 
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       WHERE u.id = $1`,
      [userId]
    );

    const updatedUser = updatedResult.rows[0];
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile berhasil diupdate',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Terjadi kesalahan server' 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};