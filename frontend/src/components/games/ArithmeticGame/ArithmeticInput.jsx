// src/components/games/ArithmeticGame/ArithmeticInput.jsx
import React, { useState, useEffect, useRef } from 'react';

const ArithmeticInput = ({ onSubmit, disabled, questionType = 'input', options = [] }) => {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const inputRef = useRef(null);

  // Focus input when component mounts or question changes
  useEffect(() => {
    if (!disabled && questionType === 'input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, questionType]);

  // Clear input when new question loads
  useEffect(() => {
    setAnswer('');
    setSelectedOption(null);
  }, [options]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;

    const userAnswer = questionType === 'multiple-choice' ? selectedOption : answer.trim();
    
    if (userAnswer === '' || userAnswer === null) return;

    onSubmit(parseFloat(userAnswer));
    setAnswer('');
    setSelectedOption(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow numbers, decimal point, and negative sign
    if (/^-?\d*\.?\d*$/.test(value)) {
      setAnswer(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (questionType === 'multiple-choice') {
    return (
      <div className="space-y-4">
        <p className="text-center text-gray-600 mb-6">Choose the correct answer:</p>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(option)}
              disabled={disabled}
              className={`p-4 rounded-lg text-xl font-semibold transition-all duration-200 ${
                selectedOption === option
                  ? 'bg-purple-500 text-white transform scale-105'
                  : 'bg-gray-100 text-gray-800 hover:bg-purple-100 hover:scale-102'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={disabled || selectedOption === null}
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
              disabled || selectedOption === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:scale-105 hover:shadow-lg'
            }`}
          >
            Submit Answer
          </button>
        </div>
      </div>
    );
  }

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
            disabled={disabled}
            placeholder="Your answer..."
            className={`w-full text-center text-3xl font-bold py-4 px-6 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
              disabled 
                ? 'bg-gray-100 border-gray-300 text-gray-500' 
                : 'bg-white border-purple-300 text-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-200'
            }`}
          />
        </div>
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
            disabled || !answer.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:scale-105 hover:shadow-lg transform'
          }`}
        >
          Submit Answer
        </button>
      </div>
      
      {/* Hint for keyboard users */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Press Enter to submit
        </p>
      </div>
    </form>
  );
};

export default ArithmeticInput;
