import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getJournals } from '../services/api';
import { FiFileText, FiBell } from 'react-icons/fi';

function JournalPage() {
  const { t } = useTranslation();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load journals saat halaman dibuka
  const loadJournals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getJournals();
      // Handle format response: kadang data.data, kadang langsung array
      setJournals(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Failed to load journals:", err);
      setError(t('journal.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadJournals();
  }, [loadJournals]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Page */}
        <div className="mb-8 border-b border-white/10 pb-6 flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                <FiBell size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{t('journal.title')}</h1>
                <p className="text-slate-400 mt-1 text-sm">{t('journal.subtitle')}</p>
            </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-white/5">
            <p className="text-slate-400">{t('common.loading')}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 bg-red-500/10 rounded-2xl border border-red-500/20">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={loadJournals}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && journals.length === 0 && (
          <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-white/5 border-dashed">
            <p className="text-slate-500 text-sm">{t('journal.empty')}</p>
          </div>
        )}

        {/* List Journals */}
        {!loading && !error && journals.length > 0 && (
          <div className="space-y-4">
            {journals.map(journal => (
              <div 
                key={journal.id} 
                className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 flex-shrink-0">
                    <FiFileText size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{journal.title}</h3>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 flex-shrink-0">
                        {new Date(journal.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{journal.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalPage;
