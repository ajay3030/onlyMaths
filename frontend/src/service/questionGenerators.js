// src/services/questionGenerators.js
// Utility functions
const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomChoice = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const calculateAnswer = (num1, operation, num2) => {
  switch (operation) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return Math.round((num1 / num2) * 100) / 100; // Round to 2 decimals
    default:
      return 0;
  }
};

const generateMultipleChoiceOptions = (correctAnswer, count = 4) => {
  const options = [correctAnswer];
  const range = Math.max(Math.abs(correctAnswer * 0.5), 10);
  
  while (options.length < count) {
    const offset = randomBetween(-range, range);
    const option = correctAnswer + offset;
    
    if (option !== correctAnswer && !options.includes(option) && option >= 0) {
      options.push(option);
    }
  }
  
  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
};

// Main question generator for arithmetic
export const arithmeticGenerator = (config) => {
  const questions = [];
  
  for (let i = 0; i < config.questionCount; i++) {
    let num1, num2, operation, answer;
    
    // Generate valid question (avoid negative results if not allowed)
    do {
      operation = randomChoice(config.operations);
      num1 = randomBetween(config.numberRange.min, config.numberRange.max);
      num2 = randomBetween(config.numberRange.min, config.numberRange.max);
      
      // For division, ensure num1 is divisible by num2
      if (operation === '/') {
        num1 = num2 * randomBetween(2, 10); // Make it divisible
      }
      
      answer = calculateAnswer(num1, operation, num2);
    } while (!config.allowNegative && answer < 0);
    
    const question = {
      id: `q_${i + 1}`,
      questionNumber: i + 1,
      num1,
      num2,
      operation,
      questionText: `${num1} ${operation} ${num2}`,
      answer,
      userAnswer: null,
      isCorrect: null,
      timeSpent: 0,
      points: 0,
      ...(config.multipleChoice && {
        options: generateMultipleChoiceOptions(answer)
      })
    };
    
    questions.push(question);
  }
  
  return questions;
};

// Export generators for other game types (future)
export const memoryGenerator = (config) => {
  // TODO: Implement memory game generator
  return [];
};

export const sequenceGenerator = (config) => {
  // TODO: Implement sequence game generator
  return [];
};

export default {
  arithmetic: arithmeticGenerator,
  memory: memoryGenerator,
  sequence: sequenceGenerator
};
