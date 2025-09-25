// src/context/ProfileContext/ProfileProvider.jsx - BACKEND INTEGRATED VERSION
import React, { useReducer, useCallback, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useGame } from '../GameContext'; // Add this to access backend stats
import { ProfileContext } from './ProfileContext';

// Enhanced profile reducer
const profileReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_PROFILE_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOAD_PROFILE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
        preferences: action.payload.preferences,
        profileSettings: action.payload.profileSettings,
        stats: action.payload.stats, // 🆕 NEW: Add stats
        gameHistory: action.payload.gameHistory // 🆕 NEW: Add game history
      };
    
    case 'LOAD_PROFILE_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case 'UPDATE_PROFILE_SETTINGS':
      return {
        ...state,
        profileSettings: { ...state.profileSettings, ...action.payload }
      };
    
    case 'UPDATE_AVATAR':
      return {
        ...state,
        profileSettings: { 
          ...state.profileSettings, 
          avatar: action.payload 
        }
      };
    
    case 'UPDATE_DISPLAY_NAME':
      return {
        ...state,
        profileSettings: { 
          ...state.profileSettings, 
          displayName: action.payload 
        }
      };
    
    case 'RESET_PROFILE':
      return initialState;
    
    default:
      return state;
  }
};

// Enhanced initial state
const initialState = {
  preferences: null,
  profileSettings: null,
  stats: null, // 🆕 NEW: Add stats
  gameHistory: [], // 🆕 NEW: Add game history
  isLoading: false,
  error: null // 🆕 NEW: Add error handling
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { user, updateProfile } = useAuth();
  const { getUserStats, getUserGameHistory } = useGame(); // 🆕 NEW: Backend access

  // 🔥 UPDATED: Load profile data from backend
  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    dispatch({ type: 'LOAD_PROFILE_START' });
    
    try {
      console.log('👤 ProfileContext: Loading profile data...');

      // Fetch real backend data in parallel
      const [backendStats, gameHistoryData] = await Promise.all([
        getUserStats(),
        getUserGameHistory({ limit: 50 })
      ]);

      console.log('✅ ProfileContext: Backend data received');

      // Format game history
      const formattedGameHistory = gameHistoryData?.results?.map(game => ({
        id: game._id,
        gameType: game.gameType,
        gameName: game.gameName,
        score: game.totalScore,
        accuracy: game.accuracy,
        date: game.completedAt,
        duration: Math.round(game.totalTime / 1000),
        difficulty: game.difficulty
      })) || [];

      // Enhanced stats with calculations
      const enhancedStats = backendStats?.overall ? {
        // Basic stats
        totalGamesPlayed: backendStats.overall.totalGames || 0,
        averageScore: Math.round(backendStats.overall.averageScore || 0),
        bestScore: backendStats.overall.bestScore || 0,
        averageAccuracy: Math.round(backendStats.overall.averageAccuracy || 0),
        
        // Calculated stats
        totalCorrectAnswers: formattedGameHistory.reduce((sum, game) => sum + (game.correctAnswers || 0), 0),
        totalQuestionsAnswered: formattedGameHistory.reduce((sum, game) => sum + (game.questionsAnswered || 0), 0),
        averageGameDuration: Math.round(formattedGameHistory.reduce((sum, game) => sum + game.duration, 0) / (formattedGameHistory.length || 1)),
        
        // Time-based stats
        thisWeekGames: countGamesInPeriod(formattedGameHistory, 7),
        thisMonthGames: countGamesInPeriod(formattedGameHistory, 30),
        
        // Streaks and trends
        bestStreak: calculateBestStreak(formattedGameHistory),
        improvementTrend: calculateImprovementTrend(formattedGameHistory),
        favoriteGameType: calculateFavoriteGameType(formattedGameHistory),
        
        // Join date for days active calculation
        joinDate: user.createdAt
      } : {
        totalGamesPlayed: 0,
        averageScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        totalCorrectAnswers: 0,
        totalQuestionsAnswered: 0,
        averageGameDuration: 0,
        thisWeekGames: 0,
        thisMonthGames: 0,
        bestStreak: 0,
        improvementTrend: 'stable',
        favoriteGameType: 'None yet',
        joinDate: user.createdAt
      };

      // Generate preferences from user data
      const preferences = {
        privacy: {
          showStats: true, // Default to showing stats
          showAchievements: true,
          showGameHistory: true
        },
        notifications: {
          enabled: user.notifications !== false,
          achievements: true,
          gameReminders: true
        },
        display: {
          theme: user.theme || 'light',
          language: user.language || 'en'
        }
      };

      // Generate profile settings from user data
      const profileSettings = {
        displayName: user.name,
        avatar: user.avatar || '🧒',
        bio: user.bio || '',
        email: user.email
      };

      dispatch({ 
        type: 'LOAD_PROFILE_SUCCESS', 
        payload: {
          preferences,
          profileSettings,
          stats: enhancedStats,
          gameHistory: formattedGameHistory
        }
      });

      console.log('🎉 ProfileContext: Profile loaded successfully');

    } catch (error) {
      console.error('❌ ProfileContext: Failed to load profile:', error);
      dispatch({ type: 'LOAD_PROFILE_ERROR', payload: error.message });
    }
  }, [user, getUserStats, getUserGameHistory]);

  // Helper functions for stats calculations
  const countGamesInPeriod = (games, days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return games.filter(game => new Date(game.date) >= cutoff).length;
  };

  const calculateBestStreak = (games) => {
    if (!games.length) return 0;
    
    let bestStreak = 0;
    let currentStreak = 0;
    
    // Go through games chronologically (reverse order)
    const chronologicalGames = [...games].reverse();
    
    for (const game of chronologicalGames) {
      if (game.accuracy >= 70) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return bestStreak;
  };

  const calculateImprovementTrend = (games) => {
    if (games.length < 5) return 'insufficient_data';
    
    const recent = games.slice(0, 5);
    const older = games.slice(-5);
    
    const recentAvg = recent.reduce((sum, g) => sum + g.accuracy, 0) / recent.length;
    const olderAvg = older.reduce((sum, g) => sum + g.accuracy, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  };

  const calculateFavoriteGameType = (games) => {
    if (!games.length) return 'None yet';
    
    const typeCounts = games.reduce((counts, game) => {
      counts[game.gameType] = (counts[game.gameType] || 0) + 1;
      return counts;
    }, {});
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None yet';
  };

  // 🔥 UPDATED: Update preferences with backend
  const updatePreferences = useCallback(async (newPreferences) => {
    try {
      console.log('🔄 ProfileContext: Updating preferences...', newPreferences);
      
      dispatch({ type: 'UPDATE_PREFERENCES', payload: newPreferences });
      
      // Update user preferences via auth context if needed
      if (newPreferences.display?.theme) {
        await updateProfile({ theme: newPreferences.display.theme });
      }
      
      console.log('✅ ProfileContext: Preferences updated');
    } catch (error) {
      console.error('❌ ProfileContext: Failed to update preferences:', error);
    }
  }, [updateProfile]);

  // 🔥 UPDATED: Update profile settings with backend
  const updateProfileSettings = useCallback(async (newSettings) => {
    try {
      console.log('🔄 ProfileContext: Updating profile settings...', newSettings);
      
      dispatch({ type: 'UPDATE_PROFILE_SETTINGS', payload: newSettings });
      
      // Update via auth context (which calls backend)
      const updateData = {};
      if (newSettings.displayName) updateData.name = newSettings.displayName;
      if (newSettings.avatar) updateData.avatar = newSettings.avatar;
      if (newSettings.bio) updateData.bio = newSettings.bio;
      if (newSettings.email) updateData.email = newSettings.email;
      
      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
      }
      
      console.log('✅ ProfileContext: Profile settings updated');
    } catch (error) {
      console.error('❌ ProfileContext: Failed to update profile settings:', error);
    }
  }, [updateProfile]);

  // 🔥 UPDATED: Update avatar with backend
  const updateAvatar = useCallback(async (newAvatar) => {
    try {
      console.log('🔄 ProfileContext: Updating avatar...', newAvatar);
      
      dispatch({ type: 'UPDATE_AVATAR', payload: newAvatar });
      await updateProfile({ avatar: newAvatar });
      
      console.log('✅ ProfileContext: Avatar updated');
    } catch (error) {
      console.error('❌ ProfileContext: Failed to update avatar:', error);
    }
  }, [updateProfile]);

  // 🔥 UPDATED: Update display name with backend
  const updateDisplayName = useCallback(async (newName) => {
    try {
      console.log('🔄 ProfileContext: Updating display name...', newName);
      
      dispatch({ type: 'UPDATE_DISPLAY_NAME', payload: newName });
      await updateProfile({ name: newName });
      
      console.log('✅ ProfileContext: Display name updated');
    } catch (error) {
      console.error('❌ ProfileContext: Failed to update display name:', error);
    }
  }, [updateProfile]);

  // Reset profile
  const resetProfile = useCallback(() => {
    dispatch({ type: 'RESET_PROFILE' });
  }, []);

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      resetProfile();
    }
  }, [user, loadProfile, resetProfile]);

  const contextValue = {
    ...state,
    loadProfile,
    updatePreferences,
    updateProfileSettings,
    updateAvatar,
    updateDisplayName,
    resetProfile
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
