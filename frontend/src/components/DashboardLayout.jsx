import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiMenu, FiX, FiLogOut, FiBarChart2, 
  FiHome, FiUser, FiActivity, FiMessageSquare, FiShare2, 
  FiShield, FiFileText // Pastikan FiFileText diimport untuk icon Journal
} from 'react-icons/fi';

function DashboardLayout({ onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState({ nama: '', avatar_url: '', role: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. HELPER URL GAMBAR ---
  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob')) return url; 
    return `http://localhost:5000${url}`; 
  };

  // --- 2. LOAD DATA USER ---
  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Gagal memuat user header", error);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    window.addEventListener('user-updated', loadUserFromStorage);
    window.addEventListener('storage', loadUserFromStorage);
    return () => {
      window.removeEventListener('user-updated', loadUserFromStorage);
      window.removeEventListener('storage', loadUserFromStorage);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false); else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('activity-history')) return 'Activity History';
    if (path.includes('laporan')) return 'Health Reports';
    if (path.includes('profile')) return 'My Profile';
    if (path.includes('chat')) return 'AI Assistant';
    if (path.includes('share')) return 'Share Activity';
    if (path.includes('admin/journal')) return 'Post Announcement';
    if (path.includes('admin')) return 'Admin Panel';
    return 'Dashboard';
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
    return (
      <Link 
        to={to} 
        onClick={() => isMobile && setSidebarOpen(false)}
        className={`flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon className={`text-xl mr-3 ${isActive ? 'text-white' : 'group-hover:text-blue-400'}`} />
        <span className="font-medium tracking-wide">{label}</span>
      </Link>
    );
  };

  const avatarSrc = getFullImageUrl(currentUser.avatar_url) || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.nama || 'User')}&background=0ea5e9&color=fff`;

  return (
    <div className="flex h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden relative">
      
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                <FiLogOut className="text-3xl text-red-500 ml-1" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-slate-400 text-sm mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium border border-slate-600">Cancel</button>
                <button onClick={confirmLogout} className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg">Yes, Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-white/5 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden'}`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mr-3">
            <FiActivity className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">LifeMon</h1>
          {isMobile && <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white"><FiX size={24} /></button>}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Main Menu</div>
          
          <NavItem to="/dashboard" icon={FiHome} label="Overview" />
          <NavItem to="/dashboard/activity-history" icon={FiActivity} label="Activity History" />
          <NavItem to="/dashboard/laporan" icon={FiBarChart2} label="Health Reports" />
          <NavItem to="/dashboard/share" icon={FiShare2} label="Share Activity" />
          
          {/* 🔥 MENU CHAT (UNTUK SEMUA USER) 🔥 */}
          <NavItem to="/dashboard/chat" icon={FiMessageSquare} label="AI Assistant" />
          <NavItem to="/dashboard/journal" icon={FiFileText} label="Announcements" />
          
          <div className="mt-8 px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Settings</div>
          <NavItem to="/dashboard/profile" icon={FiUser} label="My Profile" />

          {/* 🔥 MENU KHUSUS ADMIN 🔥 */}
          {currentUser.role === 'admin' && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
              <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Admin Zone</p>
              <NavItem to="/dashboard/admin" icon={FiShield} label="User Management" />
              
              {/* MENU JOURNAL KHUSUS ADMIN */}
              <NavItem to="/dashboard/admin/journal" icon={FiFileText} label="Post Journal" />
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogoutClick} className="flex items-center w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 group">
            <FiLogOut className="mr-3 text-xl group-hover:rotate-180 transition-transform duration-300" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 relative">
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all focus:outline-none">
              <FiMenu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-white hidden sm:block">{getPageTitle()}</h2>
          </div>

          <Link to="/dashboard/profile" className="flex items-center gap-3 pl-4 py-1.5 pr-2 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{currentUser.nama || 'User'}</p>
              <p className="text-xs text-slate-500 group-hover:text-slate-400">
                {currentUser.role === 'admin' ? 'Administrator' : 'View Profile'}
              </p>
            </div>
            <div className="relative">
              <img 
                src={avatarSrc} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-blue-500 transition-colors"
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=User&background=0ea5e9&color=fff`}
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
          </Link>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 bg-slate-900">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;