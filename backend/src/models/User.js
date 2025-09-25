// src/models/User.js - ADD bio field
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: '🧒' // 🔥 UPDATED: Default emoji instead of null
  },
  // 🆕 NEW: Add bio field
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: '',
    trim: true
  },
  gameStats: {
    totalGamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    favoriteGameType: { type: String, default: null },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 }
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    soundEnabled: { type: Boolean, default: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
  },
  achievements: [{
    type: String
  }],
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
// In src/models/User.js - CHECK/FIX the comparePassword method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // 🔍 DEBUG: Log what we're comparing
    console.log('🔍 comparePassword called with:');
    console.log('🔍 candidatePassword:', candidatePassword);
    console.log('🔍 stored password hash:', this.password);
    console.log('🔍 candidatePassword type:', typeof candidatePassword);
    console.log('🔍 stored password type:', typeof this.password);
    
    // Check if both values exist
    if (!candidatePassword) {
      console.log('❌ candidatePassword is missing');
      return false;
    }
    
    if (!this.password) {
      console.log('❌ stored password hash is missing');
      return false;
    }
    
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔍 bcrypt.compare result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ comparePassword error:', error);
    return false;
  }
};


// 🔥 UPDATED: Include bio in public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio, // 🆕 NEW: Include bio
    gameStats: this.gameStats,
    preferences: this.preferences,
    achievements: this.achievements,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
