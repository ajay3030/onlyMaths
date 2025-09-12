// src/components/common/UI/NotificationSystem/NotificationSystem.jsx
import React from 'react';
import { useUI } from '../../../../context/UIContext';

const NotificationSystem = () => {
  const { notifications } = useUI();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

const Notification = ({ notification }) => {
  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  return (
    <div className={`${typeStyles[notification.type]} px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in-right max-w-sm`}>
      <div className="flex items-center space-x-3">
        <span className="text-xl">{icons[notification.type]}</span>
        <p className="font-medium">{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationSystem;
