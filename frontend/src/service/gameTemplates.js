// src/services/gameTemplates.js
export const gameTemplates = {
  'arithmetic-basic': {
    id: 'arithmetic-basic',
    name: 'Basic Arithmetic',
    description: 'Simple addition and subtraction problems',
    type: 'arithmetic',
    category: 'math',
    difficulty: 'easy',
    icon: '🔢',
    config: {
      operations: ['+', '-'],
      numberRange: { min: 1, max: 20 },
      questionCount: 10,
      timePerQuestion: 15, // seconds
      timeLimit: 150, // total seconds
      multipleChoice: false,
      allowNegative: false
    },
    scoring: {
      basePoints: 10,
      timeBonus: 5,
      streakBonus: 2,
      difficultyMultiplier: 1
    },
    isActive: true,
    createdAt: new Date().toISOString()
  },
  
  'arithmetic-advanced': {
    id: 'arithmetic-advanced',
    name: 'Advanced Arithmetic',
    description: 'Multiplication and division challenges',
    type: 'arithmetic',
    category: 'math',
    difficulty: 'hard',
    icon: '🧮',
    config: {
      operations: ['*', '/'],
      numberRange: { min: 2, max: 12 },
      questionCount: 15,
      timePerQuestion: 20,
      timeLimit: 300,
      multipleChoice: false,
      allowNegative: false
    },
    scoring: {
      basePoints: 15,
      timeBonus: 8,
      streakBonus: 3,
      difficultyMultiplier: 2
    },
    isActive: true,
    createdAt: new Date().toISOString()
  }
};

export default gameTemplates;
