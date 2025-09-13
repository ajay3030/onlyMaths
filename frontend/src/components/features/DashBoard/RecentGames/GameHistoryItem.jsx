// src/components/features/Dashboard/RecentGames/GameHistoryItem.jsx
import React from 'react';

const GameHistoryItem = ({ game }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="text-2xl">🎯</div>
        <div>
          <p className="font-semibold text-gray-900">{game.gameName}</p>
          <p className="text-sm text-gray-500">
            {formatDate(game.date)} • {formatDuration(game.duration)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-purple-600">{game.score} pts</p>
        <p className="text-sm text-gray-500">{game.accuracy}% accuracy</p>
      </div>
    </div>
  );
};

export default GameHistoryItem;
