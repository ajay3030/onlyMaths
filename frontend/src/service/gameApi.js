// src/service/gameApi.js
import { apiService } from './api';

export const gameApi = {
  // Save game result to backend
  async saveGameResult(gameResult) {
    console.log('💾 Saving game result to backend...', gameResult.gameType);
    const response = await apiService.post('/games/results', gameResult);
    console.log('✅ Game result saved successfully');
    return response.data;
  },

  // Get user's game history with pagination
  async getGameHistory(params = {}) {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: 'completedAt',
      sortOrder: 'desc',
      ...params
    };
    
    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = `/games/results/history${queryString ? `?${queryString}` : ''}`;
    
    console.log('📊 Fetching game history...', queryParams);
    const response = await apiService.get(endpoint);
    console.log('✅ Game history retrieved:', response.data.results.length, 'games');
    return response.data;
  },

  // Get specific game result by ID
  async getGameResult(resultId) {
    console.log('🔍 Fetching game result:', resultId);
    const response = await apiService.get(`/games/results/${resultId}`);
    console.log('✅ Game result retrieved');
    return response.data.result;
  },

  // Get user statistics and analytics
  async getUserStats() {
    console.log('📈 Fetching user statistics...');
    const response = await apiService.get('/games/stats');
    console.log('✅ User statistics retrieved:', {
      totalGames: response.data.overall.totalGames,
      averageScore: Math.round(response.data.overall.averageScore || 0)
    });
    return response.data;
  },

  // Get leaderboard data
  async getLeaderboard(params = {}) {
    const queryParams = {
      limit: 10,
      period: 'all',
      ...params
    };
    
    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = `/games/leaderboard${queryString ? `?${queryString}` : ''}`;
    
    console.log('🏆 Fetching leaderboard...', queryParams);
    const response = await apiService.get(endpoint);
    console.log('✅ Leaderboard retrieved:', response.data.leaderboard.length, 'entries');
    return response.data;
  },

  // Helper function to format game result for backend
  formatGameResultForBackend(gameResult, gameTemplate) {
    return {
      gameId: gameResult.gameId,
      gameType: gameResult.gameType,
      gameName: gameResult.gameName,
      difficulty: gameResult.difficulty,
      totalScore: gameResult.totalScore,
      totalQuestions: gameResult.totalQuestions,
      correctAnswers: gameResult.correctAnswers,
      wrongAnswers: gameResult.wrongAnswers,
      accuracy: gameResult.accuracy,
      totalTime: gameResult.totalTime,
      averageTimePerQuestion: gameResult.averageTimePerQuestion,
      bestStreak: gameResult.bestStreak,
      finalStreak: gameResult.streak,
      questions: gameResult.questions || [], // Detailed question data (optional)
      gameConfig: gameTemplate?.config || {},
      completedAt: gameResult.completedAt,
      // Additional calculated fields
      pointsFromSpeed: gameResult.pointsFromSpeed || 0,
      pointsFromAccuracy: gameResult.pointsFromAccuracy || 0,
      pointsFromStreak: gameResult.pointsFromStreak || 0
    };
  },

  // Batch operations for future use
  async getMultipleGameResults(resultIds) {
    console.log('📋 Fetching multiple game results...', resultIds.length);
    const promises = resultIds.map(id => this.getGameResult(id));
    const results = await Promise.all(promises);
    console.log('✅ Multiple game results retrieved');
    return results;
  },

  // Get games by specific criteria
  async getGamesByType(gameType, params = {}) {
    const queryParams = {
      gameType,
      ...params
    };
    
    console.log('🎯 Fetching games by type:', gameType);
    return await this.getGameHistory(queryParams);
  },

  // Get recent games (last N games)
  async getRecentGames(limit = 5) {
    console.log('⏰ Fetching recent games...', limit);
    return await this.getGameHistory({ 
      limit,
      sortBy: 'completedAt',
      sortOrder: 'desc'
    });
  },

  // Get best scores
  async getBestScores(gameType = null) {
    const params = gameType ? { gameType } : {};
    console.log('🌟 Fetching best scores...', gameType || 'all games');
    
    return await this.getGameHistory({
      ...params,
      sortBy: 'totalScore',
      sortOrder: 'desc',
      limit: 10
    });
  }
};
