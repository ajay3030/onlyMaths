// In ArithmeticInput.jsx - BETTER question detection
import React, { useState, useEffect, useRef } from 'react';

const ArithmeticInput = ({ onSubmit, disabled = false, questionType = 'input', options = [], currentQuestion }) => {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [lastQuestionId, setLastQuestionId] = useState(null);
  const inputRef = useRef(null);

  // FIXED: Clear input when we get a new question
  useEffect(() => {
    if (currentQuestion && currentQuestion.id !== lastQuestionId) {
      console.log('🔄 New question detected, clearing input. Old:', lastQuestionId, 'New:', currentQuestion.id);
      setAnswer('');
      setSelectedOption(null);
      setLastQuestionId(currentQuestion.id);
      
      // Focus input for new question
      if (!disabled && questionType === 'input' && inputRef.current) {
        setTimeout(() => inputRef.current.focus(), 100);
      }
    }
  }, [currentQuestion?.id, lastQuestionId, disabled, questionType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;

    const userAnswer = questionType === 'multiple-choice' ? selectedOption : answer.trim();
    if (userAnswer === '' || userAnswer === null) return;

    console.log('✅ Submitting answer:', userAnswer, 'for question:', currentQuestion?.id);
    onSubmit(parseFloat(userAnswer));
    
    // Don't clear here - let new question effect handle it
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setAnswer(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <label htmlFor="answer" className="block text-lg text-gray-600 mb-4">
          Enter your answer:
        </label>
        
        <div className="max-w-xs mx-auto">
          <input
            ref={inputRef}
            id="answer"
            type="text"
            value={answer}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!!disabled}
            placeholder="Your answer..."
            autoComplete="off"
            className={`w-full text-center text-3xl font-bold py-4 px-6 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
              disabled 
                ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-white border-purple-300 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200'
            }`}
          />
        </div>
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          disabled={!!disabled || !answer.trim()}
          className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
            disabled || !answer.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:scale-105 hover:shadow-lg transform'
          }`}
        >
          Submit Answer
        </button>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">💡 Press Enter to submit</p>
      </div>
      
      {/* DEBUG - Remove after fixing */}
      <div className="text-center text-xs text-gray-400">
        Q: {currentQuestion?.id} | Answer: "{answer}" | Last Q: {lastQuestionId}
      </div>
    </form>
  );
};

export default ArithmeticInput;
