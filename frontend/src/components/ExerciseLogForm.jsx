import React, { useState } from 'react';
import { FiActivity, FiClock, FiTrendingUp, FiCalendar, FiPlus } from 'react-icons/fi';

function ExerciseLogForm({ onAddLog }) {
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAddLog({
        nama_olahraga: activityName,
        durasi_menit: parseInt(duration),
        kalori_terbakar: parseInt(caloriesBurned),
        tanggal: date
      });
      // Reset Form
      setActivityName('');
      setDuration('');
      setCaloriesBurned('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      <style>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* HEADER FORM */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500/20 rounded-xl text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10">
          <FiActivity size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            New Workout
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Stay fit & healthy 💪
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Input: Activity Name */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
            <FiActivity className="mr-1.5 text-green-400" /> Activity Type
          </label>
          <input
            type="text"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="e.g. Running, Gym"
            required
            disabled={submitting}
            className="block w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all disabled:opacity-50"
          />
        </div>

        {/* Grid: Duration & Calories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
                <FiClock className="mr-1.5 text-green-400" /> Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm disabled:opacity-50"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
                <FiTrendingUp className="mr-1.5 text-green-400" /> Calories (kcal)
              </label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                placeholder="250"
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm disabled:opacity-50"
              />
            </div>
        </div>

        {/* Input: Date */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
            <FiCalendar className="mr-1.5 text-green-400" /> Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 [color-scheme:dark]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center items-center py-3.5 px-4 mt-2 rounded-xl text-white font-bold text-lg shadow-lg shadow-green-900/40 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
               <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Adding...
            </span>
          ) : (
            <>
              <FiPlus className="mr-2 text-2xl" /> Add Activity
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ExerciseLogForm;