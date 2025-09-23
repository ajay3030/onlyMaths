// src/components/games/GameEngine/GameResults.jsx - FIXED VERSION
import React from 'react';
import { useGame } from '../../../context/GameContext';
import { useNavigate } from 'react-router-dom';

const GameResults = ({ onPlayAgain }) => {
  const { gameResult, score, resetGame } = useGame();
  const navigate = useNavigate();

  // DEBUG: Log all score sources
  console.log('🎯 GameResults Debug:', {
    gameResultExists: !!gameResult,
    gameResultTotalScore: gameResult?.totalScore,
    contextScore: score,
    gameResult: gameResult
  });

  const handlePlayAgain = () => {
    console.log('🔄 Play Again clicked');
    resetGame(); // Reset game state
    navigate('/'); // Go to home to select game again
  };

  const handleBackToHome = () => {
    console.log('🏠 Back to Home clicked');
    resetGame(); // Reset game state  
    navigate('/'); // Direct navigation to home
  };

  // Use gameResult.totalScore as primary source, context score as fallback
  const displayScore = gameResult?.totalScore ?? score;
  const displayAccuracy = gameResult?.accuracy ?? 0;
  const displayCorrect = gameResult?.correctAnswers ?? 0;
  const displayStreak = gameResult?.bestStreak ?? 0;

  const getPerformanceMessage = (accuracy) => {
    if (accuracy >= 90) return { message: "Outstanding! 🏆", color: "text-yellow-500" };
    if (accuracy >= 80) return { message: "Excellent! 🌟", color: "text-green-500" };
    if (accuracy >= 70) return { message: "Great job! 👍", color: "text-blue-500" };
    if (accuracy >= 60) return { message: "Good effort! 💪", color: "text-purple-500" };
    return { message: "Keep practicing! 📚", color: "text-gray-500" };
  };

  const performance = getPerformanceMessage(displayAccuracy);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Complete!</h2>
      <p className={`text-xl mb-8 ${performance.color}`}>{performance.message}</p>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{displayScore}</div>
          <div className="text-sm text-gray-600">Total Score</div>
          {/* DEBUG INFO - Remove after fixing */}
          {/* <div className="text-xs text-gray-400">
            R:{gameResult?.totalScore} | C:{score}
          </div> */}
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{displayAccuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{displayCorrect}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{displayStreak}</div>
          <div className="text-sm text-gray-600">Best Streak</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-x-4">
        <button
          onClick={handlePlayAgain}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Play Again
        </button>
        <button
          onClick={handleBackToHome}
          className="bg-gray-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-600 transition-colors"
        >
          Back to Home
        </button>
      </div>

      {/* DEBUG SECTION - Remove after fixing */}
      {/* <div className="mt-6 p-4 bg-gray-50 rounded text-xs text-left">
        <strong>DEBUG INFO:</strong><br/>
        Game Result Exists: {gameResult ? 'Yes' : 'No'}<br/>
        Game Result Total Score: {gameResult?.totalScore}<br/>
        Context Score: {score}<br/>
        Display Score: {displayScore}<br/>
        Game Result Object: {JSON.stringify(gameResult, null, 2)}
      </div> */}
    </div>
  );
};

export default GameResults;
