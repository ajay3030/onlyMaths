// src/context/GameContext/GameContext.js - ENHANCED VERSION
import { createContext } from 'react';

export const GameContext = createContext({
  // EXISTING properties (keep these exactly as they are)
  currentGame: null,
  gameState: 'idle', // 'idle', 'countdown', 'playing', 'paused', 'finished'
  score: 0,
  timeLeft: 0,
  isTimerActive: false,
  
  // NEW properties (add these for enhanced functionality)
  gameInstance: null,           // GameEngine instance
  gameTemplate: null,           // Game configuration/template
  currentQuestion: null,        // Current question object
  currentQuestionIndex: 0,      // Current question number (0-based)
  totalQuestions: 0,            // Total number of questions in game
  streak: 0,                    // Current correct answer streak
  bestStreak: 0,                // Best streak achieved in this game
  totalTimeLeft: 0,             // Total game time remaining (ms)
  progress: {                   // Game progress object
    current: 0,                 // Current question number (1-based)
    total: 0,                   // Total questions
    percentage: 0               // Progress percentage (0-100)
  },
  answers: [],                  // Array of user answers and results
  gameResult: null,             // Final game result object
  isLoading: false,             // Loading state for game operations
  error: null,                  // Error message if any

  // EXISTING methods (keep these exactly as they are)
  startGame: () => {},          // Start basic game with timer
  pauseGame: () => {},          // Pause the game
  endGame: () => {},            // End the game
  updateScore: () => {},        // Update score (for backward compatibility)
  resetGame: () => {},          // Reset all game state
  startPlaying: () => {},       // Transition from countdown to playing
  
  // NEW methods (add these for enhanced functionality)
  loadGame: () => {},           // Load game template and create instance
  startEnhancedGame: () => {},  // Start full game with questions and logic
  submitAnswer: () => {},       // Submit user answer to current question
  nextQuestion: () => {},       // Move to next question
  completeGame: () => {},       // Complete game and save results
  resumeGame: () => {} ,         // Resume paused game

   // 🆕 NEW: Backend integration functions
    getUserGameHistory:()=>{},
    getUserStats:()=>{},
    getLeaderboard:()=>{}
});

export default GameContext;
