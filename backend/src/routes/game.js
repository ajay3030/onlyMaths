// src/routes/game.js
const express = require('express');
const GameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/auth');
const gameValidation = require('../middleware/gameValidation');

const router = express.Router();

// All game routes require authentication
router.use(authMiddleware);

// Game result routes
router.post('/results', gameValidation.saveResult, GameController.saveGameResult);
router.get('/results/history', gameValidation.getHistory, GameController.getGameHistory);
router.get('/results/:resultId', GameController.getGameResult);

// Statistics routes
router.get('/stats', GameController.getUserStats);
router.get('/leaderboard', gameValidation.getLeaderboard, GameController.getLeaderboard);

module.exports = router;
