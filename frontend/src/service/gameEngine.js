// src/services/gameEngine.js
import questionGenerators from "./questionGenerators";

export class GameEngine {
  constructor(gameTemplate) {
    this.template = gameTemplate;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.answers = [];
    this.startTime = null;
    this.endTime = null;
    this.questionStartTime = null;
    this.totalTimeSpent = 0;
    this.isCompleted = false;

    // Generate questions based on game type
    this.generateQuestions();
  }

  generateQuestions() {
    const generator = questionGenerators[this.template.type];
    if (!generator) {
      throw new Error(
        `No generator found for game type: ${this.template.type}`
      );
    }

    this.questions = generator(this.template.config);
    console.log(
      `Generated ${this.questions.length} questions for ${this.template.name}`
    );
  }

  startGame() {
    this.startTime = Date.now();
    this.questionStartTime = Date.now();
    return this.getCurrentQuestion();
  }

  getCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  submitAnswer(userAnswer) {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error("No current question to answer");
    }

    const timeSpent = Date.now() - this.questionStartTime;
    const isCorrect = this.validateAnswer(userAnswer, currentQuestion.answer);
    const points = this.calculatePoints(isCorrect, timeSpent);

    // Update question with results
    currentQuestion.userAnswer = userAnswer;
    currentQuestion.isCorrect = isCorrect;
    currentQuestion.timeSpent = timeSpent;
    currentQuestion.points = points;

    // Update game stats
    this.score += points;
    this.totalTimeSpent += timeSpent;

    if (isCorrect) {
      this.streak++;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
    } else {
      this.streak = 0;
    }

    const result = {
      questionId: currentQuestion.id,
      questionNumber: currentQuestion.questionNumber,
      userAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      timeSpent,
      points,
      streak: this.streak,
    };

    this.answers.push(result);
    return result;
  }

  validateAnswer(userAnswer, correctAnswer) {
    // Handle different answer types
    const userNum = parseFloat(userAnswer);
    const correctNum = parseFloat(correctAnswer);

    if (isNaN(userNum) || isNaN(correctNum)) {
      return false;
    }

    // Allow small floating point differences
    return Math.abs(userNum - correctNum) < 0.01;
  }

  // In gameEngine.js - ADD debug to calculatePoints method
  calculatePoints(isCorrect, timeSpent) {
    if (!isCorrect) {
      console.log("❌ Wrong answer, 0 points");
      return 0;
    }

    const { basePoints, timeBonus, streakBonus, difficultyMultiplier } =
      this.template.scoring;
    const timePerQuestion = this.template.config.timePerQuestion * 1000; // Convert to ms

    console.log("🧮 Calculating points:", {
      basePoints,
      timeBonus,
      streakBonus,
      difficultyMultiplier,
      timeSpent,
      timePerQuestion,
      currentStreak: this.streak,
    });

    let points = basePoints;
    console.log("📊 Base points:", points);

    // Time bonus (faster answers get more points)
    const timeRatio = 1 - timeSpent / timePerQuestion;
    if (timeRatio > 0.5) {
      const timeBonusPoints = Math.floor(timeBonus * timeRatio);
      points += timeBonusPoints;
      console.log(
        "⚡ Time bonus added:",
        timeBonusPoints,
        "New total:",
        points
      );
    }

    // Streak bonus
    if (this.streak >= 2) {
      const streakBonusPoints = streakBonus * Math.min(this.streak - 1, 5);
      points += streakBonusPoints;
      console.log(
        "🔥 Streak bonus added:",
        streakBonusPoints,
        "New total:",
        points
      );
    }

    // Apply difficulty multiplier
    const finalPoints = Math.floor(points * difficultyMultiplier);
    console.log("🎯 Final points after multiplier:", finalPoints);

    return Math.max(finalPoints, 1); // Minimum 1 point
  }

  // In gameEngine.js - Add debug to nextQuestion method
  // In gameEngine.js - FIX nextQuestion to handle completion properly
  nextQuestion() {
    console.log("🔄 NextQuestion called:", {
      currentIndex: this.currentQuestionIndex,
      totalQuestions: this.questions.length,
      isLastQuestion: this.currentQuestionIndex >= this.questions.length - 1,
    });

    this.currentQuestionIndex++;
    this.questionStartTime = Date.now();

    // Check if we've reached the end
    if (this.currentQuestionIndex >= this.questions.length) {
      console.log("🏁 Reached end of questions, completing game");
      return this.completeGame(); // This returns the game result, not a question
    }

    const currentQuestion = this.questions[this.currentQuestionIndex];

    console.log("❓ Returning next question:", {
      questionIndex: this.currentQuestionIndex,
      questionId: currentQuestion?.id,
      isValidQuestion: !!(
        currentQuestion &&
        currentQuestion.num1 &&
        currentQuestion.num2 &&
        currentQuestion.operation
      ),
    });

    return currentQuestion;
  }

