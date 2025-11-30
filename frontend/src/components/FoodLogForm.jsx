import React, { useState, useEffect } from 'react';
import { checkCalories } from '../services/api';
import { useLog } from '../context/LogContext';
import { FiCoffee, FiActivity, FiCalendar, FiSearch, FiCheckCircle, FiInfo, FiPlus, FiAlertCircle } from 'react-icons/fi';

function FoodLogForm() {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiResponse, setAiResponse] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { addFoodLog } = useLog();

  const handleInputClick = (e) => {
    try {
      if (e.target.showPicker) e.target.showPicker();
    } catch (error) {
      console.log("Browser does not support showPicker", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!foodName || !calories || !date) {
      setAiResponse({ error: 'Please fill in all required fields' });
      return;
    }

    setSubmitting(true);
    try {
      await addFoodLog({ 
        nama_makanan: foodName, 
        kalori: parseInt(calories), 
        tanggal: date 
      });
      
      // Reset form
      setFoodName('');
      setCalories('');
      setDate(new Date().toISOString().split('T')[0]);
      setAiResponse(null);
    } catch (error) {
      setAiResponse({ error: error.message });
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
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <FiCoffee size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            New Food Log
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Track your calories & nutrition 🍎
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Input: Food Name + AI Check */}
        <div className="group">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
            <FiCoffee className="mr-1.5 text-blue-400" /> Food Name
          </label>
          <div className="flex relative shadow-sm rounded-xl">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Fried Rice"
              required
              disabled={submitting}
              className="block w-full pl-4 pr-3 py-3 rounded-l-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={async () => {
                if (!foodName.trim() || checking) return;
                try {
                  setChecking(true);
                  setAiResponse(null);
                  const res = await checkCalories(foodName.trim());
                  if (res?.data?.kcal_per_100g != null) {
                    setCalories(String(res.data.kcal_per_100g));
                  }
                  setAiResponse(res.data);
                } catch (err) {
                  const msg = err.response?.data?.message || err.message;
                  setAiResponse({ error: msg });
                } finally {
                  setChecking(false);
                }
              }}
              disabled={checking || submitting}
              className="inline-flex items-center px-4 py-2 border border-l-0 border-slate-700 bg-slate-800/80 text-blue-400 font-bold text-sm rounded-r-xl hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? (
                 <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                <>
                  <FiSearch className="mr-2" /> Check Calories
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input: Calories */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
                <FiActivity className="mr-1.5 text-blue-400" /> Calories (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g., 450"
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm disabled:opacity-50"
              />
            </div>

            {/* Input: Date */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center">
                <FiCalendar className="mr-1.5 text-blue-400" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={handleInputClick}
                required
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white font-medium placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 [color-scheme:dark]"
              />
            </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center items-center py-3.5 px-4 mt-2 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-900/40 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <FiPlus className="mr-2 text-2xl" /> Add Food Log
            </>
          )}
        </button>
      </form>

      {/* AI Result Area (Dark Mode) */}
      {aiResponse && (
        <div className={`mt-6 p-4 rounded-xl border animate-fade-in ${aiResponse.error ? 'bg-red-900/20 border-red-800/50' : 'bg-green-900/20 border-green-800/50'}`}>
          {aiResponse.error ? (
            <div className="flex items-center text-red-400 font-medium">
                <FiAlertCircle className="mr-2 text-lg" /> {aiResponse.error}
            </div>
          ) : (
            <div>
              <div className="flex items-center font-bold text-green-400 mb-1">
                <FiCheckCircle className="mr-2 text-lg" /> AI Result Found
              </div>
              <div className="pl-7">
                  <div className="text-sm text-slate-300 font-semibold">{aiResponse.matched_name || 'No matched name'}</div>
                  {aiResponse.kcal_per_100g != null && (
                    <div className="mt-1 text-sm text-slate-400">
                        Estimated: <span className="font-bold text-green-400">{aiResponse.kcal_per_100g} kcal</span> per 100g
                    </div>
                  )}
                  <div className="mt-2 text-xs text-slate-500 flex items-center">
                      <FiInfo className="mr-1" /> Source: {aiResponse.source || 'unknown'}
                  </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FoodLogForm;