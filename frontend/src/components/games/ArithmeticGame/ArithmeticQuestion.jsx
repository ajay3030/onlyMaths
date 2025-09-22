// src/components/games/ArithmeticGame/ArithmeticQuestion.jsx
import React from 'react';

const ArithmeticQuestion = ({ question, showFeedback, lastAnswer }) => {

  console.log('🎯 ArithmeticQuestion render:', {
    questionId: question?.id,
    questionNumber: question?.questionNumber,
    num1: question?.num1,
    num2: question?.num2,
    operation: question?.operation,
    questionText: question?.questionText
  });

  const getOperatorSymbol = (operator) => {
    const symbols = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷'
    };
    return symbols[operator] || operator;
  };

  if (!question || question.num1 === undefined || question.num2 === undefined || !question.operation) {
    console.error('❌ Invalid question data:', question);
    return (
      <div className="text-center">
        <div className="bg-red-50 rounded-2xl p-8 mb-6">
          <div className="text-2xl text-red-600 font-bold">
            Question Error: Invalid question data
          </div>
        </div>
      </div>
    );
  }

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

      {/* DEBUG INFO - Remove after fixing */}
      <div className="text-xs text-gray-400 mb-4">
        Debug: ID={question.id} | Q#{question.questionNumber} | {question.num1} {question.operation} {question.num2}
      </div>

      {/* Feedback Display */}
      {getFeedbackDisplay()}
    </div>
  );
};

export default ArithmeticQuestion;
