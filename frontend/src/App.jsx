import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogProvider } from './context/LogContext';
import { FiLoader } from 'react-icons/fi';

// 1. IMPORT REACT QUERY
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. SETUP CACHE
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// --- LAZY LOADING IMPORTS ---
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LaporanPage = lazy(() => import('./pages/ReportPage'));
const ActivityHistoryPage = lazy(() => import('./pages/ActivityHistoryPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const SocialSharePage = lazy(() => import('./pages/SocialSharePage'));

// Admin Pages
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminUserDetailPage = lazy(() => import('./pages/AdminUserDetailPage'));
const AdminJournalPage = lazy(() => import('./pages/AdminJournalPage')); // <--- PASTIKAN INI ADA

// Journal Page (Public)
const JournalPage = lazy(() => import('./pages/JournalPage'));

// Loading Screen
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 transition-all duration-300">
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
      <FiLoader className="relative z-10 text-5xl text-blue-500 animate-spin mb-4" />
    </div>
    <p className="text-slate-400 font-medium tracking-wide animate-pulse">Memuat Halaman...</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const DashboardLayoutWithLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return <DashboardLayout onLogout={handleLogout} />;
};

function AppContent() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayoutWithLogout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="laporan" element={<LaporanPage />} />
            <Route path="activity-history" element={<ActivityHistoryPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="share" element={<SocialSharePage />} />
            <Route path="journal" element={<JournalPage />} />
            
            {/* --- ADMIN ROUTES --- */}
            <Route path="admin" element={<AdminUsersPage />} />
            <Route path="admin/users/:id" element={<AdminUserDetailPage />} />
            
            {/* 🔥 PASTIKAN BARIS INI ADA: */}
            <Route path="admin/journal" element={<AdminJournalPage />} /> 
            
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LogProvider>
          <AppContent />
        </LogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;