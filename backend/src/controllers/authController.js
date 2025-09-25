// src/controllers/authController.js
const User = require('../models/User');
const JWTUtil = require('../utils/jwt');
const ApiResponse = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return ApiResponse.error(res, 'User already exists with this email', 400);
      }

      // Create new user
      const user = new User({ name, email, password });
      await user.save();

      // Generate tokens
      const tokens = JWTUtil.generateTokens(user);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      ApiResponse.success(res, {
        user: user.getPublicProfile(),
        ...tokens
      }, 'User registered successfully', 201);

    } catch (error) {
      console.error('Registration error:', error);
      ApiResponse.error(res, 'Registration failed', 500);
    }
  }

  // Login user
  static async login(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { email, password } = req.body;

      // Find user with password field
      const user = await User.findOne({ email }).select('+password');
      if (!user || !user.isActive) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
      }

      // Generate tokens
      const tokens = JWTUtil.generateTokens(user);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      ApiResponse.success(res, {
        user: user.getPublicProfile(),
        ...tokens
      }, 'Login successful');

    } catch (error) {
      console.error('Login error:', error);
      ApiResponse.error(res, 'Login failed', 500);
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      ApiResponse.success(res, {
        user: req.user.getPublicProfile()
      }, 'Profile retrieved successfully');
    } catch (error) {
      console.error('Get profile error:', error);
      ApiResponse.error(res, 'Failed to get profile', 500);
    }
  }

  // Update user profile
  // static async updateProfile(req, res) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return ApiResponse.error(res, 'Validation failed', 400, errors.array());
  //     }

  //     const { name, preferences } = req.body;
  //     const user = req.user;

  //     if (name) user.name = name;
  //     if (preferences) user.preferences = { ...user.preferences, ...preferences };

  //     await user.save();

  //     ApiResponse.success(res, {
  //       user: user.getPublicProfile()
  //     }, 'Profile updated successfully');

  //   } catch (error) {
  //     console.error('Update profile error:', error);
  //     ApiResponse.error(res, 'Failed to update profile', 500);
  //   }
  // }

// In your backend auth controller - ADD this method
  // In src/controllers/authController.js - UPDATE changePassword method with debug logs
static async changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user; // from authMiddleware

    console.log('🔒 Password change request for user:', user.email);
    
    // 🔍 DEBUG: Log the received data
    console.log('📥 Request body:', req.body);
    console.log('📥 Current password received:', currentPassword);
    console.log('📥 New password received:', newPassword);
    console.log('📥 User object:', {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 'NO PASSWORD'
    });

    // Validate input
    if (!currentPassword || !newPassword) {
      console.log('❌ Missing password fields');
      return ApiResponse.error(res, 'Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      console.log('❌ New password too short');
      return ApiResponse.error(res, 'New password must be at least 6 characters', 400);
    }

    // 🔍 DEBUG: Check if user has a password
    if (!user.password) {
      console.log('❌ User has no password in database');
      return ApiResponse.error(res, 'User has no password set', 400);
    }

    // Verify current password
    console.log('🔍 Comparing passwords...');
    console.log('🔍 Stored hash:', user.password);
    console.log('🔍 Current password to verify:', currentPassword);
    
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    console.log('🔍 Password comparison result:', isCurrentPasswordValid);
    
    if (!isCurrentPasswordValid) {
      console.log('❌ Current password verification failed for user:', user.email);
      return ApiResponse.error(res, 'Current password is incorrect', 400);
    }

    // Update password (will be hashed by pre-save hook in User model)
    user.password = newPassword;
    await user.save();

    console.log('✅ Password updated successfully for user:', user.email);

    ApiResponse.success(res, {}, 'Password updated successfully');

  } catch (error) {
    console.error('❌ Change password error:', error);
    ApiResponse.error(res, 'Failed to update password', 500);
  }
}




  // Update user profile
  // Update user profile controller - FIXED VERSION
static async updateProfile(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ApiResponse.error(res, 'Validation failed', 400, errors.array());
    }

    const { name, email, avatar, bio, preferences } = req.body;
    const user = req.user;

    console.log('🔄 Updating profile for user:', user.name);
    console.log('📝 Update data:', { name, email, avatar, bio, preferences });

    // Update name
    if (name !== undefined && name.trim()) {
      user.name = name.trim();
      console.log('✅ Updated name:', user.name);
    }

    // Update email with validation
    if (email !== undefined && email.trim()) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return ApiResponse.error(res, 'Invalid email format', 400);
      }
      
      // Check if email already exists for another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: user._id } 
      });
      
      if (existingUser) {
        return ApiResponse.error(res, 'Email already in use', 400);
      }
      
      user.email = email.toLowerCase().trim();
      console.log('✅ Updated email:', user.email);
    }

    // Update avatar
    if (avatar !== undefined) {
      user.avatar = avatar;
      console.log('✅ Updated avatar:', user.avatar);
    }

    // Update bio
    if (bio !== undefined) {
      user.bio = bio.trim();
      console.log('✅ Updated bio:', user.bio);
    }

    // Update preferences
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
      console.log('✅ Updated preferences:', user.preferences);
    }

    // Save the user
    await user.save();

    console.log('💾 Profile saved successfully');
    console.log('👤 Final user data:', {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio
    });

    ApiResponse.success(res, {
      user: user.getPublicProfile()
    }, 'Profile updated successfully');

  } catch (error) {
    console.error('❌ Update profile error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return ApiResponse.error(res, 'Email already exists', 400);
    }
    
    if (error.name === 'ValidationError') {
      return ApiResponse.error(res, error.message, 400);
    }
    
    ApiResponse.error(res, 'Failed to update profile', 500);
  }
}


}

module.exports = AuthController;
