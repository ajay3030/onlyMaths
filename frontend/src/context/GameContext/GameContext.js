// src/context/GameContext/GameContext.js
import { createContext } from 'react';

export const GameContext = createContext({
  currentGame: null,
  gameState: 'idle', // 'idle', 'countdown', 'playing', 'paused', 'finished'
  score: 0,
  timeLeft: 0,
  isTimerActive: false,
  startGame: () => {},
  pauseGame: () => {},
  endGame: () => {},
  updateScore: () => {},
  resetGame: () => {},
  startPlaying:()=>{},
});
