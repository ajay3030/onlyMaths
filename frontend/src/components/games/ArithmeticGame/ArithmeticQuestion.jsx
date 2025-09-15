// src/components/games/ArithmeticGame/ArithmeticQuestion.jsx
import React from 'react';

const ArithmeticQuestion = ({ question, showFeedback, lastAnswer }) => {
  const getOperatorSymbol = (operator) => {
    const symbols = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷'
    };
    return symbols[operator] || operator;
  };

  const getFeedbackDisplay = () => {
    if (!showFeedback || !lastAnswer) return null;

    return (
      <div className={`mt-6 p-4 rounded-lg border-2 ${
        lastAnswer.isCorrect 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">
            {lastAnswer.isCorrect ? '✅' : '❌'}
          </span>
          <span className="text-lg font-semibold">
            {lastAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
          </span>
          {!lastAnswer.isCorrect && (
            <span className="text-sm">
              (Answer: {lastAnswer.correctAnswer})
            </span>
          )}
        </div>
        {lastAnswer.isCorrect && lastAnswer.points && (
          <div className="text-center mt-2">
            <span className="text-sm font-medium">+{lastAnswer.points} points</span>
            {lastAnswer.timeSpent < 5000 && (
              <span className="text-xs ml-2">🚀 Fast!</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-center">
      {/* Question Number */}
      <div className="text-sm text-gray-500 mb-2">
        Question {question.questionNumber}
      </div>
      
      {/* Main Question */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
        <div className="text-5xl md:text-6xl font-bold text-gray-800 font-mono">
          {question.num1} {getOperatorSymbol(question.operation)} {question.num2} = ?
        </div>
      </div>

      {/* Question Text Alternative */}
      <div className="text-lg text-gray-600 mb-4">
        What is {question.num1} {getOperatorSymbol(question.operation)} {question.num2}?
      </div>

      {/* Feedback Display */}
      {getFeedbackDisplay()}
    </div>
  );
};

export default ArithmeticQuestion;
