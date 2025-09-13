// src/context/UserStatsContext/UserStatsProvider.jsx
import  {
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { useAuth } from "../AuthContext";
import { mockDataService } from "../../service/mockDataService";

import {UserStatsContext} from '../UserStatsContext'

// Stats reducer
const statsReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_STATS_START":
      return { ...state, isLoading: true };

    case "LOAD_STATS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        stats: action.payload.stats,
        gameHistory: action.payload.gameHistory,
        achievements: action.payload.achievements,
      };

    case "ADD_GAME_RESULT":{
      const newGame = action.payload;
      const updatedHistory = [newGame, ...state.gameHistory].slice(0, 10); // Keep last 10 games

      return {
        ...state,
        gameHistory: updatedHistory,
        stats: {
          ...state.stats,
          totalGamesPlayed: state.stats.totalGamesPlayed + 1,
          totalScore: state.stats.totalScore + newGame.score,
          averageScore: Math.round(
            (state.stats.totalScore + newGame.score) /
              (state.stats.totalGamesPlayed + 1)
          ),
          bestScore: Math.max(state.stats.bestScore || 0, newGame.score),
          currentStreak: newGame.score > 0 ? state.stats.currentStreak + 1 : 0,
          bestStreak: Math.max(
            state.stats.bestStreak || 0,
            newGame.score > 0 ? state.stats.currentStreak + 1 : 0
          ),
        },
      }
      };

    case "RESET_STATS":
      return {
        stats: null,
        gameHistory: [],
        achievements: [],
        isLoading: false,
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  stats: null,
  gameHistory: [],
  achievements: [],
  isLoading: false,
};

export const UserStatsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(statsReducer, initialState);
  const { user } = useAuth();

  // Load user stats
  const loadUserStats = useCallback(async () => {
    if (!user?.id) return;

    dispatch({ type: "LOAD_STATS_START" });

    try {
      const data = await mockDataService.getUserStats(user.id);
      dispatch({ type: "LOAD_STATS_SUCCESS", payload: data });
    } catch (error) {
      console.error("Failed to load user stats:", error);
      dispatch({
        type: "LOAD_STATS_SUCCESS",
        payload: { stats: null, gameHistory: [], achievements: [] },
      });
    }
  }, [user?.id]);

  // Add game result
  const addGameResult = useCallback(
    (gameResult) => {
      dispatch({ type: "ADD_GAME_RESULT", payload: gameResult });

      // Persist to localStorage
      if (user?.id) {
        mockDataService.saveGameResult(user.id, gameResult);
      }
    },
    [user?.id]
  );

  // Update stats
  const updateStats = useCallback((newStats) => {
    dispatch({ type: "UPDATE_STATS", payload: newStats });
  }, []);

  // Reset stats
  const resetStats = useCallback(() => {
    dispatch({ type: "RESET_STATS" });
  }, []);

  // Load stats when user changes
  useEffect(() => {
    if (user) {
      loadUserStats();
    } else {
      resetStats();
    }
  }, [user, loadUserStats, resetStats]);

  const contextValue = {
    ...state,
    loadUserStats,
    updateStats,
    addGameResult,
    resetStats,
  };

  return (
    <UserStatsContext.Provider value={contextValue}>
      {children}
    </UserStatsContext.Provider>
  );
};



export default UserStatsProvider;





