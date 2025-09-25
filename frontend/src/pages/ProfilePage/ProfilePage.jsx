// src/pages/ProfilePage/ProfilePage.jsx - FOLLOWING DASHBOARD PATTERN
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Navigate } from 'react-router-dom';
import UserInfo from '../../components/features/Profile/UserInfo';
import StatsDisplay from '../../components/features/Profile/StatsDisplay';
import AccountSettings from '../../components/features/Profile/AccountSettings';

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { getUserStats, getUserGameHistory } = useGame();

  // Backend data state (same pattern as DashboardPage)
  const [profileData, setProfileData] = useState({
    userInfo: null,
    stats: null,
    gameHistory: [],
    preferences: {
      privacy: { showStats: true },
      notifications: true,
      theme: 'light'
    },
    isLoading: true,
    error: null
  });

  // Calculate best streak from all games (same as dashboard)
  const calculateBestStreak = (games) => {
    if (!games || games.length === 0) return 0;
    
    let bestStreak = 0;
    let currentCount = 0;
    
    // Go through games in chronological order (oldest first)
    const sortedGames = [...games].reverse();
    
    for (const game of sortedGames) {
      const isWin = game.accuracy >= 70;
      
      if (isWin) {
        currentCount++;
        bestStreak = Math.max(bestStreak, currentCount);
      } else {
        currentCount = 0;
      }
    }
    
    console.log('⭐ Profile: Best streak calculated:', bestStreak, 'games');
    return bestStreak;
  };

  // Calculate current streak (same as dashboard)
  const calculateCurrentStreak = (games) => {
    if (!games || games.length === 0) return 0;
    
    let streak = 0;
    
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const isWin = game.accuracy >= 70;
      
      if (isWin) {
        streak++;
      } else {
        break;
      }
    }
    
    console.log('🔥 Profile: Current streak calculated:', streak, 'games');
    return streak;
  };

  // Calculate experience points
  const calculateExperience = (stats, games) => {
    if (!stats) return 0;
    
    const scorePoints = (stats.averageScore || 0) * (stats.totalGames || 0) * 0.1;
    const gamePoints = (stats.totalGames || 0) * 10;
    const accuracyBonus = stats.averageAccuracy > 80 ? (stats.totalGames || 0) * 5 : 0;
    const streakBonus = calculateBestStreak(games) * 25;
    
    return Math.round(scorePoints + gamePoints + accuracyBonus + streakBonus);
  };

  // Count games in time period
  const countGamesInPeriod = (games, days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return games.filter(game => new Date(game.date) >= cutoff).length;
  };

  // Calculate favorite game type
  const calculateFavoriteGameType = (games) => {
    if (!games.length) return 'None yet';
    
    const typeCounts = games.reduce((counts, game) => {
      counts[game.gameType] = (counts[game.gameType] || 0) + 1;
      return counts;
    }, {});
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None yet';
  };

  // Calculate improvement trend
  const calculateImprovementTrend = (games) => {
    if (games.length < 5) return 'stable';
    
    const recent = games.slice(0, 5);
    const older = games.slice(-5);
    
    const recentAvg = recent.reduce((sum, g) => sum + g.accuracy, 0) / recent.length;
    const olderAvg = older.reduce((sum, g) => sum + g.accuracy, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  };

  // Fetch backend data (same pattern as DashboardPage)
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        console.log('👤 Fetching profile data from backend...');
        setProfileData(prev => ({ ...prev, isLoading: true, error: null }));

        // Fetch data in parallel (same as dashboard)
        const [backendStats, gameHistoryData] = await Promise.all([
          getUserStats(),
          getUserGameHistory({ limit: 50 }) // Get more history for profile
        ]);

        console.log('✅ Profile stats received:', backendStats?.overall);
        console.log('✅ Profile game history received:', gameHistoryData?.results?.length, 'games');

        // Format game history for components (same as dashboard)
        const formattedGameHistory = gameHistoryData?.results?.map(game => ({
          id: game._id,
          gameType: game.gameType,
          gameName: game.gameName,
          score: game.totalScore,
          accuracy: game.accuracy,
          date: game.completedAt,
          duration: Math.round(game.totalTime / 1000),
          difficulty: game.difficulty,
          questionsAnswered: game.totalQuestions,
          correctAnswers: game.correctAnswers
        })) || [];

        // Calculate streaks (same as dashboard)
        const currentStreak = calculateCurrentStreak(formattedGameHistory);
        const bestStreak = calculateBestStreak(formattedGameHistory);

        // Enhanced user info with calculated data
        const enhancedUserInfo = {
          ...user,
          joinDate: user.createdAt || user.joinDate,
          totalGamesPlayed: backendStats?.overall?.totalGames || 0,
          favoriteGameType: calculateFavoriteGameType(formattedGameHistory),
          playingStreak: currentStreak,
          lastActive: formattedGameHistory[0]?.date || new Date().toISOString()
        };

        // Format stats for components (enhanced version of dashboard pattern)
        const enhancedStats = backendStats?.overall ? {
          // Basic stats (same as dashboard)
          totalGamesPlayed: backendStats.overall.totalGames || 0,
          averageScore: Math.round(backendStats.overall.averageScore || 0),
          bestScore: backendStats.overall.bestScore || 0,
          averageAccuracy: Math.round(backendStats.overall.averageAccuracy || 0),
          
          // Streak calculations (same as dashboard)
          currentStreak: currentStreak,
          bestStreak: bestStreak,
          
          // Profile-specific calculations
          experience: calculateExperience(backendStats.overall, formattedGameHistory),
          joinDate: user.createdAt,
          
          // Time-based stats
          thisWeekGames: countGamesInPeriod(formattedGameHistory, 7),
          thisMonthGames: countGamesInPeriod(formattedGameHistory, 30),
          
          // Detailed stats for profile
          totalCorrectAnswers: formattedGameHistory.reduce((sum, game) => sum + (game.correctAnswers || 0), 0),
          totalQuestionsAnswered: formattedGameHistory.reduce((sum, game) => sum + (game.questionsAnswered || 0), 0),
          averageGameDuration: formattedGameHistory.length > 0 ? 
            Math.round(formattedGameHistory.reduce((sum, game) => sum + game.duration, 0) / formattedGameHistory.length) : 0,
          
          // Trends and preferences
          favoriteGameType: calculateFavoriteGameType(formattedGameHistory),
          improvementTrend: calculateImprovementTrend(formattedGameHistory),
          recentPerformance: formattedGameHistory.slice(0, 10)
        } : {
          totalGamesPlayed: 0,
          averageScore: 0,
          bestScore: 0,
          averageAccuracy: 0,
          currentStreak: 0,
          bestStreak: 0,
          experience: 0,
          joinDate: user.createdAt,
          thisWeekGames: 0,
          thisMonthGames: 0,
          totalCorrectAnswers: 0,
          totalQuestionsAnswered: 0,
          averageGameDuration: 0,
          favoriteGameType: 'None yet',
          improvementTrend: 'stable',
          recentPerformance: []
        };

        setProfileData({
          userInfo: enhancedUserInfo,
          stats: enhancedStats,
          gameHistory: formattedGameHistory,
          preferences: {
            privacy: { showStats: true },
            notifications: user.notifications !== false,
            theme: user.theme || 'light'
          },
          isLoading: false,
          error: null
        });

        console.log('🎉 Profile data loaded successfully');
        console.log('📈 Final profile stats:', enhancedStats);

      } catch (error) {
        console.error('❌ Failed to fetch profile data:', error);
        setProfileData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchProfileData();
  }, [user, getUserStats, getUserGameHistory]);

  // Update profile function (same pattern as dashboard refresh)
  const handleUpdateProfile = async (updateData) => {
    try {
      console.log('🔄 Updating profile...', updateData);
      
      const result = await updateProfile(updateData);
      
      if (result.success) {
        // Update local state with new user data
        setProfileData(prev => ({
          ...prev,
          userInfo: { ...prev.userInfo, ...result.user }
        }));
        
        console.log('✅ Profile updated successfully');
        return { success: true };
      } else {
        console.error('❌ Profile update failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Refresh profile data (same as dashboard)
  const refreshProfile = async () => {
    console.log('🔄 Refreshing profile data...');
    // Re-run the fetch logic
    if (!user) return;
    
    try {
      const [backendStats, gameHistoryData] = await Promise.all([
        getUserStats(),
        getUserGameHistory({ limit: 50 })
      ]);

      const formattedGameHistory = gameHistoryData?.results?.map(game => ({
        id: game._id,
        gameType: game.gameType,
        gameName: game.gameName,
        score: game.totalScore,
        accuracy: game.accuracy,
        date: game.completedAt,
        duration: Math.round(game.totalTime / 1000),
        difficulty: game.difficulty,
        questionsAnswered: game.totalQuestions,
        correctAnswers: game.correctAnswers
      })) || [];

      const currentStreak = calculateCurrentStreak(formattedGameHistory);
      const bestStreak = calculateBestStreak(formattedGameHistory);

      const enhancedStats = {
        totalGamesPlayed: backendStats?.overall?.totalGames || 0,
        averageScore: Math.round(backendStats?.overall?.averageScore || 0),
        bestScore: backendStats?.overall?.bestScore || 0,
        averageAccuracy: Math.round(backendStats?.overall?.averageAccuracy || 0),
        currentStreak: currentStreak,
        bestStreak: bestStreak,
        experience: calculateExperience(backendStats?.overall, formattedGameHistory),
        joinDate: user.createdAt,
        thisWeekGames: countGamesInPeriod(formattedGameHistory, 7),
        thisMonthGames: countGamesInPeriod(formattedGameHistory, 30),
        totalCorrectAnswers: formattedGameHistory.reduce((sum, game) => sum + (game.correctAnswers || 0), 0),
        totalQuestionsAnswered: formattedGameHistory.reduce((sum, game) => sum + (game.questionsAnswered || 0), 0),
        averageGameDuration: formattedGameHistory.length > 0 ? 
          Math.round(formattedGameHistory.reduce((sum, game) => sum + game.duration, 0) / formattedGameHistory.length) : 0,
        favoriteGameType: calculateFavoriteGameType(formattedGameHistory),
        improvementTrend: calculateImprovementTrend(formattedGameHistory)
      };

      setProfileData(prev => ({
        ...prev,
        stats: enhancedStats,
        gameHistory: formattedGameHistory
      }));

      console.log('✅ Profile refreshed with latest data');
    } catch (error) {
      console.error('❌ Failed to refresh profile:', error);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profileData.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profileData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Error</h2>
          <p className="text-gray-600 mb-4">We couldn't load your profile data.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pass data as props (same pattern as dashboard) */}
        <UserInfo 
          user={profileData.userInfo} 
          stats={profileData.stats}
          onUpdateProfile={handleUpdateProfile}
          onRefresh={refreshProfile}
        />
        
        <StatsDisplay 
          stats={profileData.stats}
          gameHistory={profileData.gameHistory}
          preferences={profileData.preferences}
        />
        
        <AccountSettings 
          user={profileData.userInfo}
          preferences={profileData.preferences}
          onLogout={logout}
          onUpdateProfile={handleUpdateProfile}
          onUpdatePreferences={(newPrefs) => 
            setProfileData(prev => ({
              ...prev, 
              preferences: { ...prev.preferences, ...newPrefs }
            }))
          }
        />
        
      </div>
    </div>
  );
};

export default ProfilePage;