// In gameEngine.js - ENSURE completeGame returns correct totalScore
completeGame() {
  if (this.gameCompleted) {
    return this.gameResult;
  }

  this.gameCompleted = true;
  this.endTime = Date.now();
  
  const totalTime = this.endTime - this.startTime;
  const totalQuestions = this.questions.length;
  const correctAnswers = this.questions.filter(q => q.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  console.log('🏁 GameEngine completeGame calculation:', {
    totalScore: this.score,
    correctAnswers,
    totalQuestions,
    accuracy,
    totalTime
  });

  this.gameResult = {
    id: `result_${Date.now()}`,
    gameId: this.template.id,
    gameType: this.template.type,
    gameName: this.template.name,
    difficulty: this.template.difficulty,
    totalScore: this.score, // Make sure this is correct
    totalQuestions,
    correctAnswers,
    wrongAnswers: totalQuestions - correctAnswers,
    accuracy,
    totalTime,
    averageTimePerQuestion: totalTime / totalQuestions,
    streak: this.streak,
    bestStreak: this.bestStreak,
    questions: [...this.questions],
    completedAt: new Date().toISOString()
  };

  console.log('🎯 Final game result:', this.gameResult);
  return this.gameResult;
}


  getGameResult() {
    const correctAnswers = this.answers.filter((a) => a.isCorrect).length;
    const accuracy =
      this.questions.length > 0
        ? (correctAnswers / this.questions.length) * 100
        : 0;
    const totalGameTime = this.endTime ? this.endTime - this.startTime : 0;

    return {
      gameId: this.template.id,
      gameName: this.template.name,
      gameType: this.template.type,
      totalScore: this.score,
      totalQuestions: this.questions.length,
      correctAnswers,
      accuracy: Math.round(accuracy * 100) / 100,
      totalTime: totalGameTime,
      averageTimePerQuestion:
        this.questions.length > 0
          ? Math.round(this.totalTimeSpent / this.questions.length)
          : 0,
      bestStreak: this.bestStreak,
      answers: this.answers,
      difficulty: this.template.difficulty,
      completedAt: new Date().toISOString(),
      // Add user ID when we have auth
      userId: null,
    };
  }

  saveGameResult(result) {
    try {
      const existingResults = JSON.parse(
        localStorage.getItem("onlymaths_game_results") || "[]"
      );

      // Add unique ID to result
      result.id = `result_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      existingResults.push(result);

      // Keep only last 100 results to prevent localStorage bloat
      const limitedResults = existingResults.slice(-100);

      localStorage.setItem(
        "onlymaths_game_results",
        JSON.stringify(limitedResults)
      );
      console.log("Game result saved:", result);

      return result;
    } catch (error) {
      console.error("Failed to save game result:", error);
      return result;
    }
  }

  // Utility methods
  // In gameEngine.js - Make sure getProgress returns correct values
  // In gameEngine.js - Make sure getProgress returns correct values
  getProgress() {
    const progress = {
      current: this.currentQuestionIndex + 1, // +1 because index is 0-based
      total: this.questions.length,
      percentage: Math.round(
        ((this.currentQuestionIndex + 1) / this.questions.length) * 100
      ),
    };

    console.log("📊 GameEngine progress:", progress);
    return progress;
  }

  getTimeRemaining(totalTimeLimit) {
    if (!this.startTime || !totalTimeLimit) return null;

    const elapsed = Date.now() - this.startTime;
    const remaining = totalTimeLimit * 1000 - elapsed;

    return Math.max(0, remaining);
  }

  pause() {
    // TODO: Implement pause functionality
    console.log("Game paused");
  }

  resume() {
    // TODO: Implement resume functionality
    console.log("Game resumed");
  }
}

export default GameEngine;
