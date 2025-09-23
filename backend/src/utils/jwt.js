// src/utils/jwt.js
const jwt = require('jsonwebtoken');

class JWTUtil {
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static generateTokens(user) {
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    const accessToken = this.generateToken(payload);
    
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
  }
}

module.exports = JWTUtil;
