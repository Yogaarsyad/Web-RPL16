import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setIsOpen(false);
  };

  const currentLanguage = i18n.language === 'id' ? 'Bahasa Indonesia' : 'English';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all border border-white/10 hover:border-white/20 text-sm font-medium"
      >
        <FiGlobe size={16} />
        <span className="hidden sm:inline">{currentLanguage}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-white/10 rounded-lg shadow-lg overflow-hidden z-50 min-w-[160px]">
          <button
            onClick={() => changeLanguage('id')}
            className={`w-full text-left px-4 py-2 transition-all ${
              i18n.language === 'id'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            🇮🇩 Bahasa Indonesia
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full text-left px-4 py-2 transition-all ${
              i18n.language === 'en'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
