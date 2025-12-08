import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminListUsers, adminUpdateRole } from '../services/api';
import { FiUser, FiShield, FiEye, FiRefreshCw, FiActivity } from 'react-icons/fi';

function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const me = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const isAdmin = me?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return; // Prevent fetch if not admin
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await adminListUsers();
        if (mounted) setUsers(data || []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to fetch users');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isAdmin]);

  const handleToggleRole = async (u) => {
    if (!isAdmin) return;
    // Mencegah admin mengubah role dirinya sendiri agar tidak terkunci
    if (u.id === me.id) {
        alert("You cannot change your own role.");
        return;
    }
    
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change ${u.nama}'s role to ${nextRole}?`)) return;

    try {
      await adminUpdateRole(u.id, nextRole);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: nextRole } : x));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update role');
    }
  };

  const handleView = (u) => {
    navigate(`/dashboard/admin/users/${u.id}`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        <div className="text-center">
            <FiShield className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
           <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30">
              <FiShield className="text-red-500 text-2xl" />
           </div>
           <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-slate-400 text-sm">Manage user roles and view their activities.</p>
           </div>
        </div>

        {/* CONTENT */}
        {loading && (
            <div className="flex items-center justify-center h-64 text-slate-500">
                <FiRefreshCw className="animate-spin mr-2" /> Loading users...
            </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-2xl mb-6">
             {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg">
                                {u.nama ? u.nama.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-white">{u.nama}</p>
                                <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            u.role === 'admin' 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleView(u)}
                          className="inline-flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="mr-1.5" /> Details
                        </button>
                        
                        {/* Tombol Promote/Demote (Disable untuk diri sendiri) */}
                        {u.id !== me.id && (
                            <button
                            onClick={() => handleToggleRole(u)}
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                u.role === 'admin'
                                ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}
                            >
                            <FiShield className="mr-1.5" />
                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
                <div className="p-10 text-center text-slate-500">No users found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;