// src/components/features/GameSelection/GameTimer/GameTimer.jsx
import React, { useState, useEffect,useRef  } from "react";
import { useGame } from "../../../../context/GameContext";
import { GAMES_CONFIG } from "../../../../utils/constants/gameConfig";

const GameTimer = ({ onComplete }) => {
  const { currentGame, gameState } = useGame();
  const [countdown, setCountdown] = useState(3);
  //const timerRef = useRef(null); 
  const gameConfig = currentGame ? GAMES_CONFIG[currentGame] : null;

  // In GameTimer.jsx - Add logging:
  // useEffect(() => {
  //   console.log(
  //     "🔍 GameTimer - gameState:",
  //     gameState,
  //     "currentGame:",
  //     currentGame
  //   );
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current);
  //   }
  //   if (gameState === "countdown") {
  //     timerRef.current = setInterval(() => {
  //       setCountdown((prev) => {
  //         console.log("⏰ Countdown:", prev);
  //         if (prev <= 1) {
  //           clearInterval(timerRef.current);
  //           console.log("🚀 Timer finished, calling onComplete in 500ms");
  //           setTimeout(() => {
  //             if (onComplete) {
  //               console.log("📞 Calling onComplete");
  //               onComplete();
  //             }
  //           }, 500);
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [gameState, onComplete]);
//GameContext
  // useEffect(() => {
  //   if (gameState === 'countdown') {
  //     setCountdown(3);
  //   }
  // }, [gameState]);


// In GameTimer.jsx - Add more detailed logging:
// In GameTimer.jsx - Remove onComplete from dependencies:
useEffect(() => {
  console.log('🔍 GameTimer - gameState:', gameState, 'currentGame:', currentGame);
  
  if (gameState === 'countdown') {
    setCountdown(3);
    console.log('🎬 Starting timer interval');
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        console.log('⏰ Countdown:', prev, 'Next will be:', prev - 1);
        
        if (prev <= 1) {
          console.log('🛑 Timer stopping, prev was:', prev);
          clearInterval(timer);
          console.log('🚀 Timer finished, calling onComplete in 500ms');
          
          setTimeout(() => {
            console.log('📞 About to call onComplete, onComplete exists:', !!onComplete);
            if (onComplete) {
              console.log('📞 Calling onComplete NOW');
              onComplete();
            }
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log('🧹 Cleanup: clearing timer');
      clearInterval(timer);
    };
  }
}, [gameState]); // Only gameState dependency




  if (!gameConfig || gameState !== "countdown") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <div className="text-white opacity-20 text-2xl">✨</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative text-center">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-12 max-w-lg mx-auto border border-white border-opacity-20">
          {/* Game Info */}
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-bounce">
              {gameConfig.icon}
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">
              {gameConfig.name}
            </h2>
            <p className="text-blue-200 text-lg">Get ready to play!</p>
          </div>

          {/* Countdown */}
          {countdown > 0 ? (
            <div className="relative">
              <div
                className={`text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 animate-pulse ${
                  countdown === 1 ? "animate-bounce" : ""
                }`}
              >
                {countdown}
              </div>
              <div className="mt-4 text-white text-xl animate-pulse">
                Starting in...
              </div>

              {/* Progress Ring */}
              <div className="absolute -inset-8 border-4 border-yellow-400 border-opacity-30 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl font-bold text-green-400 animate-bounce">
                GO! 🚀
              </div>
              <div className="text-white text-xl">Starting game...</div>
            </div>
          )}

          {/* Game Stats Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="text-yellow-400 text-sm">Duration</div>
              <div className="text-red font-semibold">
                {Math.floor(gameConfig.duration / 60)} min
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-3">
              <div className="text-pink-400 text-sm">Level</div>
              <div className="text-red font-semibold">
                {gameConfig.difficulty}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTimer;
