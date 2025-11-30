import React, { useState, useEffect } from 'react';
import { getJournals, createJournal, deleteJournal } from '../services/api';
import { FiTrash2, FiPlus, FiFileText, FiLoader, FiBell, FiCheck } from 'react-icons/fi';

function AdminJournalPage() {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Load data saat halaman dibuka
  const loadJournals = async () => {
    try {
      const { data } = await getJournals();
      // Handle format response: kadang data.data, kadang langsung array
      setJournals(Array.isArray(data) ? data : data.data || []); 
    } catch (error) {
      console.error("Failed load journals", error);
    }
  };

  useEffect(() => { loadJournals(); }, []);

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      await createJournal({ title, content });
      setTitle(''); 
      setContent('');
      await loadJournals(); // Refresh list
      alert('Pengumuman berhasil diposting!');
    } catch (error) {
      alert('Gagal memposting jurnal.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if(window.confirm('Hapus pengumuman ini secara permanen?')) {
        try {
            await deleteJournal(id);
            loadJournals();
        } catch (error) {
            alert('Gagal menghapus.');
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Page */}
        <div className="mb-8 border-b border-white/10 pb-6 flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                <FiBell size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Admin Announcements</h1>
                <p className="text-slate-400 mt-1 text-sm">Buat pengumuman untuk semua pengguna aplikasi.</p>
            </div>
        </div>
      
        {/* Form Create Post */}
        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-white/10 mb-10 shadow-xl">
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
               <FiPlus /> Buat Postingan Baru
           </h2>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul</label>
                  <input 
                     type="text" 
                     placeholder="Contoh: Pemeliharaan Sistem..." 
                     value={title} 
                     onChange={e=>setTitle(e.target.value)}
                     className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600" 
                     required
                  />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Isi Pesan</label>
                  <textarea 
                     rows="4" 
                     placeholder="Tulis isi pengumuman di sini..." 
                     value={content} 
                     onChange={e=>setContent(e.target.value)}
                     className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none placeholder-slate-600" 
                     required
                  />
              </div>
              <div className="flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 transition-all transform active:scale-95"
                >
                    {loading ? <FiLoader className="animate-spin" /> : <FiCheck />} Post Now
                </button>
              </div>
           </form>
        </div>

        {/* List History Journals */}
        <div className="space-y-4">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <FiFileText className="text-slate-400"/> Riwayat Postingan
           </h3>
           
           {journals.length === 0 ? (
               <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-white/5 border-dashed">
                   <p className="text-slate-500 text-sm">Belum ada postingan yang dibuat.</p>
               </div>
           ) : (
               journals.map(j => (
                  <div key={j.id} className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl flex justify-between items-start hover:bg-slate-800/60 transition-colors group">
                      <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-white">{j.title}</h3>
                              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                                  {new Date(j.created_at).toLocaleDateString('id-ID')}
                              </span>
                          </div>
                          <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">{j.content}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(j.id)} 
                        className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 p-2.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Hapus Postingan"
                      >
                          <FiTrash2 size={18} />
                      </button>
                  </div>
               ))
           )}
        </div>
      </div>
    </div>
  );
}

export default AdminJournalPage;