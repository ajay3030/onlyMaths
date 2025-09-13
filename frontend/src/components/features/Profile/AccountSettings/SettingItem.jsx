// src/components/features/Profile/AccountSettings/SettingItem.jsx
import React from 'react';

const SettingItem = ({ icon, title, description, onClick, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-50 hover:bg-gray-100 text-gray-900',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${variants[variant]}`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{icon}</span>
        <div className="text-left">
          <p className={`font-semibold ${variant === 'danger' ? 'text-red-600' : 'text-gray-900'}`}>
            {title}
          </p>
          <p className={`text-sm ${variant === 'danger' ? 'text-red-500' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
      </div>
      <span className={`${variant === 'danger' ? 'text-red-400' : 'text-gray-400'}`}>→</span>
    </button>
  );
};

export default SettingItem;
