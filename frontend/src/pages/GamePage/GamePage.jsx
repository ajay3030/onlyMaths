// src/pages/GamePage/GamePage.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import { Navigate } from 'react-router-dom';
import { GAMES_CONFIG } from '../../utils/constants/gameConfig';

const GamePage = () => {
  const { currentGame, gameState, score, timeLeft, resetGame } = useGame();

  // Redirect if no game is selected
  if (!currentGame) {
    return <Navigate to="/" replace />;
  }

  const gameConfig = GAMES_CONFIG[currentGame];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitGame = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Game Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Game Info */}
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{gameConfig.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{gameConfig.name}</h1>
                <p className="text-gray-600">{gameConfig.description}</p>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-600">Time Left</div>
              </div>
              <button
                onClick={handleExitGame}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Exit Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {gameState === 'playing' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-6">{gameConfig.icon}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {gameConfig.name} is Starting!
              </h2>
              <p className="text-gray-600 mb-8">
                This is where the actual game would be implemented. 
                Each game would have its own component with specific logic.
              </p>
              
              {/* Sample Game Interface */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-lg text-gray-700">
                  Game interface will be implemented here based on the specific game type.
                </p>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Great Job!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                You scored {score} points in {gameConfig.name}!
              </p>
              <button
                onClick={handleExitGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
