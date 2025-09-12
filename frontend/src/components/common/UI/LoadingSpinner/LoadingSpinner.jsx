// src/components/common/UI/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'purple', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    pink: 'border-pink-500',
    yellow: 'border-yellow-500'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
