const { Pool } = require('pg');
require('dotenv').config();

// Konfigurasi Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Wajib untuk Neon/Supabase
  }
});

// HAPUS atau KOMENTARI bagian pool.connect() manual di sini.
// Di Vercel, pengecekan manual ini sering menyebabkan timeout error 500.
/*
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Gagal terhubung ke database:', err.message);
  }
  console.log('✅ Database connected successfully!');
  release();
});
*/

// Export query wrapper
module.exports = {
  query: (text, params) => pool.query(text, params),
};