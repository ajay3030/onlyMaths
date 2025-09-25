// src/context/GameContext/GameProvider.jsx - ENHANCED VERSION
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { GameContext } from "./GameContext";
import { useAuth } from "../AuthContext";
import { useUserStats } from "../UserStatsContext";
import { gameService } from "../../service/gameService";
import { gameApi } from "../../service/gameApi";
// import GameEngine from '../../services/gameEngine';

export const GameProvider = ({ children }) => {
  // EXISTING STATE (keep these exactly as they are)
  const [currentGame, setCurrentGame] = useState(null);
  const [gameState, setGameState] = useState("idle");
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
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percentage: 0,
  });
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
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setGameState("finished");
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
    setGameState("countdown");
    setScore(0);
    setTimeLeft(duration);

    // NEW: Also load the game if it's a gameId string
    if (typeof gameName === "string" && gameName.includes("-")) {
      loadGame(gameName).catch(console.error);
    }
  }, []);

  const startPlaying = useCallback(() => {
    console.log("🎯 startPlaying called - setting state to playing");
    setGameState("playing");
    setIsTimerActive(true);
  }, []);

  const pauseGame = useCallback(() => {
    setIsTimerActive(false);
    setGameState("paused");

    // NEW: Also pause enhanced game timers
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
  }, []);

  const endGame = useCallback(() => {
    setIsTimerActive(false);
    setGameState("finished");
    clearInterval(timerRef.current);

    // NEW: Also clear enhanced game timers
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const updateScore = useCallback((points) => {
    setScore((prev) => prev + points);
  }, []);

  const resetGame = useCallback(() => {
    setCurrentGame(null);
    setGameState("idle");
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

  // In GameProvider.jsx - ADD this function near the top of your functions

// // 1. UTILITY FUNCTIONS FIRST (add this if missing)
// const clearAllTimers = useCallback(() => {
//   console.log('🧹 Clearing all timers...');
//   if (timerRef.current) {
//     clearInterval(timerRef.current);
//     timerRef.current = null;
//   }
//   if (questionTimerRef.current) {
//     clearInterval(questionTimerRef.current);
//     questionTimerRef.current = null;
//   }
//   if (gameTimerRef.current) {
//     clearInterval(gameTimerRef.current);
//     gameTimerRef.current = null;
//   }
//   if (countdownRef.current) {
//     clearInterval(countdownRef.current);
//     countdownRef.current = null;
//   }
// }, []);


// In GameProvider.jsx - UPDATE the completeGame function
const completeGame = useCallback(async () => {
  if (!gameInstance) return;

  // Clear timers
  if (timerRef.current) clearInterval(timerRef.current);
  if (questionTimerRef.current) clearInterval(questionTimerRef.current);
  if (gameTimerRef.current) clearInterval(gameTimerRef.current);
  if (countdownRef.current) clearInterval(countdownRef.current);

  try {
    console.log('🏁 Before completeGame - current score:', score);
    console.log('🏁 GameInstance score:', gameInstance.score);

    const result = gameInstance.completeGame();

    console.log('🎯 Game completion result:', {
      resultTotalScore: result.totalScore,
      currentScore: score,
      gameInstanceScore: gameInstance.score
    });

    if (user) {
      result.userId = user.id;
      result.playerName = user.name;
    }

    // Set local state
    setCurrentQuestion(null);
    setGameResult(result);
    setIsTimerActive(false);
    setGameState('finished');

    // 🔥 ONLY save to backend and UserStats if user is authenticated
    if (user && result) {
      try {
        console.log('💾 Saving game result to backend...');

        // Format the result for backend using the helper function
        const backendGameResult = gameApi.formatGameResultForBackend(result, gameTemplate);

        // Save to backend
        const savedResult = await gameApi.saveGameResult(backendGameResult);

        console.log('✅ Game result saved to backend successfully:', {
          gameType: result.gameType,
          score: result.totalScore,
          accuracy: result.accuracy
        });

        // Optionally update local result with backend data
        if (savedResult.gameResult) {
          setGameResult(prev => ({ ...prev, backendId: savedResult.gameResult._id }));
        }

        // 🔥 ONLY call addGameResult if user is authenticated AND addGameResult exists
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
          console.log('✅ Game result added to UserStats');
        }

      } catch (backendError) {
        console.error('❌ Failed to save game result to backend:', backendError);
        console.warn('⚠️ Game completed locally but not saved to backend - user can continue playing');
      }
    } else if (!user) {
      console.log('ℹ️ Game completed without user authentication - results not saved');
      console.log('🎮 Guest user can still see results on screen');
    }

    console.log('🎉 Game completed successfully with score:', result.totalScore);
  } catch (error) {
    setError(error.message);
    console.error('Failed to complete game:', error);
  }
}, [gameInstance, user, addGameResult, score, gameTemplate]);

  // 🆕 NEW: Add backend data fetching functions
  const getUserGameHistory = useCallback(async (params = {}) => {
    if (!user) {
      console.log('⚠️ User must be logged in to view game history');
      return { results: [], pagination: {} };
    }

    try {
      console.log('📊 Fetching user game history from backend...');
      const historyData = await gameApi.getGameHistory(params);
      console.log('✅ Game history retrieved successfully:', historyData.results.length, 'games');
      return historyData;
    } catch (error) {
      console.error('❌ Failed to get game history:', error);
      // Return empty data instead of throwing
      return { results: [], pagination: {}, error: error.message };
    }
  }, [user]);

  const getUserStats = useCallback(async () => {
    if (!user) {
      console.log('⚠️ User must be logged in to view statistics');
      return null;
    }

    try {
      console.log('📈 Fetching user statistics from backend...');
      const statsData = await gameApi.getUserStats();
      console.log('✅ User statistics retrieved successfully');
      return statsData;
    } catch (error) {
      console.error('❌ Failed to get user statistics:', error);
      return null;
    }
  }, [user]);

  const getLeaderboard = useCallback(async (params = {}) => {
    try {
      console.log('🏆 Fetching leaderboard from backend...');
      const leaderboardData = await gameApi.getLeaderboard(params);
      console.log('✅ Leaderboard retrieved successfully');
      return leaderboardData;
    } catch (error) {
      console.error('❌ Failed to get leaderboard:', error);
      return { leaderboard: [], error: error.message };
    }
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

      console.log(
        `Loaded game: ${template.name} with ${instance.questions.length} questions`
      );
      return { template, instance };
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      console.error("Failed to load game:", error);
      throw error;
    }
  }, []);

  
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

  const startEnhancedGame = useCallback(
    async (gameId) => {
      console.log("🚀 Starting enhanced game (no countdown):", gameId);

      try {
        const { template, instance } = await loadGame(gameId);
        console.log("✅ Game loaded:", template.name);
        console.log("📝 Questions generated:", instance.questions.length);

        // Start game immediately (modal timer already handled countdown)
        const firstQuestion = instance.startGame();
        console.log("❓ First question:", firstQuestion);

        // Set question state immediately - no countdown needed
        setCurrentQuestion(firstQuestion);
        setCurrentQuestionIndex(0);
        setTotalTimeLeft(template.config.timeLimit * 1000);

        // Update existing score for backward compatibility
        setScore(0);
        setStreak(0);
        setBestStreak(0);
        setAnswers([]);

        console.log("🎮 Game ready with first question");

        // Start only the question and game timers (no countdown timer)
        startEnhancedTimers(
          template.config.timePerQuestion * 1000,
          template.config.timeLimit * 1000
        );
      } catch (error) {
        console.error("❌ Failed to start enhanced game:", error);
        setError(error.message);
      }
    },
    [loadGame, startEnhancedTimers]
  );

  const submitAnswer = useCallback(
    (userAnswer) => {
      if (!gameInstance || gameState !== "playing") {
        return;
      }

      try {
        console.log("=== SUBMIT ANSWER START ===");
        console.log("📝 Before submit:", {
          currentScore: score,
          gameInstanceScore: gameInstance.score,
          userAnswer,
          currentIndex: gameInstance.currentQuestionIndex,
          totalQuestions: gameInstance.questions.length,
        });

        const answerResult = gameInstance.submitAnswer(userAnswer);

        console.log("🎯 Answer result:", answerResult);

        const newScore = gameInstance.score;
        setScore(newScore);
        setStreak(gameInstance.streak);
        setBestStreak(gameInstance.bestStreak);
        setAnswers((prev) => [...prev, answerResult]);

        // Update progress
        const progressData = gameInstance.getProgress();
        console.log("📈 Progress after submit:", progressData);
        setProgress(progressData);
        setCurrentQuestionIndex(progressData.current - 1);

        // FIXED: Auto-advance logic with better completion check
        setTimeout(() => {
          if (gameInstance) {
            console.log("🔄 Checking for next question...");
            console.log("Current index:", gameInstance.currentQuestionIndex);
            console.log("Total questions:", gameInstance.questions.length);

            // Check if we've answered all questions
            if (
              gameInstance.currentQuestionIndex >=
              gameInstance.questions.length - 1
            ) {
              console.log("🏁 All questions answered, completing game");
              completeGame();
              return;
            }

            const nextQ = gameInstance.nextQuestion();
            console.log("❓ Next question:", nextQ);

            if (nextQ && typeof nextQ === "object" && nextQ.id) {
              // Valid next question
              setCurrentQuestion(nextQ);
              setCurrentQuestionIndex(gameInstance.currentQuestionIndex);
              setProgress(gameInstance.getProgress());
            } else {
              // No more questions or invalid question
              console.log("🏁 No valid next question, completing game");
              completeGame();
            }
          }
        }, 1500);

        console.log("=== SUBMIT ANSWER END ===");
      } catch (error) {
        setError(error.message);
        console.error("❌ Failed to submit answer:", error);
      }
    },
    [gameInstance, gameState, score, completeGame]
  );

  const nextQuestion = useCallback(() => {
    if (!gameInstance) return;

    try {
      const nextQ = gameInstance.nextQuestion();

      if (nextQ) {
        setCurrentQuestion(nextQ);
        setCurrentQuestionIndex(gameInstance.currentQuestionIndex);

        // Restart question timer
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        startEnhancedTimers(
          gameTemplate.config.timePerQuestion * 1000,
          totalTimeLeft
        );
      } else {
        completeGame();
      }
    } catch (error) {
      setError(error.message);
      console.error("Failed to advance question:", error);
    }
  }, [gameInstance, gameTemplate, totalTimeLeft, startEnhancedTimers]);

  

  const resumeGame = useCallback(() => {
    if (gameState === "paused") {
      startPlaying();

      // Restart timers if we have enhanced game running
      if (gameTemplate && totalTimeLeft > 0) {
        startEnhancedTimers(
          gameTemplate.config.timePerQuestion * 1000,
          totalTimeLeft
        );
      }
    }
  }, [
    gameState,
    startPlaying,
    gameTemplate,
    totalTimeLeft,
    startEnhancedTimers,
  ]);

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
    resumeGame,

     // 🆕 NEW: Backend integration functions
    getUserGameHistory,
    getUserStats,
    getLeaderboard
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
