import React, { useState } from 'react';
import { useLog } from '../context/LogContext';
import { FiCoffee, FiCalendar, FiTrash2, FiAlertCircle, FiX } from 'react-icons/fi';

function FoodLogList() {
  const { foodLogs, deleteFoodLog } = useLog();
  const [deleteId, setDeleteId] = useState(null); // State untuk menyimpan ID yang mau dihapus

  const handleDelete = () => {
    if (deleteId) {
      deleteFoodLog(deleteId);
      setDeleteId(null); // Tutup modal setelah hapus
    }
  };

  if (foodLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <div className="bg-slate-800/50 p-4 rounded-full mb-3">
          <FiCoffee className="text-4xl text-slate-600" />
        </div>
        <p className="font-medium">No food logs yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal Konfirmasi Delete Keren */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl transform scale-100 transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <FiTrash2 className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Item?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to remove this record? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-900/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List Item */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400 px-2 mb-2">
          <span>Meal Details</span>
          <span>{foodLogs.length} Records</span>
        </div>

        {foodLogs.map((log) => (
          <div 
            key={log.id || log._id} 
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4 sm:mb-0">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <FiCoffee size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight capitalize">
                  {log.nama_makanan}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-slate-500" /> {new Date(log.tanggal).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
              <div className="text-right">
                <div className="text-blue-400 font-bold text-lg">
                  {log.kalori} <span className="text-xs font-normal text-slate-400 uppercase">kcal</span>
                </div>
              </div>

              <button 
                onClick={() => setDeleteId(log.id || log._id)} // Buka Modal
                className="p-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default FoodLogList;