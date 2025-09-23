// src/services/gameApi.js
import { apiService } from './api';

export const gameApi = {
  // Save game result
  async saveGameResult(gameResult) {
    const response = await apiService.post('/games/results', gameResult);
    return response.data;
  },

  // Get user's game history
  async getGameHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/games/results/history${queryString ? `?${queryString}` : ''}`;
    const response = await apiService.get(endpoint);
    return response.data;
  },

  // Get specific game result
  async getGameResult(resultId) {
    const response = await apiService.get(`/games/results/${resultId}`);
    return response.data.result;
  },

  // Get user statistics
  async getUserStats() {
    const response = await apiService.get('/games/stats');
    return response.data;
  },

  // Get leaderboard
  async getLeaderboard(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/games/leaderboard${queryString ? `?${queryString}` : ''}`;
    const response = await apiService.get(endpoint);
    return response.data;
  }
};
