// src/models/GameResult.js
const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true // Index for faster queries
  },
  gameId: {
    type: String,
    required: [true, 'Game ID is required'],
    index: true
  },
  gameType: {
    type: String,
    required: [true, 'Game type is required'],
    enum: ['arithmetic', 'memory', 'sequence'], // Add more as you create games
    index: true
  },
  gameName: {
    type: String,
    required: [true, 'Game name is required']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['easy', 'medium', 'hard', 'mixed']
  },
  
  // Game Performance Data
  totalScore: {
    type: Number,
    required: [true, 'Total score is required'],
    min: [0, 'Score cannot be negative'],
    index: true
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions is required'],
    min: [1, 'Must have at least 1 question']
  },
  correctAnswers: {
    type: Number,
    required: [true, 'Correct answers is required'],
    min: [0, 'Correct answers cannot be negative']
  },
  wrongAnswers: {
    type: Number,
    required: [true, 'Wrong answers is required'],
    min: [0, 'Wrong answers cannot be negative']
  },
  accuracy: {
    type: Number,
    required: [true, 'Accuracy is required'],
    min: [0, 'Accuracy cannot be negative'],
    max: [100, 'Accuracy cannot exceed 100%']
  },
  
  // Time Performance
  totalTime: {
    type: Number,
    required: [true, 'Total time is required'],
    min: [0, 'Time cannot be negative']
  },
  averageTimePerQuestion: {
    type: Number,
    required: [true, 'Average time per question is required'],
    min: [0, 'Average time cannot be negative']
  },
  
  // Streak Data
  bestStreak: {
    type: Number,
    default: 0,
    min: [0, 'Best streak cannot be negative']
  },
  finalStreak: {
    type: Number,
    default: 0,
    min: [0, 'Final streak cannot be negative']
  },
  
  // Detailed Questions Data (optional, for analysis)
  questions: [{
    questionNumber: Number,
    question: String,
    correctAnswer: mongoose.Schema.Types.Mixed,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number,
    pointsEarned: Number
  }],
  
  // Game Configuration
  gameConfig: {
    timePerQuestion: Number,
    timeLimit: Number,
    questionCount: Number,
    operations: [String], // For arithmetic games
    numberRange: {
      min: Number,
      max: Number
    }
  },
  
  // Completion Status
  completedAt: {
    type: Date,
    required: [true, 'Completion date is required'],
    default: Date.now,
    index: true
  },
  isCompleted: {
    type: Boolean,
    default: true
  },
  
  // Performance Ratings (calculated)
  performanceRating: {
    type: String,
    enum: ['excellent', 'good', 'average', 'needs-improvement'],
    default: 'average'
  },
  pointsFromSpeed: {
    type: Number,
    default: 0
  },
  pointsFromAccuracy: {
    type: Number,
    default: 0
  },
  pointsFromStreak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for common queries
gameResultSchema.index({ user: 1, gameType: 1 });
gameResultSchema.index({ user: 1, completedAt: -1 });
gameResultSchema.index({ gameType: 1, totalScore: -1 });
gameResultSchema.index({ user: 1, totalScore: -1 });

// Virtual for calculated fields
gameResultSchema.virtual('scorePerMinute').get(function() {
  const timeInMinutes = this.totalTime / (1000 * 60);
  return timeInMinutes > 0 ? Math.round(this.totalScore / timeInMinutes) : 0;
});

// Calculate performance rating before saving
gameResultSchema.pre('save', function(next) {
  if (this.accuracy >= 90 && this.bestStreak >= 5) {
    this.performanceRating = 'excellent';
  } else if (this.accuracy >= 75 && this.bestStreak >= 3) {
    this.performanceRating = 'good';
  } else if (this.accuracy >= 60) {
    this.performanceRating = 'average';
  } else {
    this.performanceRating = 'needs-improvement';
  }
  next();
});

// Static method to get user statistics
gameResultSchema.statics.getUserStats = async function(userId) {
  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalGames: { $sum: 1 },
        totalScore: { $sum: '$totalScore' },
        averageScore: { $avg: '$totalScore' },
        bestScore: { $max: '$totalScore' },
        averageAccuracy: { $avg: '$accuracy' },
        totalCorrectAnswers: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' },
        bestStreak: { $max: '$bestStreak' },
        averageTimePerGame: { $avg: '$totalTime' }
      }
    }
  ];

  const stats = await this.aggregate(pipeline);
  return stats[0] || {
    totalGames: 0,
    totalScore: 0,
    averageScore: 0,
    bestScore: 0,
    averageAccuracy: 0,
    totalCorrectAnswers: 0,
    totalQuestions: 0,
    bestStreak: 0,
    averageTimePerGame: 0
  };
};

// Static method to get game type statistics
gameResultSchema.statics.getGameTypeStats = async function(userId) {
  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$gameType',
        count: { $sum: 1 },
        averageScore: { $avg: '$totalScore' },
        bestScore: { $max: '$totalScore' },
        averageAccuracy: { $avg: '$accuracy' },
        lastPlayed: { $max: '$completedAt' }
      }
    },
    { $sort: { count: -1 } }
  ];

  return await this.aggregate(pipeline);
};

module.exports = mongoose.model('GameResult', gameResultSchema);
