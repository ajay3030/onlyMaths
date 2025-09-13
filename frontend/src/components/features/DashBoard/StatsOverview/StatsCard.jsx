// src/components/features/Dashboard/StatsOverview/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon, color = 'purple' }) => {
  const colorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    pink: 'text-pink-600'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>
            {value}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
