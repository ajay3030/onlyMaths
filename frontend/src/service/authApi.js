// src/services/authApi.js
import { apiService } from './api';

export const authApi = {
  // Register new user
  async register(userData) {
    const response = await apiService.post('/auth/register', userData);
    
    // Store token after successful registration
    if (response.data.accessToken) {
      apiService.setAuthToken(response.data.accessToken);
    }
    
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await apiService.post('/auth/login', credentials);
    
    // Store token after successful login
    if (response.data.accessToken) {
      apiService.setAuthToken(response.data.accessToken);
    }
    
    return response.data;
  },

  // Get current user profile
  async getProfile() {
    const response = await apiService.get('/auth/profile');
    return response.data.user;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await apiService.put('/auth/profile', profileData);
    return response.data.user;
  },

  // Logout (client-side)
  logout() {
    apiService.removeAuthToken();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getAuthToken();
  }
};
