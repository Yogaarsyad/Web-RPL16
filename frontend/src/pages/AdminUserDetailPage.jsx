import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetUserDetail, adminGetUserLogs, sendMessage } from '../services/api';
import { FiArrowLeft, FiUser, FiActivity, FiMoon, FiCoffee, FiDatabase, FiMessageCircle, FiX, FiSend, FiLoader } from 'react-icons/fi';

// Komponen Tab Kecil
function Tab({ label, active, onClick, icon }) {
  return (
    <button onClick={onClick} className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${active ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800'}`}>
      <span className="mr-2 text-lg">{icon}</span> {label}
    </button>
  );
}

function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Data
  const [detail, setDetail] = useState(null);
  const [tab, setTab] = useState('food');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Chat
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);

  const me = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch (_) { return {}; }
  }, []);
  const isAdmin = me?.role === 'admin';

  // Load Detail User
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await adminGetUserDetail(id);
        if (mounted) setDetail(data);
      } catch (e) { console.error(e); } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Load Logs User
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isAdmin) return;
      try {
        const { data } = await adminGetUserLogs(id, tab);
        if (mounted) setLogs(data || []);
      } catch (e) { if (mounted) setLogs([]); }
    })();
    return () => { mounted = false; };
  }, [id, tab, isAdmin]);

  // --- FUNGSI KIRIM PESAN ---
  const handleSendMessage = async () => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
        await sendMessage({ receiver_id: id, message: msgText });
        alert('Pesan berhasil dikirim!');
        setMsgText('');
        setMsgModalOpen(false);
    } catch(e) {
        alert('Gagal mengirim pesan.');
    } finally {
        setSending(false);
    }
  };

  if (!isAdmin) return <div className="p-10 text-center text-red-500">Access Denied</div>;

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 pb-20">
      
      {/* --- MODAL CHAT --- */}
      {msgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl transform scale-100 transition-all">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FiMessageCircle className="text-blue-400"/> Kirim Pesan
                    </h3>
                    <button onClick={() => setMsgModalOpen(false)} className="text-slate-400 hover:text-white"><FiX size={24}/></button>
                </div>
                
                <div className="bg-slate-900/50 p-3 rounded-xl mb-4 border border-white/5">
                    <p className="text-xs text-slate-400">Penerima:</p>
                    <p className="text-sm font-bold text-white">{detail?.user?.nama}</p>
                </div>
                
                <textarea 
                    className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-blue-500 outline-none h-32 resize-none mb-4 placeholder-slate-600"
                    placeholder="Tulis pesan teguran atau saran kesehatan..."
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                />
                
                <div className="flex justify-end gap-3">
                    <button onClick={() => setMsgModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Batal</button>
                    <button 
                        onClick={handleSendMessage} 
                        disabled={sending}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/20"
                    >
                        {sending ? <FiLoader className="animate-spin"/> : <FiSend />} Kirim
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Back */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-white/5">
                <FiArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-white">User Details</h1>
                <p className="text-slate-400 text-xs uppercase tracking-wider">Manage User Data</p>
            </div>
        </div>

        {detail && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* PROFILE CARD (KIRI) */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl h-fit text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg border-4 border-slate-800">
                    {detail.user?.nama?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-white">{detail.user?.nama}</h2>
                <p className="text-slate-400 text-sm mb-4">{detail.user?.email}</p>
                
                {/* TOMBOL MESSAGE USER (Ini yang ditambahkan) */}
                <button 
                    onClick={() => setMsgModalOpen(true)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mb-6 shadow-lg shadow-indigo-900/30 active:scale-95"
                >
                    <FiMessageCircle /> Message User
                </button>

                <div className="border-t border-white/10 pt-4 text-left space-y-3">
                   <div className="flex justify-between text-sm"><span className="text-slate-500">Role</span> <span className="text-white uppercase font-bold px-2 py-0.5 bg-slate-700 rounded text-xs">{detail.user?.role}</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-500">Total Logs</span> <span className="text-white font-bold">{(detail.counts?.food || 0) + (detail.counts?.exercise || 0)}</span></div>
                </div>
            </div>

            {/* LOGS SECTION (KANAN) */}
            <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-2 mb-4">
                    <Tab label="Food Logs" active={tab === 'food'} onClick={() => setTab('food')} icon={<FiCoffee/>} />
                    <Tab label="Exercise Logs" active={tab === 'exercise'} onClick={() => setTab('exercise')} icon={<FiActivity/>} />
                    <Tab label="Sleep Logs" active={tab === 'sleep'} onClick={() => setTab('sleep')} icon={<FiMoon/>} />
                </div>
                
                {/* TABEL DATA */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl min-h-[300px]">
                    {logs?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <FiDatabase className="text-4xl mb-2 opacity-20" />
                            <p>Data kosong untuk kategori ini.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-500">
                                    <tr>
                                        {Object.keys(logs[0]).slice(0, 4).map((k) => (
                                            <th key={k} className="px-6 py-4 whitespace-nowrap border-b border-white/5">{k.replace(/_/g, ' ')}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {logs.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            {Object.keys(logs[0]).slice(0, 4).map((k) => (
                                                <td key={k} className="px-6 py-4 whitespace-nowrap">
                                                    {(k.includes('tanggal') || k.includes('at')) && row[k] ? new Date(row[k]).toLocaleDateString() : String(row[k])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUserDetailPage;