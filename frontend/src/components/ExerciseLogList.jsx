import React, { useState } from 'react';
import { useLog } from '../context/LogContext';
import { FiActivity, FiClock, FiCalendar, FiTrash2, FiTrendingUp } from 'react-icons/fi';

function ExerciseLogList() {
  const { exerciseLogs, deleteExerciseLog } = useLog();
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteExerciseLog(deleteId);
      setDeleteId(null);
    }
  };

  if (exerciseLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <div className="bg-slate-800/50 p-4 rounded-full mb-3">
          <FiActivity className="text-4xl text-slate-600" />
        </div>
        <p className="font-medium">No exercise history found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal Delete */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <FiTrash2 className="text-3xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Activity?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to remove this exercise record? This cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400 px-2 mb-2">
          <span>Activity Details</span>
          <span>{exerciseLogs.length} Records</span>
        </div>

        {exerciseLogs.map((log) => (
          <div 
            key={log.id || log._id} 
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 hover:border-green-500/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4 sm:mb-0">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                <FiActivity size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight capitalize">
                  {log.nama_olahraga}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <FiClock className="text-green-500/70" /> {log.durasi_menit} mins
                  </span>
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-slate-500" /> {new Date(log.tanggal).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-400 font-bold text-lg">
                  <FiTrendingUp className="text-sm" />
                  {log.kalori_terbakar} <span className="text-xs font-normal text-slate-400 uppercase mt-1">kcal</span>
                </div>
              </div>

              <button 
                onClick={() => setDeleteId(log.id || log._id)}
                className="p-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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

export default ExerciseLogList;