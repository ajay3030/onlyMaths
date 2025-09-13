import { useContext } from 'react';
import UserStatsContext from './UserStatsContext';

export const useUserStats = () => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error("useUserStats must be used within a UserStatsProvider");
  }
  return context;
};