import React, { useState, useRef } from 'react';
import { useLog } from '../context/useLog';
import html2canvas from 'html2canvas';
import { FiDownload, FiShare2, FiActivity, FiUser, FiClock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function SocialSharePage() {
  const { exerciseLogs } = useLog();
  const [selectedLog, setSelectedLog] = useState(exerciseLogs.length > 0 ? exerciseLogs[0] : null);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob')) return url;
    return `http://localhost:5000${url}`;
  };

  const userAvatar = getFullImageUrl(user.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nama || 'User')}&background=f97316&color=fff`;

  // Fungsi Download Gambar Transparan
  const handleDownloadImage = async () => {
    if (!cardRef.current || !selectedLog) return;
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3, 
        backgroundColor: null, // PENTING: Agar background jadi transparan
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `LifeMon-Overlay-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Gagal generate gambar:", err);
      alert("Gagal membuat gambar.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Formatter Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
      });
    } catch { return dateString; }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-6xl flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Share Overlay
        </h1>
        <div className="w-32 hidden md:block"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* KOLOM KIRI: Preview */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm w-full flex flex-col items-center">
            <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Transparent Overlay Preview
            </p>
            <p className="text-xs text-slate-500 mb-4 italic">
              *Background kotak-kotak di bawah ini hanya untuk menunjukkan transparansi. Hasil download akan bening.
            </p>
            
            {/* BACKGROUND CHECKERBOARD (Untuk Visualisasi Transparansi di Layar) */}
            <div className="shadow-2xl rounded-3xl overflow-hidden bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5d/Checker-16x16.png')] bg-repeat">
                
                {/* --- KARTU YANG AKAN DI-DOWNLOAD (TRANSPARAN) --- */}
                <div 
                    ref={cardRef}
                    className="relative w-[375px] h-[667px] flex flex-col justify-between"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* GRADIENT OVERLAY (Agar teks terbaca di atas foto apapun) */}
                    {/* Atas Gelap -> Tengah Transparan -> Bawah Gelap */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90 z-0"></div>

                    {/* Content Atas */}
                    <div className="relative z-10 p-8 pt-12">
                        <div className="flex items-center gap-3 mb-8 opacity-90">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FiActivity className="text-white font-bold text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-widest text-lg shadow-black drop-shadow-md">LIFEMON</h3>
                                <p className="text-[10px] text-white/80 uppercase tracking-widest font-semibold">Activity Tracker</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-orange-400 font-bold text-lg mb-1 flex items-center gap-2 drop-shadow-md">
                                <FiCheckCircle /> Workout Complete
                            </p>
                            <h2 className="text-5xl font-black text-white leading-[0.9] uppercase italic tracking-tighter drop-shadow-lg">
                                {selectedLog ? selectedLog.nama_olahraga : 'No Activity'}
                            </h2>
                            <p className="text-white/90 text-sm mt-3 font-medium border-l-4 border-orange-500 pl-3 drop-shadow-md">
                                {selectedLog ? formatDate(selectedLog.tanggal) : '-'}
                            </p>
                        </div>
                    </div>

                    {/* Content Bawah (Stats & Profile) */}
                    <div className="relative z-10 p-8 pb-10">
                        {/* Stats Besar */}
                        <div className="grid grid-cols-2 gap-y-10 gap-x-6 mb-8">
                            <div>
                                <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1 drop-shadow-md">Duration</p>
                                <p className="text-5xl font-bold text-white drop-shadow-xl">
                                {selectedLog ? selectedLog.durasi_menit : 0}<span className="text-lg font-normal text-white/80 ml-1">min</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1 drop-shadow-md">Energy</p>
                                <p className="text-5xl font-bold text-white drop-shadow-xl">
                                {selectedLog ? selectedLog.kalori_terbakar : 0}<span className="text-lg font-normal text-white/80 ml-1">kcal</span>
                                </p>
                            </div>
                        </div>

                        {/* User Profile Footer */}
                        <div className="flex items-center gap-3 pt-6 border-t border-white/20">
                            <img 
                                src={userAvatar} 
                                alt="Avatar" 
                                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
                                crossOrigin="anonymous" 
                            />
                            <div>
                                <p className="text-white font-bold text-sm drop-shadow-md">{user.nama || 'LifeMon Athlete'}</p>
                                <p className="text-orange-400 text-xs font-semibold">Create your own story</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- END CARD --- */}

            </div>

            <button 
                onClick={handleDownloadImage}
                disabled={!selectedLog || isGenerating}
                className="mt-8 w-full max-w-[350px] flex justify-center items-center px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-full font-bold shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                <span className="flex items-center gap-2 animate-pulse">
                    <FiActivity className="animate-spin" /> Processing...
                </span>
                ) : (
                <>
                    <FiDownload className="mr-2 text-xl" /> Download Overlay (PNG)
                </>
                )}
            </button>
            <p className="text-slate-500 text-xs mt-3 text-center">
                Hasil download adalah file PNG transparan. Tempelkan di atas foto kamu!
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: List Aktivitas */}
        <div className="flex flex-col h-full max-h-[800px]">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <FiShare2 className="text-orange-400" /> Select Activity
            </h3>
            <p className="text-slate-400 text-sm mt-1">Choose an activity to generate the overlay.</p>
          </div>
          
          <div className="flex-1 bg-slate-800/30 border border-white/5 rounded-3xl overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {exerciseLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <FiActivity className="text-4xl mb-3 opacity-20" />
                <p>No activity records found.</p>
              </div>
            ) : (
              exerciseLogs.map((log) => (
                <div 
                  key={log.id || log._id}
                  onClick={() => setSelectedLog(log)}
                  className={`group p-5 rounded-2xl cursor-pointer border transition-all duration-200 flex justify-between items-center ${
                    selectedLog && (selectedLog.id === log.id || selectedLog._id === log._id)
                      ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/50 shadow-lg shadow-orange-900/20'
                      : 'bg-slate-800 border-white/5 hover:bg-slate-750 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-xl shadow-inner transition-colors ${
                       selectedLog && (selectedLog.id === log.id || selectedLog._id === log._id) 
                       ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-500/30' 
                       : 'bg-slate-700 text-slate-400 group-hover:text-white'
                    }`}>
                      <FiActivity size={20} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg capitalize ${
                          selectedLog && (selectedLog.id === log.id || selectedLog._id === log._id) ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}>
                          {log.nama_olahraga}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <FiClock className="text-orange-500/70" />
                          <span>{formatDate(log.tanggal)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white tracking-tight">
                        {log.kalori_terbakar} <span className="text-xs font-normal text-slate-500">kcal</span>
                    </p>
                    <p className="text-sm text-slate-400 font-medium">{log.durasi_menit} min</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SocialSharePage;