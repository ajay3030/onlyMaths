// src/components/features/Dashboard/Achievements/AchievementCard.jsx
import React from 'react';

const AchievementCard = ({ achievement }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
        achievement.earned 
          ? 'border-green-200 bg-green-50 shadow-sm' 
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`text-2xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
            {achievement.name}
          </p>
          <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
            {achievement.description}
          </p>
          {achievement.earned && achievement.earnedDate && (
            <p className="text-xs text-green-600 mt-1">
              Earned {formatDate(achievement.earnedDate)}
            </p>
          )}
        </div>
        {achievement.earned && (
          <div className="text-green-500 text-xl">✅</div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
