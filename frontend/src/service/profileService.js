// src/services/profileService.js
// Generate default preferences
const generateDefaultPreferences = () => ({
  theme: 'light',
  notifications: {
    gameReminders: true,
    achievements: true,
    weeklyProgress: true,
    email: true
  },
  privacy: {
    showStats: true,
    showAchievements: true,
    allowFriendRequests: true,
    profileVisibility: 'public'
  },
  gameplay: {
    defaultDifficulty: 'medium',
    timerEnabled: true,
    soundEffects: true,
    animations: true
  },
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});

// Generate default profile settings
const generateDefaultProfileSettings = (user) => ({
  displayName: user?.name || 'Math Explorer',
  avatar: user?.avatar || '🧒',
  bio: '',
  status: 'Learning and growing! 📚',
  location: '',
  interests: ['Mathematics', 'Problem Solving'],
  favoriteGames: [],
  profileBanner: '🎯',
  socialLinks: {
    website: '',
    twitter: '',
    github: ''
  }
});

// LocalStorage keys
const PROFILE_STORAGE_KEYS = {
  PREFERENCES: 'onlymaths_preferences',
  PROFILE_SETTINGS: 'onlymaths_profile_settings'
};

// Profile service - matches mockDataService pattern
export const profileService = {
  // Load user profile
  loadProfile: async (userId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to get from localStorage
    const cachedPrefs = localStorage.getItem(`${PROFILE_STORAGE_KEYS.PREFERENCES}_${userId}`);
    const cachedProfile = localStorage.getItem(`${PROFILE_STORAGE_KEYS.PROFILE_SETTINGS}_${userId}`);
    
    if (cachedPrefs && cachedProfile) {
      return {
        preferences: JSON.parse(cachedPrefs),
        profileSettings: JSON.parse(cachedProfile)
      };
    }
    
    // Return null if no cached data (will generate defaults)
    return null;
  },

  // Save preferences
  savePreferences: async (userId, preferences) => {
    const key = `${PROFILE_STORAGE_KEYS.PREFERENCES}_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
    return preferences;
  },
  
  // Save profile settings
  saveProfileSettings: async (userId, settings) => {
    const key = `${PROFILE_STORAGE_KEYS.PROFILE_SETTINGS}_${userId}`;
    localStorage.setItem(key, JSON.stringify(settings));
    return settings;
  },

  // Generate default profile data
  generateDefaults: (user) => ({
    preferences: generateDefaultPreferences(user?.id),
    profileSettings: generateDefaultProfileSettings(user)
  }),

  // Update specific preference
  updatePreference: async (userId, key, value) => {
    const prefsKey = `${PROFILE_STORAGE_KEYS.PREFERENCES}_${userId}`;
    const existing = JSON.parse(localStorage.getItem(prefsKey) || '{}');
    const updated = { ...existing, [key]: value };
    localStorage.setItem(prefsKey, JSON.stringify(updated));
    return updated;
  },

  // Update specific profile setting
  updateProfileSetting: async (userId, key, value) => {
    const settingsKey = `${PROFILE_STORAGE_KEYS.PROFILE_SETTINGS}_${userId}`;
    const existing = JSON.parse(localStorage.getItem(settingsKey) || '{}');
    const updated = { ...existing, [key]: value };
    localStorage.setItem(settingsKey, JSON.stringify(updated));
    return updated;
  }
};

export default profileService;
