// src/service/testGameApi.js - TEMPORARY TEST FILE
import { gameApi } from './gameApi';

export const testGameApi = async () => {
  console.log('🧪 Testing Game API Service...');

  try {
    // Test 1: Save a sample game result
    const sampleGameResult = {
      gameId: 'arithmetic-game',
      gameType: 'arithmetic',
      gameName: 'Arithmetic Game',
      difficulty: 'medium',
      totalScore: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      wrongAnswers: 2,
      accuracy: 80,
      totalTime: 120000, // 2 minutes in milliseconds
      averageTimePerQuestion: 12000, // 12 seconds per question
      bestStreak: 5,
      completedAt: new Date().toISOString()
    };

    console.log('📝 Testing save game result...');
    const savedResult = await gameApi.saveGameResult(sampleGameResult);
    console.log('✅ Save test passed:', savedResult);

    // Test 2: Get game history
    console.log('📚 Testing get game history...');
    const history = await gameApi.getGameHistory({ limit: 5 });
    console.log('✅ History test passed:', history.results.length, 'games found');

    // Test 3: Get user stats
    console.log('📊 Testing get user stats...');
    const stats = await gameApi.getUserStats();
    console.log('✅ Stats test passed:', stats.overall);

    // Test 4: Get leaderboard
    console.log('🏆 Testing get leaderboard...');
    const leaderboard = await gameApi.getLeaderboard({ limit: 5 });
    console.log('✅ Leaderboard test passed:', leaderboard.leaderboard.length, 'entries');

    console.log('🎉 All Game API tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Game API test failed:', error);
    return false;
  }
};
