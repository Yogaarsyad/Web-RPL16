import React from 'react';
import { useLog } from '../context/LogContext';
import FoodLogForm from '../components/FoodLogForm';
import SleepLogForm from '../components/SleepLogForm';
import ExerciseLogForm from '../components/ExerciseLogForm';
import { FiCoffee, FiActivity, FiMoon, FiClock, FiLoader, FiTrendingUp } from 'react-icons/fi';

function DashboardPage() {
  // 1. Get Data from Context
  const { 
    foodLogs = [], 
    exerciseLogs = [], 
    sleepLogs = [], 
    loading,
    addFoodLog,
    addExerciseLog,
    addSleepLog
  } = useLog();

  // 2. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <FiLoader className="text-4xl text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading your health data...</p>
      </div>
    );
  }

  // 3. Calculate Today's Data (Realtime)
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  // Helper function to check if log date is today
  const isToday = (dateString) => {
    if (!dateString) return false;
    const logDate = new Date(dateString).toISOString().split('T')[0];
    return logDate === today;
  };

  // Calculate Today's Food Calories
  const todayFoodCalories = foodLogs
    .filter(log => isToday(log.tanggal))
    .reduce((sum, log) => sum + (parseInt(log.kalori) || 0), 0);

  // Calculate Today's Burned Calories
  const todayExerciseCalories = exerciseLogs
    .filter(log => isToday(log.tanggal))
    .reduce((sum, log) => sum + (parseInt(log.kalori_terbakar) || 0), 0);

  // Calculate Today's Sleep Duration
  const todaySleepHours = sleepLogs
    .filter(log => isToday(log.tanggal))
    .reduce((sum, log) => {
      if (!log.waktu_tidur || !log.waktu_bangun) return sum;
      const start = new Date(log.waktu_tidur);
      const end = new Date(log.waktu_bangun);
      const diffMs = end - start;
      const hours = diffMs / (1000 * 60 * 60); // Convert ms to hours
      return sum + (hours > 0 ? hours : 0);
    }, 0);

  // --- Handlers (Wrapper) ---
  const handleAddFoodLog = (logData) => addFoodLog(logData);
  const handleAddSleepLog = (logData) => addSleepLog(logData);
  const handleAddExerciseLog = (logData) => addExerciseLog(logData);

  // Helper for sleep duration display in list
  const getSleepDuration = (start, end) => {
    if (!start || !end) return '0';
    const diffMs = new Date(end) - new Date(start);
    return (diffMs / (1000 * 60 * 60)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 font-sans text-slate-100 pb-20">
      
      {/* Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 20px; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-cyan-200/60 mt-1">Track your daily progress today.</p>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-cyan-100">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* 1. STATS CARDS (Realtime Numbers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<FiCoffee size={24}/>} 
            title="Calories In" 
            value={todayFoodCalories} 
            unit="kcal" 
            color="blue" 
          />
          <StatCard 
            icon={<FiActivity size={24}/>} 
            title="Calories Burned" 
            value={todayExerciseCalories} 
            unit="kcal" 
            color="green" 
          />
          <StatCard 
            icon={<FiMoon size={24}/>} 
            title="Sleep Duration" 
            value={todaySleepHours.toFixed(1)} 
            unit="hrs" 
            color="purple" 
          />
        </div>

        {/* 2. FOOD SECTION */}
        <section className="space-y-6">
          <SectionHeader title="Food & Nutrition" color="bg-blue-500" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
               <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 p-2 rounded-3xl overflow-hidden shadow-xl">
                 <FoodLogForm onAddLog={handleAddFoodLog} />
               </div>
            </div>
            {/* Food List (No Delete Button) */}
            <div className="lg:col-span-2 bg-gray-800/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[450px] shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/20">
                 <h3 className="font-semibold text-blue-200 text-lg">Today's Meals</h3>
                 <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-bold rounded-full">
                   {foodLogs.length} Records
                 </span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                 {foodLogs.length > 0 ? (
                    foodLogs.map(log => (
                      <div key={log.id || log._id} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-bold text-slate-100 text-lg">{log.nama_makanan}</p>
                          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center">
                            <FiClock className="mr-1.5 text-blue-400"/> {new Date(log.tanggal).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-bold text-blue-300 bg-blue-500/10 px-4 py-2 rounded-xl text-sm border border-blue-500/20">
                          {log.kalori} kcal
                        </span>
                      </div>
                    ))
                 ) : ( <div className="text-center py-10 text-slate-500">No meals logged today.</div> )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. EXERCISE SECTION */}
        <section className="space-y-6">
          <SectionHeader title="Exercise & Activity" color="bg-green-500" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
               <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 p-2 rounded-3xl overflow-hidden shadow-xl">
                  <ExerciseLogForm onAddLog={handleAddExerciseLog} />
               </div>
            </div>
            {/* Exercise List (No Delete Button) */}
            <div className="lg:col-span-2 bg-gray-800/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[450px] shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/20">
                 <h3 className="font-semibold text-green-200 text-lg">Activity History</h3>
                 <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-200 text-xs font-bold rounded-full">
                   Active
                 </span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                 {exerciseLogs.length > 0 ? (
                    exerciseLogs.map(log => (
                      <div key={log.id || log._id} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-bold text-slate-100 text-lg">{log.nama_olahraga}</p>
                          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center">
                            <FiActivity className="mr-1.5 text-green-400"/> {log.durasi_menit} mins
                          </p>
                        </div>
                        <span className="font-bold text-green-300 bg-green-500/10 px-4 py-2 rounded-xl text-sm border border-green-500/20">
                          {log.kalori_terbakar} kcal
                        </span>
                      </div>
                    ))
                 ) : ( <div className="text-center py-10 text-slate-500">No exercises logged today.</div> )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. SLEEP SECTION */}
        <section className="space-y-6">
          <SectionHeader title="Sleep & Recovery" color="bg-purple-500" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
               <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 p-2 rounded-3xl overflow-hidden shadow-xl">
                  <SleepLogForm onAddLog={handleAddSleepLog} />
               </div>
            </div>
            {/* Sleep List (No Delete Button) */}
            <div className="lg:col-span-2 bg-gray-800/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[450px] shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/20">
                 <h3 className="font-semibold text-purple-200 text-lg">Sleep History</h3>
                 <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-bold rounded-full">
                   Rest Logs
                 </span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                 {sleepLogs.length > 0 ? (
                    sleepLogs.map(log => (
                      <div key={log.id || log._id} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-bold text-slate-100 text-lg">
                             {log.waktu_tidur && log.waktu_bangun 
                               ? `${getSleepDuration(log.waktu_tidur, log.waktu_bangun)} hrs sleep` 
                               : 'Sleep Record'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-xs font-semibold border border-purple-500/20">
                              {log.kualitas_tidur}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(log.tanggal).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right hidden sm:block space-y-1">
                           <div className="text-xs font-medium text-purple-200 bg-purple-900/40 px-2 py-1 rounded-lg inline-block mr-1 border border-purple-500/20">
                             🛌 {new Date(log.waktu_tidur).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </div>
                           <div className="text-xs font-medium text-yellow-200 bg-yellow-900/40 px-2 py-1 rounded-lg inline-block border border-yellow-500/20">
                             🌅 {new Date(log.waktu_bangun).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </div>
                        </div>
                      </div>
                    ))
                 ) : ( <div className="text-center py-10 text-slate-500">No sleep records today.</div> )}
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SectionHeader({ title, color }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className={`w-1 h-8 ${color} rounded-full shadow-[0_0_15px_rgba(var(--color-rgb),0.6)]`}></div>
      <h2 className="text-2xl font-bold text-white tracking-wide">{title}</h2>
    </div>
  );
}

function StatCard({ icon, title, value, unit, color }) {
  const styles = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'shadow-blue-500/10' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/20', glow: 'shadow-green-500/10' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' },
  };
  
  const s = styles[color] || styles.blue;

  return (
    <div className={`bg-gray-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-xl ${s.glow}`}>
       <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${s.bg} ${s.text} border ${s.border}`}>{icon}</div>
          <div className="flex items-center text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
             <FiTrendingUp className="mr-1" /> Today
          </div>
       </div>
       <div>
         <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
         <p className="text-3xl font-black text-white tracking-tight">
           {value} <span className="text-sm text-slate-400 font-normal ml-1">{unit}</span>
         </p>
       </div>
    </div>
  );
}

export default DashboardPage;