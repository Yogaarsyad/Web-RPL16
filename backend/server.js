// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // 1. WAJIB: Import module path
require('dotenv').config();

// Helper untuk memuat router dan unwrap `default` export jika perlu
function loadRouter(modulePath) {
  let mod;
  try {
    mod = require(modulePath);
  } catch (err) {
    console.error(`Gagal require route "${modulePath}":`, err.message);
    process.exit(1);
  }
  const router = (mod && mod.default) ? mod.default : mod;
  console.log(`Loaded ${modulePath}: typeof=${typeof router}`, router && typeof router.use === 'function' ? '(express router)' : '');
  if (!router || (typeof router !== 'function' && typeof router.use !== 'function')) {
    console.error(`${modulePath} tidak mengekspor router Express. Tipe yang diterima: ${typeof router}`);
    console.error('Export yang diterima:', router);
    process.exit(1);
  }
  return router;
}

// Impor semua routes menggunakan helper loadRouter
const userRoutes = loadRouter('./src/routes/userRoutes');
const foodLogRoutes = loadRouter('./src/routes/foodLogRoutes');
const sleepLogRoutes = loadRouter('./src/routes/sleepLogRoutes');
const exerciseLogRoutes = loadRouter('./src/routes/exerciseLogRoutes');
const reportRoutes = loadRouter('./src/routes/reportRoutes');
const adminRoutes = loadRouter('./src/routes/adminRoutes'); 
const chatRoutes = loadRouter('./src/routes/chatRoutes'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- 2. WAJIB: SETUP FOLDER UPLOADS AGAR BISA DIAKSES ---
// Ini membuat http://localhost:5000/uploads/avatar... bisa dibuka
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gunakan semua routes
app.use('/api/users', userRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/sleep-logs', sleepLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/laporan', reportRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/chat', chatRoutes); 

app.get('/', (req, res) => {
  res.send('API LifeMon Berjalan...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server LifeMon aktif di http://localhost:${PORT}`);
});