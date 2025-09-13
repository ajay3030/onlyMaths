// src/components/features/Dashboard/RecentGames/RecentGames.jsx
import React from 'react';
import GameHistoryItem from './GameHistoryItem';

const RecentGames = ({ gameHistory }) => {
  const recentGames = gameHistory?.slice(0, 5) || [];

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Games 📈</h2>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          View All
        </button>
      </div>
      
      {recentGames.length > 0 ? (
        <div className="space-y-4">
          {recentGames.map((game) => (
            <GameHistoryItem key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-gray-500 text-lg mb-2">No games played yet</p>
          <p className="text-gray-400">Start playing to see your history!</p>
        </div>
      )}
    </div>
  );
};

export default RecentGames;
