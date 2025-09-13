// src/components/features/Profile/StatsDisplay/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, color = 'purple' }) => {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    pink: 'bg-pink-50 text-pink-600 border-pink-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className={`text-center p-6 rounded-xl border-2 hover:scale-105 transition-transform ${colorClasses[color]}`}>
      <div className="text-3xl font-bold mb-2">
        {value}
      </div>
      <div className="font-medium">{title}</div>
    </div>
  );
};

export default StatCard;
