// src/components/games/ArithmeticGame/ArithmeticGame.jsx
import React from 'react';
import { useGame } from '../../../context/GameContext';
import ArithmeticQuestion from './ArithmeticQuestion';
import ArithmeticInput from './ArithmeticInput';

const ArithmeticGame = () => {
  const { 
    currentQuestion, 
    gameState, 
    submitAnswer,
    answers,
    gameTemplate
  } = useGame();

  // Show loading if no question available
  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading question...</p>
      </div>
    );
  }

  // Get the last answer result for feedback
  const lastAnswer = answers[answers.length - 1];
  const showingFeedback = lastAnswer && Date.now() - new Date(lastAnswer.timestamp || 0).getTime() < 1500;

  return (
    <div className="space-y-8">
      {/* Question Display */}
      <ArithmeticQuestion 
        question={currentQuestion}
        showFeedback={showingFeedback}
        lastAnswer={lastAnswer}
      />
      
      {/* Input Section */}
      <ArithmeticInput 
        onSubmit={submitAnswer}
        disabled={gameState !== 'playing' || showingFeedback}
        questionType={gameTemplate?.config?.multipleChoice ? 'multiple-choice' : 'input'}
        options={currentQuestion.options}
      />
    </div>
  );
};

export default ArithmeticGame;
