import React, { useState, useMemo, useRef } from 'react';
import { useLog } from '../context/useLog';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { FiTrendingUp, FiCoffee, FiActivity, FiMoon, FiDownload, FiLoader, FiImage } from 'react-icons/fi';

// Import html2canvas for image export
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ReportPage() {
  const { foodLogs, exerciseLogs, sleepLogs } = useLog();
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'
  
  // Loading state for export
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref for the area to be captured
  const reportRef = useRef(null);

  // --- EXPORT TO IMAGE (PNG) FUNCTION ---
  const handleExportImage = async () => {
    const input = reportRef.current;
    if (!input) return;

    setIsExporting(true);

    try {
      // 1. Wait for chart animation (optional)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 2. Capture screenshot
      const canvas = await html2canvas(input, {
        scale: 2, // High resolution
        backgroundColor: '#0f172a', // Ensure Slate-900 background is captured
        useCORS: true,
        logging: false
      });

      // 3. Convert to Image URL
      const imgData = canvas.toDataURL('image/png');
      
      // 4. Trigger Download
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Health-Report-${new Date().toISOString().split('T')[0]}.png`;
      link.click();

    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to save image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // --- RECOMMENDATION LOGIC ---
  const recommendations = useMemo(() => {
    const recs = [];
    
    const totalSleepHours = sleepLogs.reduce((sum, log) => {
        if (!log.waktu_tidur || !log.waktu_bangun) return sum;
        const start = new Date(log.waktu_tidur);
        const end = new Date(log.waktu_bangun);
        const diff = (end - start) / 36e5; // hours
        return sum + (diff > 0 ? diff : 0);
    }, 0);
    const avgSleep = sleepLogs.length ? totalSleepHours / sleepLogs.length : 0;

    const totalIn = foodLogs.reduce((sum, item) => sum + (item.kalori || 0), 0);
    const totalOut = exerciseLogs.reduce((sum, item) => sum + (item.kalori_terbakar || 0), 0);
    
    // Logic Analysis
    if (avgSleep > 0 && avgSleep < 7) {
      recs.push({
        title: "Sleep Deprived",
        desc: "Your average sleep is under 7 hours. Aim for 7-9 hours for optimal recovery.",
        type: "sleep",
        color: "border-purple-500/30 bg-purple-500/10 text-purple-200"
      });
    }

    if (exerciseLogs.length === 0) {
      recs.push({
        title: "Start Moving",
        desc: "No exercise recorded yet. A 30-minute walk can significantly boost your health.",
        type: "exercise",
        color: "border-green-500/30 bg-green-500/10 text-green-200"
      });
    }

    if (totalIn > 2500 && totalOut < 500 && timeRange === 'week') {
      recs.push({
        title: "High Calorie Surplus",
        desc: "High intake with low burn. Consider reducing sugar/fried foods or increasing activity.",
        type: "food",
        color: "border-blue-500/30 bg-blue-500/10 text-blue-200"
      });
    }

    // Default Good Health
    if (recs.length === 0) {
        recs.push({
            title: "Keep It Up!",
            desc: "Your routine looks balanced. Great job maintaining your health!",
            type: "general",
            color: "border-slate-500/30 bg-slate-500/10 text-slate-200"
        });
    }
    return recs;
  }, [foodLogs, exerciseLogs, sleepLogs, timeRange]);

  // --- CHART DATA ---
  const chartData = useMemo(() => {
    const days = timeRange === 'week' ? 7 : 30;
    const labels = [];
    const dateKeys = []; 
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // English Date Format
      labels.push(d.toLocaleDateString('en-US', { 
        weekday: timeRange === 'week' ? 'short' : undefined, 
        day: 'numeric', 
        month: timeRange === 'month' ? 'short' : undefined 
      }));
      dateKeys.push(d.toISOString().split('T')[0]);
    }

    const getDateKey = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

    const dataFood = dateKeys.map(key => 
      foodLogs.filter(log => getDateKey(log.tanggal) === key).reduce((a, c) => a + (c.kalori || 0), 0)
    );
    const dataExercise = dateKeys.map(key => 
      exerciseLogs.filter(log => getDateKey(log.tanggal) === key).reduce((a, c) => a + (c.kalori_terbakar || 0), 0)
    );
    const dataSleep = dateKeys.map(key => 
      sleepLogs.filter(log => getDateKey(log.tanggal) === key).reduce((acc, log) => {
         if (!log.waktu_tidur || !log.waktu_bangun) return acc;
         const diff = (new Date(log.waktu_bangun) - new Date(log.waktu_tidur)) / 36e5;
         return acc + (diff > 0 ? diff : 0);
      }, 0)
    );

    return { labels, dataFood, dataExercise, dataSleep };
  }, [timeRange, foodLogs, exerciseLogs, sleepLogs]);

  // --- CHART OPTIONS (DARK MODE) ---
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 12 } } },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1
        }
    },
    scales: {
        y: { 
            beginAtZero: true, 
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
        },
        x: { 
            grid: { display: false },
            ticks: { color: '#94a3b8' }
        }
    }
  };

  const calorieChartData = {
    labels: chartData.labels,
    datasets: [
      { label: 'Calories In', data: chartData.dataFood, backgroundColor: '#3B82F6', borderRadius: 6, barPercentage: 0.6 },
      { label: 'Calories Out', data: chartData.dataExercise, backgroundColor: '#22C55E', borderRadius: 6, barPercentage: 0.6 },
    ],
  };

  const sleepChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Sleep (Hours)',
        data: chartData.dataSleep,
        borderColor: '#A855F7',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.5)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#A855F7',
      },
    ],
  };

  const distributionData = {
    labels: ['Food', 'Exercise', 'Sleep'],
    datasets: [
      {
        data: [foodLogs.length, exerciseLogs.length, sleepLogs.length],
        backgroundColor: ['#3B82F6', '#22C55E', '#A855F7'],
        borderWidth: 0,
        hoverOffset: 10
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Health Report</h1>
            <p className="text-slate-400 mt-1">Summary and analysis of your health activities.</p>
          </div>
          
          <div className="flex gap-3">
            {/* Filter Time */}
            <div className="bg-slate-800 p-1 rounded-xl shadow-lg border border-white/5 flex">
              <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      timeRange === 'week' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                  Last 7 Days
              </button>
              <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      timeRange === 'month' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                  Last 30 Days
              </button>
            </div>

            {/* EXPORT IMAGE BUTTON */}
            <button
              onClick={handleExportImage}
              disabled={isExporting}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-500/50 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <><FiLoader className="mr-2 animate-spin" /> Saving...</>
              ) : (
                <><FiImage className="mr-2" /> Save as Image</>
              )}
            </button>
          </div>
        </div>

        {/* CAPTURE AREA (ref={reportRef}) */}
        <div ref={reportRef} className="space-y-8 bg-slate-900 p-6 -m-6 rounded-3xl"> 
          
          {/* Hidden Header for Screenshot */}
          <div className="hidden group-data-[exporting=true]:block text-center mb-4">
             <h2 className="text-2xl font-bold text-white">LifeMon Health Report</h2>
             <p className="text-slate-400 text-sm">{new Date().toLocaleDateString()}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard 
                  title="Total Calories In" 
                  value={foodLogs.reduce((a,b)=>a+(b.kalori||0),0).toLocaleString()} 
                  unit="kcal" color="text-blue-400" bgColor="bg-blue-500/10" borderColor="border-blue-500/20"
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
              />
              <StatCard 
                  title="Calories Burned" 
                  value={exerciseLogs.reduce((a,b)=>a+(b.kalori_terbakar||0),0).toLocaleString()} 
                  unit="kcal" color="text-green-400" bgColor="bg-green-500/10" borderColor="border-green-500/20"
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
              />
              <StatCard 
                  title="Sleep Records" 
                  value={sleepLogs.length} 
                  unit="sessions" color="text-purple-400" bgColor="bg-purple-500/10" borderColor="border-purple-500/20"
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>}
              />
              <StatCard 
                  title="Net Balance" 
                  value={(foodLogs.reduce((a,b)=>a+(b.kalori||0),0) - exerciseLogs.reduce((a,b)=>a+(b.kalori_terbakar||0),0)).toLocaleString()} 
                  unit="kcal" color="text-orange-400" bgColor="bg-orange-500/10" borderColor="border-orange-500/20"
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2-2z"></path></svg>}
              />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Bar Chart */}
              <div className="bg-gray-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl lg:col-span-2">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                      <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                      Calorie Comparison
                  </h3>
                  <div className="h-72">
                      <Bar data={calorieChartData} options={commonOptions} />
                  </div>
              </div>

               {/* Distribution Chart */}
               <div className="bg-gray-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6">Log Distribution</h3>
                  <div className="h-64 flex justify-center">
                      <Doughnut data={distributionData} options={{...commonOptions, plugins: {legend: {position: 'bottom', labels: {color: '#cbd5e1'}}}}} />
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Sleep Line Chart */}
               <div className="bg-gray-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                      <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
                      Sleep Duration Trend
                  </h3>
                  <div className="h-64">
                      <Line data={sleepChartData} options={commonOptions} />
                  </div>
              </div>

              {/* RECOMMENDATIONS */}
              <div className="bg-gray-800/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Health Suggestions
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-64">
                      {recommendations.map((rec, idx) => (
                          <div key={idx} className={`p-4 rounded-2xl border ${rec.color} flex items-start gap-3 transition-transform hover:scale-[1.01]`}>
                              <div className="mt-1 text-xl">
                                  {rec.type === 'sleep' && '😴'}
                                  {rec.type === 'exercise' && '🏃'}
                                  {rec.type === 'food' && '🥗'}
                                  {rec.type === 'general' && '✨'}
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm mb-1">{rec.title}</h4>
                                  <p className="text-sm opacity-80 leading-relaxed">{rec.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        
        </div> 
        {/* End of Snapshot Area */}

      </div>
    </div>
  );
}

const StatCard = ({ title, value, unit, color, bgColor, borderColor, icon }) => (
    <div className={`p-6 rounded-3xl border ${borderColor} ${bgColor} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${color}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/5 ${color}`}>
                Current
            </span>
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h4 className="text-3xl font-black text-white">
                {value} <span className="text-sm text-slate-500 font-normal">{unit}</span>
            </h4>
        </div>
    </div>
);

export default ReportPage;