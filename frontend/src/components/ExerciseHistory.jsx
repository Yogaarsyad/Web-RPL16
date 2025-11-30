// src/components/ExerciseHistory.js

import React from 'react';
import { FaTrash } from 'react-icons/fa'; // <-- IMPOR IKON TRASH
import { useLog } from '../context/LogContext';

function ExerciseHistory({ exerciseLogs }) {
  const { deleteExerciseLog } = useLog();

  return (
    <div className="bg-white rounded-lg">
      <div className="space-y-3">
        {exerciseLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No exercise logs yet</p>
        ) : (
          exerciseLogs.map((log) => (
            <div key={log.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700">{log.jenis_olahraga || log.nama_olahraga}</h4>
                  <p className="text-sm text-gray-500">{log.tanggal}</p>
                  <p className="text-sm text-gray-400">
                    Logged: {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded">
                    {log.kalori_terbakar} kcal burned
                  </span>
                  
                  {/* === TOMBOL HAPUS BARU (TIDAK HITAM) === */}
                  <button
                    onClick={() => deleteExerciseLog(log.id)}
                    className="p-2 text-gray-400 rounded-md transition-colors duration-200
                               hover:bg-red-100 hover:text-red-600"
                    aria-label="Hapus log olahraga"
                  >
                    <FaTrash /> {/* <-- GUNAKAN IKON TRASH */}
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

export default ExerciseHistory;