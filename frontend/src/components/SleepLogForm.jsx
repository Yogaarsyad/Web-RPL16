import React, { useState } from 'react';
import { FiMoon, FiCalendar, FiClock, FiActivity, FiPlus } from 'react-icons/fi';

function SleepLogForm({ onAddLog }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState('Good');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !sleepTime || !wakeTime) {
      alert("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Gabungkan tanggal dengan jam agar format ISO valid
      const start = new Date(`${date}T${sleepTime}`);
      const end = new Date(`${date}T${wakeTime}`);
      
      // Logika: Jika waktu bangun lebih kecil dari tidur (misal tidur 23:00, bangun 06:00), 
      // berarti bangunnya besok hari.
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }

      await onAddLog({
        tanggal: date,
        waktu_tidur: start.toISOString(),
        waktu_bangun: end.toISOString(),
        kualitas_tidur: quality,
      });

      // Reset form
      setSleepTime('');
      setWakeTime('');
      setQuality('Good');
    } catch (error) {
      console.error("Error saving log", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      {/* CSS untuk menyembunyikan panah input number jika ada, dan custom scroll */}
      <style>{`
        input[type=time]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
      `}</style>

      {/* HEADER FORM */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/10">
          <FiMoon size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            New Sleep Log
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Track your sleep quality 😴
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Input: Date */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
            <FiCalendar className="mr-1.5 text-purple-400" /> Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 [color-scheme:dark]"
          />
        </div>

        {/* Grid: Sleep & Wake Time */}
        <div className="grid grid-cols-2 gap-5">
          <div className="group">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
              <FiClock className="mr-1.5 text-purple-400" /> Sleep Time
            </label>
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 [color-scheme:dark]"
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
              <FiClock className="mr-1.5 text-yellow-400" /> Wake Up
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Input: Sleep Quality */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
            <FiActivity className="mr-1.5 text-purple-400" /> Sleep Quality
          </label>
          <div className="relative">
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="Excellent" className="bg-slate-800">Excellent 🤩 (Deep Sleep)</option>
              <option value="Good" className="bg-slate-800">Good 🙂 (Restful)</option>
              <option value="Fair" className="bg-slate-800">Fair 😐 (Average)</option>
              <option value="Poor" className="bg-slate-800">Poor 😫 (Restless)</option>
              <option value="Insomnia" className="bg-slate-800">Insomnia 😵 (Difficulty)</option>
            </select>
            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center items-center py-3.5 px-4 mt-2 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-900/40 bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
               <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Saving...
            </span>
          ) : (
            <>
              <FiPlus className="mr-2 text-2xl" /> Add Sleep Record
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default SleepLogForm;