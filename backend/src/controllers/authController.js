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
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { name, preferences } = req.body;
      const user = req.user;

      if (name) user.name = name;
      if (preferences) user.preferences = { ...user.preferences, ...preferences };

      await user.save();

      ApiResponse.success(res, {
        user: user.getPublicProfile()
      }, 'Profile updated successfully');

    } catch (error) {
      console.error('Update profile error:', error);
      ApiResponse.error(res, 'Failed to update profile', 500);
    }
  }
}

module.exports = AuthController;
