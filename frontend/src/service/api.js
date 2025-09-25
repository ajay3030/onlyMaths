// src/service/api.js
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`🌐 Auth API: ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      console.log(`✅ Auth Success: ${endpoint}`);
      return data;

    } catch (error) {
      console.error(`❌ Auth Error: ${endpoint}`, error.message);
      
      if (error.message.includes('Invalid token') || error.message.includes('Token expired')) {
        this.removeAuthToken();
      }
      
      throw error;
    }
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 🆕 NEW: PATCH method (for partial updates)
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // 🆕 NEW: DELETE method
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
}

export const apiService = new ApiService();
