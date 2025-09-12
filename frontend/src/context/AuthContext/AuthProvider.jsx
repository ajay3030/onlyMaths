// src/context/AuthContext/AuthProvider.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(user);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('onlymaths_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('onlymaths_user');
      }
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        name: credentials.name || 'Math Explorer',
        email: credentials.email,
        avatar: '🧒',
        joinDate: new Date().toISOString(),
        gamesPlayed: 0,
        totalScore: 0
      };

      setUser(userData);
      localStorage.setItem('onlymaths_user', JSON.stringify(userData));
    } catch (err) {
        console.log(err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || '🧒',
        joinDate: new Date().toISOString(),
        gamesPlayed: 0,
        totalScore: 0
      };

      setUser(newUser);
      localStorage.setItem('onlymaths_user', JSON.stringify(newUser));
    } catch (err) {
        console.log(err)
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('onlymaths_user');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
