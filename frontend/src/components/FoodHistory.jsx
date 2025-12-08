// src/components/FoodHistory.js

import React from 'react';
import { FaTrash } from 'react-icons/fa'; // <-- 1. IMPOR IKON
import { useLog } from '../context/useLog';

function FoodHistory({ foodLogs }) {
  const { deleteFoodLog } = useLog();

  return (
    <div className="bg-white rounded-lg">
      <div className="space-y-3">
        {foodLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No food logs yet</p>
        ) : (
          foodLogs.map((log) => (
            <div key={log.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700 capitalize">{log.nama_makanan}</h4>
                  <p className="text-sm text-gray-500">{log.tanggal}</p>
                  <p className="text-sm text-gray-400">
                    Logged: {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4"> {/* Beri jarak lebih */}
                  <span className="bg-orange-100 text-orange-700 text-sm font-medium px-2.5 py-0.5 rounded">
                    {log.kalori} kcal
                  </span>
                  
                  {/* === 3. TOMBOL HAPUS BARU (TIDAK HITAM) === */}
                  <button
                    onClick={() => deleteFoodLog(log.id)}
                    className="p-2 text-gray-400 rounded-md transition-colors duration-200
                               hover:bg-red-100 hover:text-red-600"
                    aria-label="Hapus log makanan"
                  >
                    <FaTrash /> {/* <-- 2. GUNAKAN IKON */}
                  </button>
                  {/* === AKHIR TOMBOL HAPUS === */}
                  
                </div>
              </div>
            </div>
          ))
        )}
      </div>  
    </div>
  );
}

export default FoodHistory;