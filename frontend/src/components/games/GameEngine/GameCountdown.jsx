// src/components/games/GameEngine/GameCountdown.jsx
import React, { useState, useEffect } from 'react';

const GameCountdown = () => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (countdown === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-8xl mb-4 animate-bounce">🚀</div>
        <h2 className="text-4xl font-bold text-green-600">Let's Go!</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="text-9xl mb-6 animate-pulse">{countdown}</div>
      <h2 className="text-3xl font-bold text-gray-800">Get Ready!</h2>
      <p className="text-gray-600 mt-2">Game starts in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
    </div>
  );
};

export default GameCountdown;
