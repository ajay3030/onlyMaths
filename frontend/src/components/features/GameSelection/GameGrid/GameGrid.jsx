// src/components/features/GameSelection/GameGrid/GameGrid.jsx
import React from 'react';
import GameTile from '../GameTile/GameTile';
import { GAMES_CONFIG } from '../../../../utils/constants/gameConfig';

const GameGrid = () => {
  const gameEntries = Object.entries(GAMES_CONFIG);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose Your Math Adventure! 🚀
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Select a game to start your mathematical journey. Each game is designed to challenge 
          and improve different math skills while having fun!
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameEntries.map(([gameKey, gameConfig]) => (
          <GameTile
            key={gameKey}
            gameKey={gameKey}
            gameConfig={gameConfig}
          />
        ))}
      </div>

      {/* Footer Message */}
      <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <div className="text-4xl mb-3">🌟</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ready to become a Math Champion?
        </h3>
        <p className="text-gray-600">
          Start with any game above and track your progress as you master new skills!
        </p>
      </div>
    </div>
  );
};

export default GameGrid;
