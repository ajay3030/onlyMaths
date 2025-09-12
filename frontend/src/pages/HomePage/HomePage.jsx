// src/pages/HomePage/HomePage.jsx
import React from "react";
import { useGame } from "../../context/GameContext";
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import GameGrid from "../../components/features/GameSelection/GameGrid/GameGrid";
import GameTimer from "../../components/features/GameSelection/GameTimer/GameTimer";

const HomePage = () => {
  const { gameState,startPlaying  } = useGame();
  const navigate = useNavigate();

  const handleTimerComplete = useCallback(() => {
    console.log('🏠 HomePage - handleTimerComplete called');
  startPlaying();
  console.log('🎮 startPlaying called, navigating to /game');
  navigate('/game');
  },[[startPlaying, navigate]]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white py-20">
        {/* Background Animation */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div className="text-white opacity-20 text-xl">
                {
                  ["✨", "🔢", "🧮", "⭐", "🎯", "🚀"][
                    Math.floor(Math.random() * 6)
                  ]
                }
              </div>
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="text-6xl animate-bounce mb-4">🔢</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                OnlyMaths
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              The most fun way to learn mathematics! Join thousands of kids
              improving their math skills through exciting games and challenges.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
              {[
                { number: "10,000+", label: "Happy Kids", icon: "😊" },
                { number: "6", label: "Fun Games", icon: "🎮" },
                { number: "100%", label: "Free to Play", icon: "🆓" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-yellow-300">
                    {stat.number}
                  </div>
                  <div className="text-purple-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {gameState === "countdown" ? (
        <GameTimer onComplete={handleTimerComplete} />
      ) : (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white border-opacity-50">
              <GameGrid />
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-16 bg-white bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Kids Love OnlyMaths? 🤔
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Beautiful Design",
                description:
                  "Colorful and engaging interface designed specifically for kids",
              },
              {
                icon: "🏆",
                title: "Achievement System",
                description:
                  "Earn badges and rewards as you progress through different levels",
              },
              {
                icon: "📊",
                title: "Track Progress",
                description:
                  "See your improvement over time with detailed statistics and reports",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
