// src/context/GameContext/GameProvider.jsx - ENHANCED VERSION
import React, { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { GameContext } from './GameContext';
import { useAuth } from '../AuthContext';
import { useUserStats } from '../UserStatsContext';
import { gameService } from '../../service/gameService';
// import GameEngine from '../../services/gameEngine';

export const GameProvider = ({ children }) => {
  // EXISTING STATE (keep these exactly as they are)
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // NEW STATE (add these for enhanced functionality)
  const [gameInstance, setGameInstance] = useState(null);
  const [gameTemplate, setGameTemplate] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [answers, setAnswers] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // EXISTING REFS (keep these)
  const timerRef = useRef(null);
  
  // NEW REFS (add these)
  const questionTimerRef = useRef(null);
  const gameTimerRef = useRef(null);
  const countdownRef = useRef(null);
  
  // Context dependencies
  const { user } = useAuth();
  const { addGameResult } = useUserStats();

  // EXISTING TIMER LOGIC (keep this exactly as it is)
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

  // EXISTING METHODS (keep these exactly as they are)
  const startGame = useCallback((gameName, duration = 300) => {
    setCurrentGame(gameName);
    setGameState('countdown');
    setScore(0);
    setTimeLeft(duration);
    
    // NEW: Also load the game if it's a gameId string
    if (typeof gameName === 'string' && gameName.includes('-')) {
      loadGame(gameName).catch(console.error);
    }
  }, []);

  const startPlaying = useCallback(() => {
    console.log('🎯 startPlaying called - setting state to playing');
    setGameState('playing');
    setIsTimerActive(true);
  }, []);

  const pauseGame = useCallback(() => {
    setIsTimerActive(false);
    setGameState('paused');
    
    // NEW: Also pause enhanced game timers
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
  }, []);

  const endGame = useCallback(() => {
    setIsTimerActive(false);
    setGameState('finished');
    clearInterval(timerRef.current);
    
    // NEW: Also clear enhanced game timers
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
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
    
    // NEW: Reset enhanced game state
    setGameInstance(null);
    setGameTemplate(null);
    setCurrentQuestion(null);
    setCurrentQuestionIndex(0);
    setTotalQuestions(0);
    setStreak(0);
    setBestStreak(0);
    setTotalTimeLeft(0);
    setProgress({ current: 0, total: 0, percentage: 0 });
    setAnswers([]);
    setGameResult(null);
    setIsLoading(false);
    setError(null);
    
    // Clear all timers
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  // NEW METHODS (add these for enhanced functionality)
  const loadGame = useCallback(async (gameId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const template = gameService.getGameById(gameId);
      if (!template) {
        throw new Error(`Game not found: ${gameId}`);
      }
      
      const instance = gameService.createGameInstance(gameId);
      
      setGameInstance(instance);
      setGameTemplate(template);
      setTotalQuestions(instance.questions.length);
      setCurrentGame(gameId); // Update existing currentGame state
      setIsLoading(false);
      
      console.log(`Loaded game: ${template.name} with ${instance.questions.length} questions`);
      return { template, instance };
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      console.error('Failed to load game:', error);
      throw error;
    }
  }, []);

  // const startEnhancedGame = useCallback(async (gameId) => {
  //   try {
  //     const { template, instance } = await loadGame(gameId);
      
  //     // Start countdown using existing startGame method
  //     startGame(gameId, template.config.timeLimit);
      
  //     // Start countdown timer
  //     let countdown = 3;
  //     countdownRef.current = setInterval(() => {
  //       console.log(`Starting in ${countdown}...`);
        
  //       if (countdown <= 0) {
  //         clearInterval(countdownRef.current);
          
  //         // Start actual game
  //         const firstQuestion = instance.startGame();
  //         setCurrentQuestion(firstQuestion);
  //         setCurrentQuestionIndex(0);
  //         setTotalTimeLeft(template.config.timeLimit * 1000);
          
  //         // Use existing startPlaying method
  //         startPlaying();
          
  //         // Start enhanced timers
  //         startEnhancedTimers(template.config.timePerQuestion * 1000, template.config.timeLimit * 1000);
  //       }
  //       countdown--;
  //     }, 1000);
      
  //   } catch (error) {
  //     console.error('Failed to start enhanced game:', error);
  //     setError(error.message);
  //   }
  // }, [loadGame, startGame, startPlaying]);

  // In GameProvider.jsx - REPLACE the startEnhancedGame method

  const startEnhancedTimers = useCallback((questionTime, totalTime) => {
    // Question timer
    const questionStartTime = Date.now();
    questionTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - questionStartTime;
      const remaining = Math.max(0, questionTime - elapsed);
      
      if (remaining <= 0) {
        submitAnswer(null); // Auto-submit on timeout
      }
    }, 100);

    // Total game timer (sync with existing timer)
    const gameStartTime = Date.now();
    gameTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - gameStartTime;
      const remaining = Math.max(0, totalTime - elapsed);
      setTotalTimeLeft(remaining);
      
      if (remaining <= 0) {
        completeGame();
      }
    }, 1000);
  }, []);

  const startEnhancedGame = useCallback(async (gameId) => {
  console.log('🚀 Starting enhanced game (no countdown):', gameId);
  
  try {
    const { template, instance } = await loadGame(gameId);
    console.log('✅ Game loaded:', template.name);
    console.log('📝 Questions generated:', instance.questions.length);
    
    // Start game immediately (modal timer already handled countdown)
    const firstQuestion = instance.startGame();
    console.log('❓ First question:', firstQuestion);
    
    // Set question state immediately - no countdown needed
    setCurrentQuestion(firstQuestion);
    setCurrentQuestionIndex(0);
    setTotalTimeLeft(template.config.timeLimit * 1000);
    
    // Update existing score for backward compatibility
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnswers([]);
    
    console.log('🎮 Game ready with first question');
    
    // Start only the question and game timers (no countdown timer)
    startEnhancedTimers(template.config.timePerQuestion * 1000, template.config.timeLimit * 1000);
    
  } catch (error) {
    console.error('❌ Failed to start enhanced game:', error);
    setError(error.message);
  }
}, [loadGame, startEnhancedTimers]);

  

  const submitAnswer = useCallback((userAnswer) => {
    if (!gameInstance || gameState !== 'playing') {
      return;
    }

    try {
      const answerResult = gameInstance.submitAnswer(userAnswer);
      
      // Update enhanced state
      setScore(gameInstance.score);
      setStreak(gameInstance.streak);
      setBestStreak(gameInstance.bestStreak);
      setAnswers(prev => [...prev, answerResult]);
      
      // Update existing score state for backward compatibility
      updateScore(answerResult.points);
      
      // Update progress
      const progressData = gameInstance.getProgress();
      setProgress(progressData);
      setCurrentQuestionIndex(progressData.current - 1);

      // Auto-advance to next question
      setTimeout(() => {
        nextQuestion();
      }, 1500);

    } catch (error) {
      setError(error.message);
      console.error('Failed to submit answer:', error);
    }
  }, [gameInstance, gameState, updateScore]);

  const nextQuestion = useCallback(() => {
    if (!gameInstance) return;

    try {
      const nextQ = gameInstance.nextQuestion();
      
      if (nextQ) {
        setCurrentQuestion(nextQ);
        setCurrentQuestionIndex(gameInstance.currentQuestionIndex);
        
        // Restart question timer
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        startEnhancedTimers(gameTemplate.config.timePerQuestion * 1000, totalTimeLeft);
      } else {
        completeGame();
      }
    } catch (error) {
      setError(error.message);
      console.error('Failed to advance question:', error);
    }
  }, [gameInstance, gameTemplate, totalTimeLeft, startEnhancedTimers]);

  const completeGame = useCallback(() => {
    if (!gameInstance) return;

    try {
      const result = gameInstance.completeGame();
      
      if (user) {
        result.userId = user.id;
        result.playerName = user.name;
      }

      setGameResult(result);
      
      // Use existing endGame method for compatibility
      endGame();

      // Update user stats
      if (addGameResult) {
        addGameResult({
          id: result.id,
          gameType: result.gameType,
          gameName: result.gameName,
          score: result.totalScore,
          duration: Math.round(result.totalTime / 1000),
          accuracy: result.accuracy,
          date: result.completedAt,
          difficulty: result.difficulty
        });
      }

      console.log('Game completed:', result);
    } catch (error) {
      setError(error.message);
      console.error('Failed to complete game:', error);
    }
  }, [gameInstance, user, addGameResult, endGame]);

  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      startPlaying();
      
      // Restart timers if we have enhanced game running
      if (gameTemplate && totalTimeLeft > 0) {
        startEnhancedTimers(gameTemplate.config.timePerQuestion * 1000, totalTimeLeft);
      }
    }
  }, [gameState, startPlaying, gameTemplate, totalTimeLeft, startEnhancedTimers]);

  // CONTEXT VALUE (existing + new)
  const contextValue = {
    // EXISTING properties (keep these exactly)
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
    startPlaying,
    
    // NEW properties and methods (add these)
    gameInstance,
    gameTemplate,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    streak,
    bestStreak,
    totalTimeLeft,
    progress,
    answers,
    gameResult,
    isLoading,
    error,
    loadGame,
    startEnhancedGame,
    submitAnswer,
    nextQuestion,
    completeGame,
    resumeGame
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
