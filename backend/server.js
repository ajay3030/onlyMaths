// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const gameRoutes = require('./src/routes/game');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Basic test route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'OnlyMaths Backend API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (protected)',
        updateProfile: 'PUT /api/auth/profile (protected)',
        test: 'GET /api/auth/test (protected)'
      },
       games: {
        saveResult: 'POST /api/games/results (protected)',
        getHistory: 'GET /api/games/results/history (protected)',
        getResult: 'GET /api/games/results/:id (protected)',
        getStats: 'GET /api/games/stats (protected)',
        getLeaderboard: 'GET /api/games/leaderboard (protected)'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});


// Global error handler
app.use((error, req, res, next) => {
  console.error('Global Error:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OnlyMaths Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
