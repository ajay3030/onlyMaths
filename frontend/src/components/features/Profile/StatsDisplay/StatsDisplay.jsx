// src/components/features/Profile/StatsDisplay/StatsDisplay.jsx
import React from 'react';
import { useProfile } from '../../../../context/ProfileContext';
import StatCard from './StatCard';

const StatsDisplay = ({ stats }) => {
  const { preferences } = useProfile();
  
  // Check if user wants to show stats (privacy setting)
  const showStats = preferences?.privacy?.showStats !== false;

  const calculateDaysActive = (joinDate) => {
    if (!joinDate) return 0;
    const days = Math.floor((Date.now() - new Date(joinDate)) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const statsData = [
    {
      title: 'Total Games',
      value: stats?.totalGamesPlayed || 0,
      color: 'purple'
    },
    {
      title: 'Average Score',
      value: stats?.averageScore || 0,
      color: 'blue'
    },
    {
      title: 'Best Score',
      value: stats?.bestScore || 0,
      color: 'green'
    },
    {
      title: 'Best Streak',
      value: stats?.bestStreak || 0,
      color: 'yellow'
    },
    {
      title: 'Experience Points',
      value: stats?.experience || 0,
      color: 'pink'
    },
    {
      title: 'Days Active',
      value: calculateDaysActive(stats?.joinDate),
      color: 'indigo'
    }
  ];

  if (!showStats) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics 📊</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-gray-500">Statistics are hidden by privacy settings</p>
          <p className="text-sm text-gray-400">Enable in Account Settings to view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics 📊</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatsDisplay;
