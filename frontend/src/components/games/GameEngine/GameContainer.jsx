// src/components/games/GameEngine/GameContainer.jsx
import React from 'react';
import { useGame } from '../../../context/GameContext';
import ProgressBar from '../shared/ProgressBar';

const GameContainer = ({ children }) => {
  const { progress, streak, gameTemplate } = useGame();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">
              Question {progress.current} of {progress.total}
            </span>
            {streak > 1 && (
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                🔥 {streak} streak!
              </div>
            )}
          </div>
          <div className="text-sm opacity-90">
            {gameTemplate?.difficulty && (
              <span className="capitalize">{gameTemplate.difficulty} Mode</span>
            )}
          </div>
        </div>
        <ProgressBar 
          current={progress.current} 
          total={progress.total} 
          className="mt-3" 
        />
      </div>

      {/* Game Content */}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default GameContainer;
