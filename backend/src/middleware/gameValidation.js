// src/middleware/gameValidation.js
const { body, query } = require('express-validator');

const gameValidation = {
  saveResult: [
    body('gameId').notEmpty().withMessage('Game ID is required'),
    body('gameType').isIn(['arithmetic', 'memory', 'sequence']).withMessage('Invalid game type'),
    body('gameName').notEmpty().withMessage('Game name is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard', 'mixed']).withMessage('Invalid difficulty'),
    body('totalScore').isInt({ min: 0 }).withMessage('Total score must be a non-negative integer'),
    body('totalQuestions').isInt({ min: 1 }).withMessage('Total questions must be at least 1'),
    body('correctAnswers').isInt({ min: 0 }).withMessage('Correct answers must be non-negative'),
    body('wrongAnswers').isInt({ min: 0 }).withMessage('Wrong answers must be non-negative'),
    body('accuracy').isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0-100'),
    body('totalTime').isInt({ min: 0 }).withMessage('Total time must be non-negative'),
    body('averageTimePerQuestion').isFloat({ min: 0 }).withMessage('Average time must be non-negative'),
    body('bestStreak').optional().isInt({ min: 0 }).withMessage('Best streak must be non-negative'),
    body('completedAt').optional().isISO8601().withMessage('Invalid completion date')
  ],

  getHistory: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1-50'),
    query('gameType').optional().isIn(['arithmetic', 'memory', 'sequence']).withMessage('Invalid game type'),
    query('sortBy').optional().isIn(['completedAt', 'totalScore', 'accuracy']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
  ],

  getLeaderboard: [
    query('gameType').optional().isIn(['arithmetic', 'memory', 'sequence']).withMessage('Invalid game type'),
    query('period').optional().isIn(['all', 'week', 'month']).withMessage('Invalid period'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
  ]
};

module.exports = gameValidation;
