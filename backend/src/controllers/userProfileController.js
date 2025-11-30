// backend/controllers/userProfileController.js
const UserModel = require('../models/userModel');
const UserProfileModel = require('../models/userProfileModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Modul wajib untuk cek folder

// --- KONFIGURASI MULTER (DENGAN AUTO-CREATE FOLDER) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/avatars/';
    
    // Cek apakah folder sudah ada. Jika belum, buat folder tersebut.
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Folder berhasil dibuat: ${dir}`);
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nama file unik agar tidak bentrok
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Inisialisasi upload
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas 5MB
  fileFilter: fileFilter
});

// --- CONTROLLER FUNCTIONS ---

// 1. Ambil Profil
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(400).json({ success: false, error: 'User ID tidak ditemukan' });

        const profile = await UserProfileModel.getProfileByUserId(userId);
        
        if (!profile) {
            const user = await UserModel.findUserById(userId);
            // Return data user dasar jika profil belum ada
            return res.json({ 
                success: true, 
                data: { ...user, avatar_url: null } 
            });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Update Profil
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(400).json({ success: false, error: 'User ID tidak ditemukan' });

        const { 
            nama, npm, jurusan, email, 
            phone, alamat, bio, avatar_url,
            tanggal_lahir, jenis_kelamin, tinggi_badan, berat_badan 
        } = req.body;

        // Update tabel Users (Nama, Email, dll)
        let updatedUser = null;
        if (nama || npm || jurusan || email) {
            try {
                updatedUser = await UserModel.updateUser(userId, { 
                    nama: nama || '', 
                    npm: npm || '', 
                    jurusan: jurusan || '', 
                    email: email || '' 
                });
            } catch (error) {
                if (error.message.includes('Email already exists')) {
                    return res.status(400).json({ success: false, error: 'Email sudah digunakan user lain' });
                }
                return res.status(500).json({ success: false, error: error.message });
            }
        }

        // Data untuk tabel User Profiles
        const profileData = {
            phone: phone || null,
            alamat: alamat || null,
            bio: bio || null,
            avatar_url: avatar_url || null,
            tanggal_lahir: tanggal_lahir || null,
            jenis_kelamin: jenis_kelamin || null,
            tinggi_badan: tinggi_badan ? parseInt(tinggi_badan) : null,
            berat_badan: berat_badan ? parseInt(berat_badan) : null
        };

        // Upsert (Update atau Insert) Profil
        const updatedProfile = await UserProfileModel.upsertProfileByUserId(userId, profileData);

        const responseData = {
            id: userId,
            nama: updatedUser?.nama || nama,
            email: updatedUser?.email || email,
            npm: updatedUser?.npm || npm,
            jurusan: updatedUser?.jurusan || jurusan,
            ...updatedProfile
        };
        
        res.json({
            success: true,
            message: 'Profil berhasil diperbarui',
            data: responseData
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Upload Avatar
const uploadAvatar = async (req, res) => {
    try {
        const userId = req.userId;
        
        if (!userId) return res.status(400).json({ success: false, error: 'User ID tidak ditemukan' });
        if (!req.file) return res.status(400).json({ success: false, error: 'Tidak ada file yang diupload' });

        // Path relatif untuk disimpan di database (HARUS SAMA dengan path statis di server.js)
        // Gunakan format '/uploads/avatars/namafile.jpg'
        const avatar_url = `/uploads/avatars/${req.file.filename}`;

        // Simpan path ke database
        await UserProfileModel.upsertProfileByUserId(userId, { avatar_url });

        console.log('✅ Avatar berhasil disimpan ke DB:', avatar_url);

        res.json({
            success: true,
            message: 'Avatar berhasil diupload',
            data: { avatar_url }
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    uploadAvatar,
    upload // Pastikan ini diekspor untuk dipakai di router
};