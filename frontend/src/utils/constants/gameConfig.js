// src/utils/constants/gameConfig.js
export const GAMES_CONFIG = {
  'arithmetic-game': {
    name: 'Arithmetic Game',
    icon: '🔢',
    color: 'from-green-400 to-green-600',
    description: 'Practice basic math operations',
    difficulty: 'Beginner',
    duration: 300, // 5 minutes
    category: 'arithmetic'
  },
  'arithmetic-pro': {
    name: 'Arithmetic Pro',
    icon: '🧮',
    color: 'from-blue-400 to-blue-600',
    description: 'Advanced arithmetic challenges',
    difficulty: 'Advanced',
    duration: 480, // 8 minutes
    category: 'arithmetic'
  },
  'sequence-game': {
    name: 'Sequence Game',
    icon: '🔄',
    color: 'from-purple-400 to-purple-600',
    description: 'Find patterns and sequences',
    difficulty: 'Intermediate',
    duration: 360, // 6 minutes
    category: 'patterns'
  },
  'optiver-80-8': {
    name: 'Optiver 80 in 8',
    icon: '⚡',
    color: 'from-orange-400 to-red-500',
    description: '80 questions in 8 minutes',
    difficulty: 'Expert',
    duration: 480, // 8 minutes
    category: 'speed'
  },
  'memory-game': {
    name: 'Memory Game',
    icon: '🧠',
    color: 'from-pink-400 to-pink-600',
    description: 'Test your memory skills',
    difficulty: 'Beginner',
    duration: 240, // 4 minutes
    category: 'memory'
  },
  'risk-game': {
    name: 'Risk Game',
    icon: '🎯',
    color: 'from-indigo-400 to-purple-600',
    description: 'Strategic math challenges',
    difficulty: 'Advanced',
    duration: 600, // 10 minutes
    category: 'strategy'
  }
};

export const DIFFICULTY_COLORS = {
  'Beginner': 'text-green-600 bg-green-100',
  'Intermediate': 'text-yellow-600 bg-yellow-100',
  'Advanced': 'text-orange-600 bg-orange-100',
  'Expert': 'text-red-600 bg-red-100'
};
