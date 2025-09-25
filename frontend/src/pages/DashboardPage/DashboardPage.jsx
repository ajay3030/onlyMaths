// src/pages/DashboardPage/DashboardPage.jsx - COMPLETE WITH STREAK LOGIC
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { Navigate } from 'react-router-dom';
import StatsOverview from '../../components/features/DashBoard/StatsOverview/StatsOverview';
import RecentGames from '../../components/features/DashBoard/RecentGames/RecentGames';
import AchievementsList from '../../components/features/DashBoard/Achievements/AchievementsList';
import QuickActions from '../../components/features/DashBoard/QuickActions/QuickActions';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getUserStats, getUserGameHistory } = useGame();

  // Backend data state
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    gameHistory: [],
    achievements: [],
    isLoading: true,
    error: null
  });

  // Calculate current streak from recent games
  const calculateCurrentStreak = (games) => {
    if (!games || games.length === 0) return 0;
    
    let streak = 0;
    
    // Start from most recent game (index 0) and count backwards
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      
      // Define "winning" criteria - 70%+ accuracy = win
      const isWin = game.accuracy >= 70;
      
      if (isWin) {
        streak++;
      } else {
        // Streak broken by a loss
        break;
      }
    }
    
    console.log('🔥 Current streak calculated:', streak, 'games');
    return streak;
  };

  // Calculate best streak from all games
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
    
    console.log('⭐ Best streak calculated:', bestStreak, 'games');
    return bestStreak;
  };

  // Generate achievements based on real data
  const generateAchievements = (stats, games) => {
    const achievements = [];
    const currentStreak = calculateCurrentStreak(games);
    const bestStreak = calculateBestStreak(games);
    
    // First game achievement
    if (stats?.overall?.totalGames >= 1) {
      achievements.push({
        id: 'first-game',
        title: 'First Steps',
        description: 'Completed your first game!',
        icon: '🎯',
        unlocked: true,
        unlockedAt: games[games.length - 1]?.date
      });
    }

    // Games played achievements
    if (stats?.overall?.totalGames >= 5) {
      achievements.push({
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Played 5 games!',
        icon: '🚀',
        unlocked: true
      });
    }

    if (stats?.overall?.totalGames >= 10) {
      achievements.push({
        id: 'dedicated',
        title: 'Dedicated Player',
        description: 'Played 10 games!',
        icon: '🏅',
        unlocked: true
      });
    }

    if (stats?.overall?.totalGames >= 25) {
      achievements.push({
        id: 'persistent',
        title: 'Persistent Player',
        description: 'Played 25 games!',
        icon: '💪',
        unlocked: true
      });
    }

    // Score achievements
    if (stats?.overall?.bestScore >= 50) {
      achievements.push({
        id: 'scorer',
        title: 'Good Scorer',
        description: 'Scored 50+ points!',
        icon: '⚡',
        unlocked: true
      });
    }

    if (stats?.overall?.bestScore >= 100) {
      achievements.push({
        id: 'high-scorer',
        title: 'High Scorer',
        description: 'Scored 100+ points!',
        icon: '⭐',
        unlocked: true
      });
    }

    if (stats?.overall?.bestScore >= 150) {
      achievements.push({
        id: 'super-scorer',
        title: 'Super Scorer',
        description: 'Scored 150+ points!',
        icon: '🌟',
        unlocked: true
      });
    }

    // Accuracy achievements
    if (stats?.overall?.averageAccuracy >= 60) {
      achievements.push({
        id: 'accurate',
        title: 'Getting Accurate',
        description: 'Maintained 60%+ accuracy!',
        icon: '🎯',
        unlocked: true
      });
    }

    if (stats?.overall?.averageAccuracy >= 80) {
      achievements.push({
        id: 'accuracy-master',
        title: 'Accuracy Master',
        description: 'Maintained 80%+ accuracy!',
        icon: '🏹',
        unlocked: true
      });
    }

    // Streak achievements
    if (currentStreak >= 3) {
      achievements.push({
        id: 'streak-3',
        title: 'On Fire!',
        description: `${currentStreak} games won in a row!`,
        icon: '🔥',
        unlocked: true
      });
    }

    if (currentStreak >= 5) {
      achievements.push({
        id: 'streak-5',
        title: 'Unstoppable!',
        description: `${currentStreak} games won in a row!`,
        icon: '🚀',
        unlocked: true
      });
    }

    if (bestStreak >= 10) {
      achievements.push({
        id: 'streak-master',
        title: 'Streak Master',
        description: `Best streak: ${bestStreak} games!`,
        icon: '👑',
        unlocked: true
      });
    }

    // Locked achievements for motivation
    if (stats?.overall?.totalGames < 50) {
      achievements.push({
        id: 'century-player',
        title: 'Century Player',
        description: 'Play 50 games',
        icon: '💯',
        unlocked: false,
        progress: Math.min(100, (stats?.overall?.totalGames || 0) * 2)
      });
    }

    if (stats?.overall?.averageAccuracy < 90) {
      achievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Reach 90% average accuracy',
        icon: '✨',
        unlocked: false,
        progress: Math.min(100, (stats?.overall?.averageAccuracy || 0) * 1.11)
      });
    }

    return achievements;
  };

  // Fetch backend data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        console.log('📊 Fetching dashboard data from backend...');
        setDashboardData(prev => ({ ...prev, isLoading: true, error: null }));

        // Fetch data in parallel for better performance
        const [backendStats, gameHistoryData] = await Promise.all([
          getUserStats(),
          getUserGameHistory({ limit: 20 }) // Get more games for better streak calculation
        ]);

        console.log('✅ Backend stats received:', backendStats?.overall);
        console.log('✅ Game history received:', gameHistoryData?.results?.length, 'games');

        // Format game history for components
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

        // Calculate streaks
        const currentStreak = calculateCurrentStreak(formattedGameHistory);
        const bestStreak = calculateBestStreak(formattedGameHistory);

        // Format stats for StatsOverview component
        const formattedStats = backendStats?.overall ? {
          totalGamesPlayed: backendStats.overall.totalGames || 0,
          averageScore: Math.round(backendStats.overall.averageScore || 0),
          bestScore: backendStats.overall.bestScore || 0,
          currentStreak: currentStreak,
          bestStreak: bestStreak,
          averageAccuracy: Math.round(backendStats.overall.averageAccuracy || 0)
        } : {
          totalGamesPlayed: 0,
          averageScore: 0,
          bestScore: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageAccuracy: 0
        };

        // Generate achievements from real data
        const achievements = generateAchievements(backendStats, formattedGameHistory);

        setDashboardData({
          stats: formattedStats,
          gameHistory: formattedGameHistory.slice(0, 10), // Show only last 10 in recent games
          achievements,
          isLoading: false,
          error: null
        });

        console.log('🎉 Dashboard data loaded successfully');
        console.log('📈 Final stats:', formattedStats);

      } catch (error) {
        console.error('❌ Failed to fetch dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchDashboardData();
  }, [user, getUserStats, getUserGameHistory]);

  // Refresh dashboard data
  const refreshDashboard = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Refreshing dashboard data...');
      
      const [backendStats, gameHistoryData] = await Promise.all([
        getUserStats(),
        getUserGameHistory({ limit: 20 })
      ]);

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

      const currentStreak = calculateCurrentStreak(formattedGameHistory);
      const bestStreak = calculateBestStreak(formattedGameHistory);

      const formattedStats = {
        totalGamesPlayed: backendStats?.overall?.totalGames || 0,
        averageScore: Math.round(backendStats?.overall?.averageScore || 0),
        bestScore: backendStats?.overall?.bestScore || 0,
        currentStreak: currentStreak,
        bestStreak: bestStreak,
        averageAccuracy: Math.round(backendStats?.overall?.averageAccuracy || 0)
      };

      setDashboardData(prev => ({
        ...prev,
        stats: formattedStats,
        gameHistory: formattedGameHistory.slice(0, 10),
        achievements: generateAchievements(backendStats, formattedGameHistory)
      }));

      console.log('✅ Dashboard refreshed with latest data');
    } catch (error) {
      console.error('❌ Failed to refresh dashboard:', error);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (dashboardData.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load your dashboard data.</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Here's your math learning progress
              </p>
              {dashboardData.stats?.currentStreak > 0 && (
                <p className="text-orange-600 font-semibold mt-1">
                  🔥 You're on a {dashboardData.stats.currentStreak} game winning streak!
                </p>
              )}
            </div>
            <button
              onClick={refreshDashboard}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
              title="Refresh dashboard data"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={dashboardData.stats} />
        
        {/* Recent Games and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentGames gameHistory={dashboardData.gameHistory} />
          <AchievementsList achievements={dashboardData.achievements} />
        </div>

        {/* Quick Actions */}
        <QuickActions onActionComplete={refreshDashboard} />
      </div>
    </div>
  );
};

export default DashboardPage;
