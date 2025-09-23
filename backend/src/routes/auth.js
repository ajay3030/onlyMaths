// src/routes/auth.js
const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const authValidation = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', authValidation.register, AuthController.register);
router.post('/login', authValidation.login, AuthController.login);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, authValidation.updateProfile, AuthController.updateProfile);

// Test protected route
router.get('/test', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route working!',
    user: req.user.name,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
