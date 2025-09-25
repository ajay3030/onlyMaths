// src/components/features/Dashboard/Achievements/AchievementsList.jsx
import React from 'react';
import AchievementCard from './AchievementCard';

const AchievementsList = ({ achievements }) => {
  const earnedCount = achievements?.filter(a => a.earned || a.unlocked).length || 0;
  const totalCount = achievements?.length || 0;
  const unlockedAchievements = achievements?.filter(a => a.earned || a.unlocked) || [];
  const lockedAchievements = achievements?.filter(a => !(a.earned || a.unlocked)) || [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievements 🏅</h2>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {earnedCount}/{totalCount}
          </span>
        </div>
        {earnedCount > 0 && (
          <p className="text-sm text-green-600 mt-1">
            🎉 Great job! You've earned {earnedCount} achievement{earnedCount !== 1 ? 's' : ''}!
          </p>
        )}
      </div>
      
      {/* 🔥 UPDATED: Remove horizontal scrollbar and ensure proper width containment */}
      <div className="space-y-4 max-h-96 overflow-y-auto overflow-x-hidden w-full">
        {totalCount > 0 ? (
          <>
            {unlockedAchievements.length > 0 && (
              <>
                {unlockedAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
                {lockedAchievements.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-3 font-medium">Keep going to unlock more! 🚀</p>
                  </div>
                )}
              </>
            )}
            
            {lockedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-500">Complete games to earn achievements!</p>
            <p className="text-sm text-gray-400 mt-1">Play your first game to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsList;
