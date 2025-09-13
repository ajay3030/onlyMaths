// src/context/UserStatsContext/UserStatsContext.js
import { createContext } from 'react';

export const UserStatsContext = createContext({
  stats: null,
  gameHistory: [],
  achievements: [],
  isLoading: false,
  loadUserStats: () => {},
  updateStats: () => {},
  addGameResult: () => {},
  resetStats: () => {}
});

export default UserStatsContext;
