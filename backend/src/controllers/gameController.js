// src/controllers/gameController.js
const GameResult = require('../models/GameResult');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

class GameController {
  // Save game result
  static async saveGameResult(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const userId = req.user.id;
      const gameData = req.body;

      // Create game result
      const gameResult = new GameResult({
        user: userId,
        ...gameData
      });

      await gameResult.save();

      // Update user statistics
      await GameController.updateUserStats(userId, gameResult);

      ApiResponse.success(res, {
        gameResult: gameResult.toJSON(),
        message: 'Game result saved successfully'
      }, 'Game result saved', 201);

    } catch (error) {
      console.error('Save game result error:', error);
      ApiResponse.error(res, 'Failed to save game result', 500);
    }
  }

  // Get user's game history
  static async getGameHistory(req, res) {
    try {
      const userId = req.user.id;
      const { 
        page = 1, 
        limit = 10, 
        gameType = null, 
        sortBy = 'completedAt', 
        sortOrder = 'desc' 
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Build filter
      const filter = { user: userId };
      if (gameType) {
        filter.gameType = gameType;
      }

      // Get results with pagination
      const results = await GameResult.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-questions') // Exclude detailed questions for performance
        .lean();

      // Get total count for pagination
      const totalResults = await GameResult.countDocuments(filter);
      const totalPages = Math.ceil(totalResults / parseInt(limit));

      ApiResponse.success(res, {
        results,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalResults,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }, 'Game history retrieved successfully');

    } catch (error) {
      console.error('Get game history error:', error);
      ApiResponse.error(res, 'Failed to get game history', 500);
    }
  }

  // Get detailed game result
  static async getGameResult(req, res) {
    try {
      const { resultId } = req.params;
      const userId = req.user.id;

      const result = await GameResult.findOne({
        _id: resultId,
        user: userId
      });

      if (!result) {
        return ApiResponse.error(res, 'Game result not found', 404);
      }

      ApiResponse.success(res, { result }, 'Game result retrieved successfully');

    } catch (error) {
      console.error('Get game result error:', error);
      ApiResponse.error(res, 'Failed to get game result', 500);
    }
  }

  // Get user statistics
  static async getUserStats(req, res) {
    try {
      const userId = req.user.id;

      // Get overall statistics
      const overallStats = await GameResult.getUserStats(userId);
      
      // Get game type statistics
      const gameTypeStats = await GameResult.getGameTypeStats(userId);

      // Get recent performance (last 10 games)
      const recentGames = await GameResult.find({ user: userId })
        .sort({ completedAt: -1 })
        .limit(10)
        .select('totalScore accuracy completedAt gameType')
        .lean();

      // Calculate improvement trend
      const improvement = GameController.calculateImprovement(recentGames);

      ApiResponse.success(res, {
        overall: overallStats,
        byGameType: gameTypeStats,
        recentGames,
        improvement,
        user: req.user.getPublicProfile()
      }, 'User statistics retrieved successfully');

    } catch (error) {
      console.error('Get user stats error:', error);
      ApiResponse.error(res, 'Failed to get user statistics', 500);
    }
  }

  // Get leaderboard
  static async getLeaderboard(req, res) {
    try {
      const { 
        gameType = null, 
        period = 'all', // all, week, month
        limit = 10 
      } = req.query;

      // Build date filter based on period
      const dateFilter = {};
      if (period === 'week') {
        dateFilter.completedAt = { 
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        };
      } else if (period === 'month') {
        dateFilter.completedAt = { 
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
        };
      }

      // Build match filter
      const matchFilter = { ...dateFilter };
      if (gameType) {
        matchFilter.gameType = gameType;
      }

      const pipeline = [
        { $match: matchFilter },
        {
          $group: {
            _id: '$user',
            bestScore: { $max: '$totalScore' },
            totalGames: { $sum: 1 },
            averageScore: { $avg: '$totalScore' },
            averageAccuracy: { $avg: '$accuracy' },
            lastPlayed: { $max: '$completedAt' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            name: '$user.name',
            avatar: '$user.avatar',
            bestScore: 1,
            totalGames: 1,
            averageScore: { $round: ['$averageScore', 1] },
            averageAccuracy: { $round: ['$averageAccuracy', 1] },
            lastPlayed: 1
          }
        },
        { $sort: { bestScore: -1 } },
        { $limit: parseInt(limit) }
      ];

      const leaderboard = await GameResult.aggregate(pipeline);

      // Add rank to each entry
      const rankedLeaderboard = leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

      ApiResponse.success(res, {
        leaderboard: rankedLeaderboard,
        period,
        gameType: gameType || 'all'
      }, 'Leaderboard retrieved successfully');

    } catch (error) {
      console.error('Get leaderboard error:', error);
      ApiResponse.error(res, 'Failed to get leaderboard', 500);
    }
  }

  // Helper method to update user statistics
  static async updateUserStats(userId, gameResult) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      // Update game stats
      user.gameStats.totalGamesPlayed += 1;
      user.gameStats.totalScore += gameResult.totalScore;
      
      if (gameResult.totalScore > user.gameStats.bestScore) {
        user.gameStats.bestScore = gameResult.totalScore;
      }

      if (gameResult.bestStreak > user.gameStats.bestStreak) {
        user.gameStats.bestStreak = gameResult.bestStreak;
      }

      // Recalculate average accuracy
      const userStats = await GameResult.getUserStats(userId);
      user.gameStats.averageAccuracy = Math.round(userStats.averageAccuracy);

      await user.save();
    } catch (error) {
      console.error('Update user stats error:', error);
    }
  }

  // Helper method to calculate improvement trend
  static calculateImprovement(recentGames) {
    if (recentGames.length < 2) {
      return { trend: 'insufficient-data', change: 0 };
    }

    const recent = recentGames.slice(0, 5); // Last 5 games
    const previous = recentGames.slice(5, 10); // Previous 5 games

    const recentAvg = recent.reduce((sum, game) => sum + game.totalScore, 0) / recent.length;
    const previousAvg = previous.length > 0 
      ? previous.reduce((sum, game) => sum + game.totalScore, 0) / previous.length
      : recentAvg;

    const change = ((recentAvg - previousAvg) / previousAvg) * 100;

    return {
      trend: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable',
      change: Math.round(change),
      recentAverage: Math.round(recentAvg),
      previousAverage: Math.round(previousAvg)
    };
  }
}

module.exports = GameController;
