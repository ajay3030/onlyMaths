// src/components/common/Layout/Navbar/Navbar.jsx - THEME-MATCHING FIXES
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useUI } from '../../../../context/UIContext';
import Button from '../../UI/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openModal } = useUI();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginClick = () => {
    openModal('auth', { mode: 'login' });
  };

  const handleSignupClick = () => {
    openModal('auth', { mode: 'signup' });
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Profile', href: '/profile', icon: '👤' }
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 shadow-lg relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 animate-gradient-x"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Site name */}
            <div className="flex-shrink-0 group">
              <Link to="/" className="flex items-center space-x-3">
                <div className="text-3xl animate-bounce">🔢</div>
                <h1 className="text-white text-2xl font-bold tracking-wide group-hover:scale-105 transition-transform duration-300">
                  OnlyMaths
                </h1>
              </Link>
            </div>

            {/* Center - Desktop Navigation items (when logged in) */}
            <div className="hidden md:block">
              {isAuthenticated && (
                <div className="flex items-center space-x-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                        location.pathname === item.href 
                          ? 'bg-white bg-opacity-25 text-pink-400 font-bold shadow-lg backdrop-blur-sm border border-white border-opacity-30' // ✅ Active: Subtle white bg + light pink text
                          : 'text-white hover:bg-white hover:bg-opacity-15 hover:text-pink-300' // ✅ Normal: White text with subtle hover
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
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
                <>
                  {/* Desktop User Info - BETTER CONTRAST WITH THEME COLORS */}
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white bg-opacity-1 backdrop-blur-sm rounded-full px-4 py-2 border border-white border-opacity-20 shadow-lg">
                      <div className="text-2xl">{user?.avatar || '🧒'}</div>
                      <span className="text-white font-medium hidden sm:block drop-shadow-sm">
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

                  {/* Mobile Menu Button */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="text-white hover:bg-white hover:bg-opacity-15 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg mb-3 border border-pink-100">
              <div className="text-2xl">{user?.avatar || '🧒'}</div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || 'Math Explorer'}</p>
                <p className="text-sm text-purple-600">{user?.email}</p>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                  location.pathname === item.href 
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-purple-600 border-l-4 border-purple-500 shadow-sm' // ✅ Active: Gradient background
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-25 hover:to-purple-25' // ✅ Hover: Subtle gradient
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 w-full text-left"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
