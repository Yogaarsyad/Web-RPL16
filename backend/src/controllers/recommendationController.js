const userModel = require('../models/userModel');
const foodLogModel = require('../models/foodLogModel'); 
const exerciseLogModel = require('../models/exerciseLogModel');

const calculateBMR = (user) => {
    if (!user.tinggi_cm || !user.berat_kg || !user.usia || !user.jenis_kelamin) {
        return 2000; // Return nilai default jika profil tidak lengkap.
    }
    // Rumus Harris-Benedict.
    if (user.jenis_kelamin.toLowerCase() === 'pria') {
        return 88.362 + (13.397 * user.berat_kg) + (4.799 * user.tinggi_cm) - (5.677 * user.usia);
    } else { // 'wanita'
        return 447.593 + (9.247 * user.berat_kg) + (3.098 * user.tinggi_cm) - (4.330 * user.usia);
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // mengambil data yang diperlukan.
        const user = await userModel.findUserById(userId); 
        
        // Diasumsikan model-model ini punya fungsi getForTodayByUserId.
        const todayFoodLogs = await foodLogModel.getForTodayByUserId(userId); 
        const todayExerciseLogs = await exerciseLogModel.getForTodayByUserId(userId);

        // Melakukan kalkulasi.
        const totalKaloriMasuk = todayFoodLogs.reduce((sum, log) => sum + log.kalori, 0);
        const totalKaloriKeluar = todayExerciseLogs.reduce((sum, log) => sum + log.kalori_terbakar, 0);
        const bmr = calculateBMR(user);
        const kaloriBersih = totalKaloriMasuk - totalKaloriKeluar;

        // Menerapkan Aturan Logika untuk menghasilkan rekomendasi.
        let recommendations = [];

        // Keseimbangan Kalori.
        if (kaloriBersih > bmr + 300) {
            recommendations.push({
                type: 'warning',
                message: `Asupan kalori Anda hari ini (${totalKaloriMasuk} kkal) terlihat lebih tinggi dari kebutuhan dasar Anda. Pertimbangkan aktivitas ringan untuk menyeimbangkannya.`
            });
        } else if (kaloriBersih < bmr - 300) {
            recommendations.push({
                type: 'info',
                message: `Energi Anda penting! Asupan kalori Anda (${totalKaloriMasuk} kkal) lebih rendah dari kebutuhan dasar. Pastikan Anda makan cukup.`
            });
        } else {
            recommendations.push({
                type: 'success',
                message: `Kerja bagus! Keseimbangan kalori Anda hari ini sudah cukup baik.`
            });
        }

        //  Aktivitas Fisik.
        if (totalKaloriKeluar === 0) {
            recommendations.push({
                type: 'info',
                message: `Belum ada aktivitas olahraga tercatat. Coba jalan santai 30 menit untuk meningkatkan metabolisme.`
            });
        } else if (totalKaloriKeluar > 500) {
             recommendations.push({
                type: 'success',
                message: `Luar biasa! Anda telah membakar ${totalKaloriKeluar} kkal hari ini. Pastikan untuk beristirahat cukup.`
            });
        }

        res.json({
            summary: {
                kaloriMasuk: totalKaloriMasuk,
                kaloriKeluar: totalKaloriKeluar,
                kebutuhanDasar: Math.round(bmr),
                kaloriBersih: Math.round(kaloriBersih),
            },
            recommendations
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error saat membuat rekomendasi.', error: error.message });
    }
};