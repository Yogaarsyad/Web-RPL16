// src/components/SleepHistory.js

import React from 'react';
import { FaTrash } from 'react-icons/fa'; // <-- IMPOR IKON TRASH
import { useLog } from '../context/LogContext';

function SleepHistory({ sleepLogs = [] }) {
  const { deleteSleepLog } = useLog();

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSleepDuration = (start, end) => {
    if (!start || !end) return '0';
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) return '0';
    const diffMs = endDate - startDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="space-y-3">
        {sleepLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No sleep records yet</p>
        ) : (
          sleepLogs.map((log) => (
            <div key={log.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700">{log.tanggal || 'No date'}</h4>
                  <p className="text-sm text-gray-500">
                    {formatTime(log.waktu_tidur)} - {formatTime(log.waktu_bangun)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Duration: {getSleepDuration(log.waktu_tidur, log.waktu_bangun)} hours
                  </p>
                  {log.kualitas_tidur && (
                    <p className="text-sm text-gray-400">Quality: {log.kualitas_tidur}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  
                  {/* === TOMBOL HAPUS BARU (TIDAK HITAM) === */}
                  <button
                    onClick={() => deleteSleepLog(log.id)}
                    className="p-2 text-gray-400 rounded-md transition-colors duration-200
                               hover:bg-red-100 hover:text-red-600"
                    aria-label="Hapus log tidur"
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

export default SleepHistory;