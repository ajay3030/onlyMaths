// src/context/AuthContext/AuthProvider.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { authApi } from '../../service/authApi';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (authApi.isAuthenticated()) {
        console.log('🔍 Checking existing auth token...');
        const userProfile = await authApi.getProfile();
        setUser(userProfile);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', userProfile.name);
      }
    } catch (error) {
      console.log('❌ Auth check failed:', error.message);
      // Token might be expired, clear it
      authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔑 Attempting login...');
      const response = await authApi.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful:', response.user.name);
      return { success: true, user: response.user };

    } catch (error) {
      console.error('❌ Login failed:', error.message);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📝 Attempting registration...');
      const response = await authApi.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      console.log('✅ Registration successful:', response.user.name);
      return { success: true, user: response.user };

    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    console.log('✅ Logout successful');
  };

  // 🔥 FIXED: Proper updatePassword implementation using authApi
  const updatePassword = async (passwordData) => {
    try {
      console.log('🔒 AuthContext: Updating password...');
      
      // Use authApi for consistency (create this method in authApi)
      const response = await authApi.changePassword(passwordData);
      console.log(response)
      
      console.log('✅ AuthContext: Password updated successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ AuthContext: Password update error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update password' 
      };
    }
  };

  // Profile update method (already good)
  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Updating profile...');
      const response = await authApi.updateProfile(profileData);
      
      console.log('📥 AuthProvider response:', response);
      
      // 🔥 UPDATED: Merge the data we sent with the response
      let updatedUser = null;
      
      if (response.user) {
        // Backend returned user, but merge our updates in case backend didn't save everything
        updatedUser = { 
          ...response.user,
          ...profileData // Override with our updates to ensure UI shows what user entered
        };
      } else {
        // Fallback: merge with existing user
        updatedUser = { ...user, ...profileData };
      }
      
      setUser(updatedUser);
      console.log('✅ Profile updated:', updatedUser.name);
      console.log('🔍 Updated user object:', updatedUser);
      return { success: true, user: updatedUser };

    } catch (error) {
      console.error('❌ Profile update failed:', error.message);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword, // ✅ Added to context value
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
