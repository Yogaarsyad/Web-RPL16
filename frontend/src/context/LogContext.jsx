import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getFoodLogs, 
  addFoodLog as apiAddFoodLog, 
  deleteFoodLog as apiDeleteFoodLog,
  getExerciseLogs,
  addExerciseLog as apiAddExerciseLog,
  deleteExerciseLog as apiDeleteExerciseLog,
  getSleepLogs,
  addSleepLog as apiAddSleepLog,
  deleteSleepLog as apiDeleteSleepLog
} from '../services/api';

const LogContext = createContext();

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) { 
    throw new Error('useLog must be used within LogProvider');
  }
  return context;
};

export const LogProvider = ({ children }) => {
  const [foodLogs, setFoodLogs] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [sleepLogs, setSleepLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    } else {
      setFoodLogs([]);
      setExerciseLogs([]);
      setSleepLogs([]);
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [foodResponse, exerciseResponse, sleepResponse] = await Promise.all([
        getFoodLogs(),
        getExerciseLogs(),
        getSleepLogs()
      ]);

      setFoodLogs(foodResponse.data || []);
      setExerciseLogs(exerciseResponse.data || []);
      setSleepLogs(sleepResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addFoodLog = async (logData) => {
    if (!isAuthenticated) {
      throw new Error('User must be logged in to add food log');
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiAddFoodLog(logData);
      const newLog = response.data;
      
      setFoodLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add food log';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addExerciseLog = async (logData) => {
    if (!isAuthenticated) {
      throw new Error('User must be logged in to add exercise log');
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiAddExerciseLog(logData);
      const newLog = response.data;
      
      setExerciseLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add exercise log';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addSleepLog = async (logData) => {
    if (!isAuthenticated) {
      throw new Error('User must be logged in to add sleep log');
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiAddSleepLog(logData);
      const newLog = response.data;
      
      setSleepLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add sleep log';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteFoodLog = async (logId) => {
    if (!isAuthenticated) {
      throw new Error('User must be logged in to delete food log');
    }

    setLoading(true);
    setError('');
    
    try {
      await apiDeleteFoodLog(logId);
      setFoodLogs(prev => prev.filter(log => log.id !== logId));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete food log';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteExerciseLog = async (logId) => {
    if (!isAuthenticated) {
      throw new Error('User must be logged in to delete exercise log');
    }

    setLoading(true);
    setError('');
    
    try {
      await apiDeleteExerciseLog(logId);
      setExerciseLogs(prev => prev.filter(log => log.id !== logId));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete exercise log';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteSleepLog = async (logId) => {
    if (!isAuthenticated) {
      throw new Error('User must be logged in to delete sleep log');
    }

    setLoading(true);
    setError('');
    
    try {
      await apiDeleteSleepLog(logId);
      setSleepLogs(prev => prev.filter(log => log.id !== logId));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete sleep log';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAllActivities = () => {
    if (!isAuthenticated) return [];
    
    const allActivities = [
      ...foodLogs.map(log => ({ ...log, type: 'food' })),
      ...exerciseLogs.map(log => ({ ...log, type: 'exercise' })),
      ...sleepLogs.map(log => ({ ...log, type: 'sleep' }))
    ];
    
    return allActivities.sort((a, b) => new Date(b.createdAt || b.tanggal) - new Date(a.createdAt || a.tanggal));
  };

  const getWeeklySummary = () => {
    if (!isAuthenticated) return [];
    
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      foodCalories: foodLogs
        .filter(log => log.tanggal === date)
        .reduce((sum, log) => sum + (log.kalori || 0), 0),
      exerciseCalories: exerciseLogs
        .filter(log => log.tanggal === date)
        .reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0),
      sleepHours: sleepLogs
        .filter(log => log.tanggal === date)
        .reduce((sum, log) => {
          if (!log.waktu_tidur || !log.waktu_bangun) return sum;
          const sleepTime = new Date(log.waktu_tidur);
          const wakeTime = new Date(log.waktu_bangun);
          const hours = (wakeTime - sleepTime) / (1000 * 60 * 60);
          return sum + (hours || 0);
        }, 0)
    }));
  };

  const getActivityStats = () => {
    if (!isAuthenticated) {
      return {
        totalFoodLogs: 0,
        totalExerciseLogs: 0,
        totalSleepLogs: 0,
        totalCaloriesConsumed: 0,
        totalCaloriesBurned: 0,
        netCalories: 0
      };
    }

    return {
      totalFoodLogs: foodLogs.length,
      totalExerciseLogs: exerciseLogs.length,
      totalSleepLogs: sleepLogs.length,
      totalCaloriesConsumed: foodLogs.reduce((sum, log) => sum + (log.kalori || 0), 0),
      totalCaloriesBurned: exerciseLogs.reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0),
      netCalories: foodLogs.reduce((sum, log) => sum + (log.kalori || 0), 0) - 
                  exerciseLogs.reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0)
    };
  };

  const refreshData = () => {
    if (isAuthenticated) {
      loadAllData();
    }
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    foodLogs,
    exerciseLogs,
    sleepLogs,
    loading,
    error,
    addFoodLog,
    addExerciseLog,
    addSleepLog,
    deleteFoodLog,
    deleteExerciseLog,
    deleteSleepLog,
    getAllActivities,
    getWeeklySummary,
    getActivityStats,
    refreshData,
    clearError
  };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
};