// src/components/common/Layout/Navbar/Navbar.jsx
import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useUI } from '../../../../context/UIContext';
import Button from '../../UI/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openModal } = useUI();

  const handleLoginClick = () => {
    openModal('auth', { mode: 'login' });
  };

  const handleSignupClick = () => {
    openModal('auth', { mode: 'signup' });
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Progress', href: '/progress', icon: '📈' },
    { name: 'Achievements', href: '/achievements', icon: '🏆' }
  ];

  return (
    <nav className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow-lg relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 animate-gradient-x"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Site name */}
          <div className="flex-shrink-0 group">
            <div className="flex items-center space-x-3">
              <div className="text-3xl animate-bounce">🔢</div>
              <h1 className="text-white text-2xl font-bold tracking-wide group-hover:scale-105 transition-transform duration-300">
                OnlyMaths
              </h1>
            </div>
          </div>

          {/* Center - Navigation items (when logged in) */}
          <div className="hidden md:block">
            {isAuthenticated && (
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLoginClick}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Login
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={handleSignupClick}
                  className="shadow-lg"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Avatar & Name */}
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <div className="text-2xl">{user?.avatar || '🧒'}</div>
                  <span className="text-white font-medium hidden sm:block">
                    {user?.name || 'Math Explorer'}
                  </span>
                </div>
                
                <Button
                  variant="danger"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
