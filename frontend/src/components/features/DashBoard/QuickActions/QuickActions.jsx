// src/components/features/Dashboard/QuickActions/QuickActions.jsx
import React from 'react';
import ActionButton from './ActionButton';

const QuickActions = () => {
  const quickActions = [
    {
      game: 'arithmetic-game',
      icon: '🔢',
      title: 'Practice Arithmetic',
      description: 'Sharpen your basic math skills',
      color: 'purple'
    },
    {
      game: 'memory-game',
      icon: '🧠',
      title: 'Memory Challenge',
      description: 'Test your number memory',
      color: 'blue'
    },
    {
      game: 'arithmetic-pro',
      icon: '⚡',
      title: 'Speed Round',
      description: 'Quick math challenges',
      color: 'green'
    }
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions ⚡</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <ActionButton key={action.game} {...action} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
