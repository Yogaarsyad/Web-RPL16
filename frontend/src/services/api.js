// frontend/src/services/api.js
import axios from 'axios';

// Get API base URL dari env atau default ke localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({ baseURL: API_BASE_URL });

console.log('🔗 API Base URL:', API_BASE_URL);

// Menyisipkan token otentikasi ke setiap permintaan API.
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- User & Profile ---
export const register = (formData) => API.post('/users/register', formData);
export const login = (formData) => API.post('/users/login', formData);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (profileData) => API.put('/users/profile', profileData);
// HAPUS HEADER MANUAL DI SINI, BIARKAN AXIOS YANG MENGATUR MULTIPART/FORM-DATA
export const uploadAvatar = (formData) => API.post('/users/avatar', formData);

// --- Admin ---
export const adminListUsers = () => API.get('/admin/users');
export const adminGetUserDetail = (id) => API.get(`/admin/users/${id}`);
export const adminGetUserLogs = (id, type) => API.get(`/admin/users/${id}/logs`, { params: { type } });
export const adminUpdateRole = (id, role) => API.patch(`/admin/users/${id}/role`, { role });

// --- Food Log ---
export const addFoodLog = (logData) => API.post('/food-logs', logData);
export const getFoodLogs = () => API.get('/food-logs');
export const deleteFoodLog = (logId) => API.delete(`/food-logs/${logId}`);
export const checkCalories = (name) => API.post('/food-logs/calories', { name });

// --- Exercise Log ---
export const getExerciseLogs = () => API.get('/exercise-logs');
export const addExerciseLog = (logData) => API.post('/exercise-logs', logData);
export const deleteExerciseLog = (logId) => API.delete(`/exercise-logs/${logId}`);

// --- Sleep Log ---
export const addSleepLog = (logData) => API.post('/sleep-logs', logData);
export const getSleepLogs = () => API.get('/sleep-logs');
export const deleteSleepLog = (logId) => API.delete(`/sleep-logs/${logId}`);

// --- Report & Recommendation ---
export const getReportData = () => API.get('/laporan/data'); 
export const getStatistics = () => API.get('/laporan/statistics');
export const getRecommendations = () => API.get('/recommendations');
export const getExerciseTrend = () => API.get('/laporan/exercise-trend');

// --- Chat ---
export const postChat = (payload) => API.post('/chat', payload);

// --- JOURNAL (PENGUMUMAN) ---
export const getJournals = () => API.get('/journals');
export const createJournal = (data) => API.post('/journals', data);
export const deleteJournal = (id) => API.delete(`/journals/${id}`);

// --- MESSAGING (PESAN) ---
export const sendMessage = (data) => API.post('/messages', data);
export const getMyMessages = () => API.get('/messages');