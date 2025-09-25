// src/middleware/validation.js
const { body } = require('express-validator');

const authValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2-50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one letter and one number')
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2-50 characters'),

    body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
    
    body('avatar')
    .optional()
    .isLength({ min: 1, max: 10 })
    .withMessage('Avatar must be valid'),
    
    body('bio')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Bio must be less than 200 characters')
    .trim(),
    
    body('preferences.theme')
      .optional()
      .isIn(['light', 'dark'])
      .withMessage('Theme must be light or dark'),
    
    body('preferences.difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard'])
      .withMessage('Difficulty must be easy, medium, or hard')
  ]
};

module.exports = authValidation;
