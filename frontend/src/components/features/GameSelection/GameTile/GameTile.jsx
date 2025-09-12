// src/components/features/GameSelection/GameTile/GameTile.jsx
import React from 'react';
import { useGame } from '../../../../context/GameContext';
import { DIFFICULTY_COLORS } from '../../../../utils/constants/gameConfig';

const GameTile = ({ gameKey, gameConfig }) => {
  const { startGame } = useGame();

  const handleGameStart = () => {
    startGame(gameKey, gameConfig.duration);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div
      onClick={handleGameStart}
      className={`bg-gradient-to-br ${gameConfig.color} rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-6 translate-y-6">
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative text-center">
        {/* Game Icon */}
        <div className="text-6xl mb-4 group-hover:animate-bounce transition-all duration-300">
          {gameConfig.icon}
        </div>

        {/* Game Title */}
        <h3 className="text-white text-xl font-bold mb-2 group-hover:text-yellow-200 transition-colors">
          {gameConfig.name}
        </h3>

        {/* Game Description */}
        <p className="text-white text-opacity-90 text-sm mb-4 group-hover:text-yellow-100 transition-colors">
          {gameConfig.description}
        </p>

        {/* Game Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[gameConfig.difficulty]}`}>
              {gameConfig.difficulty}
            </span>
            <span className="text-white bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
              ⏱️ {formatDuration(gameConfig.duration)}
            </span>
          </div>
        </div>

        {/* Play Button */}
        <div className="mt-4 bg-white bg-opacity-20 rounded-full py-3 px-6 inline-block group-hover:bg-opacity-30 transition-all duration-300 group-hover:scale-110">
          <span className="text-white font-semibold flex items-center space-x-2">
            <span>🎮</span>
            <span>Play Now!</span>
          </span>
        </div>

        {/* Hover Effect Indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-yellow-400 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            ▶️
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTile;
