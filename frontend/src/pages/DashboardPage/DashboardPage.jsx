// src/pages/DashboardPage/DashboardPage.jsx - NOW MUCH CLEANER!
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserStats } from '../../context/UserStatsContext';
import { Navigate } from 'react-router-dom';
import StatsOverview from '../../components/features/DashBoard/StatsOverview/StatsOverview';
import RecentGames from '../../components/features/DashBoard/RecentGames/RecentGames';
import AchievementsList from '../../components/features/DashBoard/Achievements/AchievementsList';
import QuickActions from '../../components/features/DashBoard/QuickActions/QuickActions';

const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, gameHistory, achievements, isLoading } = useUserStats();

  // console.log('🔍 Dashboard Debug:');
  // console.log('User:', user);
  // console.log('Stats:', stats);  
  // console.log('Game History:', gameHistory);
  // console.log('Achievements:', achievements);
  // console.log('Is Loading:', isLoading);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your math learning progress
          </p>
        </div>

        {/* Modular Components */}
        <StatsOverview stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentGames gameHistory={gameHistory} />
          <AchievementsList achievements={achievements} />
        </div>

        <QuickActions />
      </div>
    </div>
  );
};

export default DashboardPage;
