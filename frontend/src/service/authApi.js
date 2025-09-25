// src/service/authApi.js
import { apiService } from './api';

export const authApi = {
  async register(userData) {
    console.log('📝 Registering user:', userData.email);
    const response = await apiService.post('/auth/register', userData);
    
    if (response.data.accessToken) {
      apiService.setAuthToken(response.data.accessToken);
      console.log('🔑 Token stored after registration');
    }
    
    return response.data;
  },

  async login(credentials) {
    console.log('🔑 Logging in user:', credentials.email);
    const response = await apiService.post('/auth/login', credentials);
    
    if (response.data.accessToken) {
      apiService.setAuthToken(response.data.accessToken);
      console.log('🔑 Token stored after login');
    }
    
    return response.data;
  },

  async getProfile() {
    console.log('👤 Getting user profile...');
    const response = await apiService.get('/auth/profile');
    return response.data.user;
  },

  async changePassword(passwordData) {
    console.log('🔒 authApi: Changing password...');
    
    try {
      const response = await apiService.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      // 🔍 DEBUG: Log the complete response structure
      console.log('📥 FULL Password change response:', response);
      console.log('📥 Response.data:', response.data);
      console.log('📥 Response.status:', response.status);
      
      console.log('✅ authApi: Password changed successfully');
      return response.data;

    } catch (error) {
      console.error('❌ authApi: Password change failed');
      console.error('📥 Error response:', error.response?.data);
      console.error('📥 Error status:', error.response?.status);
      console.error('📥 Error message:', error.message);
      
      // Throw with specific error message from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to change password';
      throw new Error(errorMessage);
    }
  },
  
  async updateProfile(profileData) {
    console.log('🔄 Updating user profile...', profileData);
    const response = await apiService.put('/auth/profile', profileData);
    
    // 🔍 DEBUG: Log the complete response structure
    console.log('📥 FULL Backend response:', response);
    console.log('📥 Response.data:', response.data);
    console.log('📥 Response.data.user:', response.data?.user);
    console.log('📥 Response.data.data:', response.data?.data);
    
    console.log('✅ Profile updated successfully');
    return response.data;
  },

  
  logout() {
    console.log('🚪 Logging out...');
    apiService.removeAuthToken();
  },

  isAuthenticated() {
    return !!apiService.getAuthToken();
  }
};
