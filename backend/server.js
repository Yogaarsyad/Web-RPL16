// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// --- HELPER: loadRouter ---
// (Berfungsi untuk memuat router dan menangani export default/module.exports)
function loadRouter(modulePath) {
  let mod;
  try {
    mod = require(modulePath);
  } catch (err) {
    console.error(`Gagal require route "${modulePath}":`, err.message);
    process.exit(1);
  }
  const router = (mod && mod.default) ? mod.default : mod;
  // Validasi sederhana untuk memastikan router valid
  if (!router || (typeof router !== 'function' && typeof router.use !== 'function')) {
    console.error(`${modulePath} tidak mengekspor router Express yang valid.`);
    // Pada production Vercel, lebih baik jangan process.exit(1) agar tidak crash total,
    // tapi untuk keamanan debug kita log error saja.
  }
  return router;
}

// --- IMPORT ROUTES ---
const userRoutes = loadRouter('./src/routes/userRoutes');
const foodLogRoutes = loadRouter('./src/routes/foodLogRoutes');
const sleepLogRoutes = loadRouter('./src/routes/sleepLogRoutes');
const exerciseLogRoutes = loadRouter('./src/routes/exerciseLogRoutes');
const reportRoutes = loadRouter('./src/routes/reportRoutes');
const adminRoutes = loadRouter('./src/routes/adminRoutes'); 
const chatRoutes = loadRouter('./src/routes/chatRoutes'); 
const journalRoutes = require('./src/routes/journalRoutes'); // Menggunakan require biasa sesuai kode asli

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. KONFIGURASI CORS (PENTING UNTUK VERCEL) ---
const allowedOrigins = [
  'http://localhost:3000',      // React Local
  'http://localhost:5173',      // Vite Local
  'http://localhost:5000',      // Backend Local
  // -------------------------------------------------------------------------
  // GANTI URL DI BAWAH INI DENGAN LINK FRONTEND VERCEL ANDA NANTI
  // Contoh: 'https://lifemon-app.vercel.app'
  'https://nama-project-frontend-kamu.vercel.app' 
  // -------------------------------------------------------------------------
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      // Jika origin tidak terdaftar, kita tetap izinkan dulu agar tidak error saat development/deploy awal.
      // Nanti jika sudah production stable, Anda bisa ubah menjadi `return callback(new Error(...))`
      return callback(null, true); 
    }
    return callback(null, true);
  },
  credentials: true, // Wajib true agar Cookies/Token login bisa lewat
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// --- 2. STATIC FILES ---
// Catatan: Di Vercel, folder ini Read-Only. Upload file baru tidak akan tersimpan permanen.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. ROUTES MOUNTING ---
app.use('/api/users', userRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/sleep-logs', sleepLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/laporan', reportRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/chat', chatRoutes); 
app.use('/api/journals', journalRoutes);

// Route Default (Cek apakah server hidup)
app.get('/', (req, res) => {
  res.send('API LifeMon Berjalan di Vercel...');
});

// --- 4. START SERVER (LOCAL) ---
// Kode ini tetap berjalan di Local, tapi di Vercel akan di-bypass oleh module.exports
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`🚀 Server LifeMon aktif di http://localhost:${PORT}`);
    });
}

// --- 5. EXPORT APP (WAJIB UNTUK VERCEL) ---
// Vercel membutuhkan ini untuk mengubah Express menjadi Serverless Function
module.exports = app;