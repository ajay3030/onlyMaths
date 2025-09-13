// src/services/mockDataService.js
// Mock data generator
const generateMockStats = (userId) => {
    console.log(userId);
  const baseStats = {
    totalGamesPlayed: Math.floor(Math.random() * 50) + 10,
    totalScore: 0,
    averageScore: 0,
    bestScore: Math.floor(Math.random() * 1000) + 500,
    currentStreak: Math.floor(Math.random() * 5),
    bestStreak: Math.floor(Math.random() * 15) + 5,
    level: 'Intermediate',
    experience: Math.floor(Math.random() * 5000) + 1000,
    joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  baseStats.totalScore = baseStats.totalGamesPlayed * (Math.floor(Math.random() * 200) + 100);
  baseStats.averageScore = Math.round(baseStats.totalScore / baseStats.totalGamesPlayed);
  
  return baseStats;
};

const generateMockGameHistory = (userId) => {
    console.log(userId);
  const games = ['arithmetic-game', 'arithmetic-pro', 'sequence-game', 'memory-game'];
  const history = [];
  
  for (let i = 0; i < 10; i++) {
    history.push({
      id: Date.now() + i,
      gameType: games[Math.floor(Math.random() * games.length)],
      gameName: games[Math.floor(Math.random() * games.length)].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: Math.floor(Math.random() * 500) + 50,
      duration: Math.floor(Math.random() * 300) + 60, // seconds
      accuracy: Math.floor(Math.random() * 30) + 70, // percentage
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)]
    });
  }
  
  return history.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const generateMockAchievements = (userId) => {
    console.log(userId);
  return [
    {
      id: 'first-game',
      name: 'First Steps',
      description: 'Complete your first game',
      icon: '🎯',
      earned: true,
      earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'score-500',
      name: 'High Scorer',
      description: 'Score 500+ points in a single game',
      icon: '🏆',
      earned: true,
      earnedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'streak-5',
      name: 'On Fire',
      description: 'Win 5 games in a row',
      icon: '🔥',
      earned: Math.random() > 0.5,
      earnedDate: Math.random() > 0.5 ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() : null
    },
    {
      id: 'daily-player',
      name: 'Daily Dedication',
      description: 'Play for 7 consecutive days',
      icon: '📅',
      earned: false,
      earnedDate: null
    }
  ];
};

// LocalStorage keys
const STORAGE_KEYS = {
  STATS: 'onlymaths_stats',
  HISTORY: 'onlymaths_history',
  ACHIEVEMENTS: 'onlymaths_achievements'
};

// Mock API service
export const mockDataService = {
  // Get user stats
  getUserStats: async (userId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to get from localStorage first
    const cachedStats = localStorage.getItem(`${STORAGE_KEYS.STATS}_${userId}`);
    const cachedHistory = localStorage.getItem(`${STORAGE_KEYS.HISTORY}_${userId}`);
    const cachedAchievements = localStorage.getItem(`${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`);
    
    if (cachedStats && cachedHistory && cachedAchievements) {
      return {
        stats: JSON.parse(cachedStats),
        gameHistory: JSON.parse(cachedHistory),
        achievements: JSON.parse(cachedAchievements)
      };
    }
    
    // Generate new mock data
    const stats = generateMockStats(userId);
    const gameHistory = generateMockGameHistory(userId);
    const achievements = generateMockAchievements(userId);
    
    // Cache in localStorage
    localStorage.setItem(`${STORAGE_KEYS.STATS}_${userId}`, JSON.stringify(stats));
    localStorage.setItem(`${STORAGE_KEYS.HISTORY}_${userId}`, JSON.stringify(gameHistory));
    localStorage.setItem(`${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`, JSON.stringify(achievements));
    
    return { stats, gameHistory, achievements };
  },

  // Save game result
  saveGameResult: async (userId, gameResult) => {
    const historyKey = `${STORAGE_KEYS.HISTORY}_${userId}`;
    const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    const updatedHistory = [gameResult, ...existingHistory].slice(0, 20); // Keep last 20 games
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    
    return true;
  },

  // Update user stats
  updateUserStats: async (userId, newStats) => {
    const statsKey = `${STORAGE_KEYS.STATS}_${userId}`;
    localStorage.setItem(statsKey, JSON.stringify(newStats));
    return newStats;
  }
};
