import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiCheck, 
  FiActivity
} from 'react-icons/fi';

function RegisterPage() {
  const [formData, setFormData] = useState({ 
    nama: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Fair';
    return 'Strong';
  };

  const validateForm = () => {
    const { nama, email, password, confirmPassword } = formData;

    if (!nama.trim()) {
      setError('Full name is required');
      return false;
    }

    if (!email) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      const result = await register(registrationData);
      
      if (result.success) {
        setRegistrationSuccess(true);
        // TIDAK navigate ke dashboard, tetap di halaman success
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message?.includes('Email already registered')) {
        setError('This email is already registered. Please use a different email or login.');
      } else if (err.message?.includes('network')) {
        setError('Network connection problem. Please try again.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-2xl text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
          
          <p className="text-gray-300 mb-2">
            Your account has been created successfully.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Please login to your account to start tracking your health journey.
          </p>

          <button
            onClick={handleGoToLogin}
            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
              Start Your Health Journey
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of students who have transformed their lives through data-driven health tracking.
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <FiCheck className="text-green-400 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Easy Tracking</h3>
                <p className="text-blue-200 text-sm">Monitor your daily health activities easily</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <FiActivity className="text-blue-400 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Personalized Insights</h3>
                <p className="text-blue-200 text-sm">Get recommendations based on your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Fill in your personal details to get started</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-6 text-red-200 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-red-800 p-1 rounded-full">
                    <FiCheck className="text-red-300 text-sm" />
                  </div>
                  <span className="font-medium">Error</span>
                </div>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FiUser className="text-lg" />
                  </div>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Enter your full name"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:bg-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FiMail className="text-lg" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:bg-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FiLock className="text-lg" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:bg-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-400"
                  />
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Password strength</span>
                      <span className={`font-medium ${
                        passwordStrength < 50 ? 'text-red-400' : 
                        passwordStrength < 75 ? 'text-yellow-400' : 
                        'text-green-400'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FiLock className="text-lg" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:bg-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-white placeholder-gray-400"
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
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-6">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;