const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Wajib untuk Neon/Supabase/Cloud DB
  }
});

// Cek koneksi saat server pertama kali jalan
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Gagal terhubung ke database:', err.message);
  }
  console.log('✅ Database connected successfully!');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};