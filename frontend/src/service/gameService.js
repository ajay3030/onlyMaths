// src/services/gameService.js
import { gameTemplates } from './gameTemplates';
import GameEngine from './gameEngine';

export const gameService = {
  // Get all available games
  getAllGames: () => {
    try {
      const defaultGames = gameTemplates;
      const customGames = JSON.parse(localStorage.getItem('onlymaths_custom_games') || '{}');
      return { ...defaultGames, ...customGames };
    } catch (error) {
      console.error('Failed to load games:', error);
      return gameTemplates;
    }
  },

  // Get game by ID
  getGameById: (gameId) => {
    const allGames = gameService.getAllGames();
    return allGames[gameId] || null;
  },

  // Create new game instance
  createGameInstance: (gameId) => {
    const template = gameService.getGameById(gameId);
    if (!template) {
      throw new Error(`Game template not found: ${gameId}`);
    }
    
    return new GameEngine(template);
  },

  // Get games by category
  getGamesByCategory: (category) => {
    const allGames = gameService.getAllGames();
    return Object.values(allGames).filter(game => game.category === category);
  },

  // Get games by type
  getGamesByType: (type) => {
    const allGames = gameService.getAllGames();
    return Object.values(allGames).filter(game => game.type === type);
  },

  // Get user's game history
  getGameHistory: (userId = null) => {
    try {
      const allResults = JSON.parse(localStorage.getItem('onlymaths_game_results') || '[]');
      
      if (userId) {
        return allResults.filter(result => result.userId === userId);
      }
      
      return allResults;
    } catch (error) {
      console.error('Failed to load game history:', error);
      return [];
    }
  },

  // Get game statistics
  getGameStats: (gameId) => {
    try {
      const results = gameService.getGameHistory();
      const gameResults = results.filter(r => r.gameId === gameId);
      
      if (gameResults.length === 0) {
        return {
          totalPlays: 0,
          averageScore: 0,
          bestScore: 0,
          averageAccuracy: 0,
          averageTime: 0
        };
      }
      
      const totalPlays = gameResults.length;
      const averageScore = Math.round(gameResults.reduce((sum, r) => sum + r.totalScore, 0) / totalPlays);
      const bestScore = Math.max(...gameResults.map(r => r.totalScore));
      const averageAccuracy = Math.round(gameResults.reduce((sum, r) => sum + r.accuracy, 0) / totalPlays);
      const averageTime = Math.round(gameResults.reduce((sum, r) => sum + r.totalTime, 0) / totalPlays);
      
      return {
        totalPlays,
        averageScore,
        bestScore,
        averageAccuracy,
        averageTime
      };
    } catch (error) {
      console.error('Failed to calculate game stats:', error);
      return {
        totalPlays: 0,
        averageScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        averageTime: 0
      };
    }
  },

  // Get leaderboard for a game
  getLeaderboard: (gameId, limit = 10) => {
    try {
      const results = gameService.getGameHistory();
      const gameResults = results.filter(r => r.gameId === gameId);
      
      return gameResults
        .sort((a, b) => {
          // Sort by score first, then by accuracy, then by time
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy;
          }
          return a.totalTime - b.totalTime; // Faster time is better
        })
        .slice(0, limit)
        .map((result, index) => ({
          rank: index + 1,
          score: result.totalScore,
          accuracy: result.accuracy,
          time: result.totalTime,
          date: result.completedAt,
          playerName: result.playerName || 'Anonymous'
        }));
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      return [];
    }
  },

  // Clear game history (for testing)
  clearGameHistory: () => {
    try {
      localStorage.removeItem('onlymaths_game_results');
      console.log('Game history cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear game history:', error);
      return false;
    }
  }
};

export default gameService;
