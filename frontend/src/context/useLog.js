import { useContext } from 'react';
import LogContext from './LogContextProvider';

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) { 
    throw new Error('useLog must be used within LogProvider');
  }
  return context;
};
