// src/components/features/Authentication/SignupForm/SignupForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useUI } from '../../../../context/UIContext';
import Button from '../../../common/UI/Button';

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '🧒'
  });
  const [errors, setErrors] = useState({});

  const { signup, isLoading } = useAuth();
  const { showNotification } = useUI();

  const avatarOptions = ['🧒', '👦', '👧', '🤓', '😎', '🤗', '🚀', '⭐'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await signup(formData);
      showNotification(`Welcome to OnlyMaths, ${formData.name}! 🎉`, 'success');
      onSuccess();
    } catch (err) {
        console.log(err)
      showNotification('Signup failed. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          👤 Your Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="What should we call you?"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 animate-shake">{errors.name}</p>
        )}
      </div>

      {/* Avatar Selection */}
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose Your Avatar
        </label>
        <div className="grid grid-cols-4 gap-2">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, avatar }))}
              className={`text-2xl p-3 rounded-lg border-2 transition-all duration-300 ${
                formData.avatar === avatar
                  ? 'border-purple-500 bg-purple-50 scale-110'
                  : 'border-gray-200 hover:border-purple-300 hover:scale-105'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

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

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Create password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 animate-shake">{errors.password}</p>
          )}
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔐 Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
              errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 animate-shake">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating Account...' : 'Join OnlyMaths! 🚀'}
      </Button>

      {/* Terms */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:underline">Terms</a> and{' '}
          <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
