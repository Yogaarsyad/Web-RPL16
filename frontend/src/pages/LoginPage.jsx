import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiActivity } from 'react-icons/fi';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login({ email: formData.email, password: formData.password });
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message?.includes('Invalid email or password')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message?.includes('network')) {
        setError('Network connection problem. Please try again.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full font-sans bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      
      {/* Left Side - Hero Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 lg:py-24">
        <div className="max-w-lg w-full space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg">
              <FiActivity className="text-2xl text-white" />
            </div>
            <span className="text-2xl font-bold text-white">HealthTracker</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Welcome Back!
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Continue your health journey and track your progress with personalized insights.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <FiActivity className="text-green-400 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Track Your Progress</h3>
                <p className="text-blue-200 text-sm">Monitor your health metrics and achievements</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <FiActivity className="text-blue-400 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Personalized Insights</h3>
                <p className="text-blue-200 text-sm">Get recommendations based on your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-gray-400">Welcome back to your health journey</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-6 text-red-200 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-red-800 p-1 rounded-full">
                    <FiActivity className="text-red-300 text-sm" />
                  </div>
                  <span className="font-medium">Login Error</span>
                </div>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FiMail className="text-lg" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:bg-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FiLock className="text-lg" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:bg-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-400 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-cyan-600/25 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-6">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;