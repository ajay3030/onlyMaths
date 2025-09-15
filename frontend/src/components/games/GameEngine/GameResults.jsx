// src/components/games/GameEngine/GameResults.jsx
import React from 'react';
import { useGame } from '../../../context/GameContext';

const GameResults = ({ onPlayAgain }) => {
  const { gameResult, score, resetGame } = useGame();

  const getPerformanceMessage = (accuracy) => {
    if (accuracy >= 90) return { message: "Outstanding! 🏆", color: "text-yellow-500" };
    if (accuracy >= 80) return { message: "Excellent! 🌟", color: "text-green-500" };
    if (accuracy >= 70) return { message: "Great job! 👍", color: "text-blue-500" };
    if (accuracy >= 60) return { message: "Good effort! 💪", color: "text-purple-500" };
    return { message: "Keep practicing! 📚", color: "text-gray-500" };
  };

  const performance = getPerformanceMessage(gameResult?.accuracy || 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h2>
      <p className={`text-xl mb-8 ${performance.color}`}>{performance.message}</p>
      
      {gameResult && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{gameResult.totalScore}</div>
            <div className="text-sm text-gray-600">Total Score</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{gameResult.accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{gameResult.correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{gameResult.bestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
        </div>
      )}

      <div className="space-x-4">
        <button
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Play Again
        </button>
        <button
          onClick={resetGame}
          className="bg-gray-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default GameResults;
