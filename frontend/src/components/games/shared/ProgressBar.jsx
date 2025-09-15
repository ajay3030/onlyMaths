// src/components/games/shared/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ current, total, className = '' }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full bg-white bg-opacity-20 rounded-full h-2 ${className}`}>
      <div 
        className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
