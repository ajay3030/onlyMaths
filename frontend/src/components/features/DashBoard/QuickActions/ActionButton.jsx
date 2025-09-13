// src/components/features/Dashboard/QuickActions/ActionButton.jsx
import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../../context/GameContext';

const ActionButton = ({ game, icon, title, description, color = 'purple' }) => {
  //const navigate = useNavigate();
  const { startGame } = useGame();

  const colorClasses = {
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-900',
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-900',
    green: 'bg-green-50 hover:bg-green-100 text-green-900',
    orange: 'bg-orange-50 hover:bg-orange-100 text-orange-900'
  };

  const handleClick = () => {
    if (game) {
      startGame(game);
      // Navigate will be handled by GameTimer after countdown
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`flex items-center space-x-3 p-4 ${colorClasses[color]} rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md w-full text-left`}
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm opacity-75">{description}</p>
      </div>
    </button>
  );
};

export default ActionButton;
