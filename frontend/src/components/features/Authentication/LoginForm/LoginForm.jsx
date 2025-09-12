// src/components/features/Authentication/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useUI } from '../../../../context/UIContext';
import Button from '../../../common/UI/Button';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const { login, isLoading, error } = useAuth();
  const { showNotification } = useUI();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData);
      showNotification('Welcome back to OnlyMaths! 🎉', 'success');
      onSuccess();
    } catch (err) {
        console.log(err)
      showNotification('Login failed. Please try again.', 'error');
    }
  };

  // Demo login for quick access
  const handleDemoLogin = async () => {
    try {
      await login({
        email: 'demo@onlymaths.com',
        name: 'Math Explorer',
        password: 'demo123'
      });
      showNotification('Welcome, Math Explorer! 🚀', 'success');
      onSuccess();
    } catch (err) {
        console.log(err)
      showNotification('Demo login failed. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📧 Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
            errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 animate-shake">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🔐 Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
            errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 animate-shake">{errors.password}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Logging in...' : 'Login & Start Playing! 🎮'}
      </Button>

      {/* Demo Login */}
      <div className="text-center">
        <div className="text-sm text-gray-500 mb-2">or</div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleDemoLogin}
          className="w-full"
          loading={isLoading}
        >
          Try Demo Account 🎯
        </Button>
      </div>

      {/* Forgot Password */}
      <div className="text-center">
        <a href="#" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
          Forgot your password? 🤔
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
