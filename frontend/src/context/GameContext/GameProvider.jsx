// src/context/GameContext/GameProvider.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameContext } from './GameContext';

export const GameProvider = ({ children }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerActive, timeLeft]);

  const startGame = useCallback((gameName, duration = 300) => {
    setCurrentGame(gameName);
    setGameState('countdown');
    setScore(0);
    setTimeLeft(duration);
    // Countdown and transition to 'playing' will be handled by UI (GameTimer)
  }, []);

  const startPlaying = useCallback(() => {
 console.log('🎯 startPlaying called - setting state to playing');
  setGameState('playing');
  setIsTimerActive(true);
}, []);

  const pauseGame = useCallback(() => {
    setIsTimerActive(false);
    setGameState('paused');
  }, []);

  const endGame = useCallback(() => {
    setIsTimerActive(false);
    setGameState('finished');
    clearInterval(timerRef.current);
  }, []);

  const updateScore = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  const resetGame = useCallback(() => {
    setCurrentGame(null);
    setGameState('idle');
    setScore(0);
    setTimeLeft(0);
    setIsTimerActive(false);
    clearInterval(timerRef.current);
  }, []);

  const contextValue = {
    currentGame,
    gameState,
    score,
    timeLeft,
    isTimerActive,
    startGame,
    pauseGame,
    endGame,
    updateScore,
    resetGame,
    startPlaying
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
