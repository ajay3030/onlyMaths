// src/pages/GamePage/GamePage.jsx - UPDATED FOR OPTION B
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { GAMES_CONFIG } from '../../utils/constants/gameConfig';

// Import Game Components
import GameContainer from '../../components/games/GameEngine/GameContainer';
import ArithmeticGame from '../../components/games/ArithmeticGame';
import GameCountdown from '../../components/games/GameEngine/GameCountdown';
import GameResults from '../../components/games/GameEngine/GameResults';

const GamePage = () => {
  const { gameId } = useParams(); // Get gameId from URL: /game/arithmetic-game
  const { 
    currentGame, 
    gameState, 
    score, 
    timeLeft, 
    resetGame,
    startEnhancedGame,
    resumeGame,
    gameTemplate,
    currentQuestion, // ADD this to check if question is loaded
    isLoading,
    error
  } = useGame();

  // UPDATED: Start enhanced game only when modal timer completes
  useEffect(() => {
    // Start enhanced game when:
    // 1. We have gameId from URL
    // 2. Game state is 'playing' (modal timer completed)
    // 3. We don't already have a question loaded
    // 4. Not currently loading
    if (gameId && gameState === 'playing' && !currentQuestion && !isLoading) {
      console.log(`🎮 GamePage: Modal timer completed, starting enhanced game ${gameId}`);
      startEnhancedGame(gameId);
    }
  }, [gameId, gameState, currentQuestion, isLoading, startEnhancedGame]);

  // Redirect if no game ID in URL
  if (!gameId) {
    return <Navigate to="/" replace />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Game Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Get game config (fallback to gameTemplate if GAMES_CONFIG doesn't have it)
  const gameConfig = GAMES_CONFIG[gameId] || gameTemplate || {
    name: 'Math Game',
    description: 'Practice your math skills',
    icon: '🔢'
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExitGame = () => {
    resetGame();
  };

  // Render specific game component based on game type
  const renderGameComponent = () => {
    if (!gameTemplate) return null;

    switch (gameTemplate.type) {
      case 'arithmetic':
        return <ArithmeticGame />;
      // Add more game types here as we create them
      // case 'memory':
      //   return <MemoryGame />;
      // case 'sequence':
      //   return <SequenceGame />;
      default:
        return (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Game Type Not Implemented
            </h2>
            <p className="text-gray-600">
              Game type "{gameTemplate.type}" is not yet implemented.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Game Header - Enhanced but maintains existing structure */}
      <div className="bg-white shadow-lg border-b-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Game Info */}
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{gameConfig.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{gameConfig.name}</h1>
                <p className="text-gray-600">{gameConfig.description}</p>
                {gameState === 'playing' && gameTemplate && (
                  <p className="text-sm text-purple-600">
                    Difficulty: {gameTemplate.difficulty} • Questions: {gameTemplate.config?.questionCount}
                  </p>
                )}
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

      {/* Game Content - UPDATED for Option B */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* UPDATED: Countdown State - Show waiting message instead of GameCountdown */}
          {gameState === 'countdown' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-6">⏰</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Get Ready!
              </h2>
              <p className="text-gray-600">
                Game will start when timer completes...
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Current State: {gameState}
              </div>
            </div>
          )}

          {/* UPDATED: Playing State - Handle loading questions */}
          {gameState === 'playing' && (
            <>
              {!currentQuestion ? (
                // Show loading while questions are being prepared
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Preparing questions...</p>
                  <div className="mt-4 text-xs text-gray-400">
                    Game Template: {gameTemplate?.name || 'Loading...'}
                  </div>
                </div>
              ) : (
                // Show actual game when questions are ready
                <GameContainer>
                  {renderGameComponent()}
                </GameContainer>
              )}
            </>
          )}

          {/* Paused State */}
          {gameState === 'paused' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-6">⏸️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Game Paused
              </h2>
              <p className="text-gray-600 mb-8">
                Take a break! Your progress is saved.
              </p>
              <div className="space-x-4">
                <button
                  onClick={resumeGame}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                  Resume Game
                </button>
                <button
                  onClick={handleExitGame}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                >
                  Exit Game
                </button>
              </div>
            </div>
          )}

          {/* Finished State - UPDATED play again logic */}
          {gameState === 'finished' && (
            <GameResults onPlayAgain={() => {
              // Reset and go back to home to restart the full flow
              resetGame();
              setTimeout(() => {
                window.location.href = '/';
              }, 500);
            }} />
          )}

          {/* UPDATED: Idle State - Better fallback */}
          {gameState === 'idle' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-6">🎮</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Game Not Started
              </h2>
              <p className="text-gray-600 mb-8">
                Please go back to home and start the game properly.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Back to Home
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GamePage;
