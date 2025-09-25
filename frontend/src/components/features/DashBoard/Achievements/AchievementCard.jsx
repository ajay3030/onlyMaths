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

  const isEarned = achievement.earned || achievement.unlocked;
  const achievementName = achievement.name || achievement.title;
  const earnedDate = achievement.earnedDate || achievement.unlockedAt;

  return (
      <div className={`p-4 rounded-xl border-2 transition-all hover:scale-105 w-full min-w-0 ${ isEarned ? 'border-green-200 bg-green-50 shadow-sm' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
        {/* 🔥 UPDATED: Ensure card doesn't overflow container */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className={`text-2xl flex-shrink-0 ${isEarned ? 'grayscale-0' : 'grayscale'}`}>
          {achievement.icon}
        </div>
        {/* 🔥 UPDATED: Add proper text wrapping and overflow handling */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
            {achievementName}
          </p>
          <p className={`text-sm break-words ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
            {achievement.description}
          </p>
          {isEarned && earnedDate && (
            <p className="text-xs text-green-600 mt-1 truncate">
              Earned {formatDate(earnedDate)}
            </p>
          )}
          {!isEarned && achievement.progress !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${achievement.progress || 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          {isEarned ? (
            <div className="text-green-500 text-xl">✅</div>
          ) : (
            <div className="text-gray-400 text-xl">🔒</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
