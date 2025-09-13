// src/components/features/Dashboard/StatsOverview/StatsOverview.jsx
import React from 'react';
import StatsCard from './StatsCard';

const StatsOverview = ({ stats }) => {
  const statsData = [
    {
      title: 'Games Played',
      value: stats?.totalGamesPlayed || 0,
      icon: '🎮',
      color: 'purple'
    },
    {
      title: 'Average Score',
      value: stats?.averageScore || 0,
      icon: '📊',
      color: 'blue'
    },
    {
      title: 'Best Score',
      value: stats?.bestScore || 0,
      icon: '🏆',
      color: 'green'
    },
    {
      title: 'Current Streak',
      value: stats?.currentStreak || 0,
      icon: '🔥',
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StatsOverview;
