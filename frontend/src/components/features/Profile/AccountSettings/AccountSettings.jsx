// src/components/features/Profile/AccountSettings/AccountSettings.jsx - FINAL VERSION
import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import SettingItem from './SettingItem';

const AccountSettings = ({ 
  user, 
  preferences, 
  onLogout, 
  onUpdateProfile, 
  onUpdatePreferences 
}) => {
  const { updatePassword } = useAuth(); // 🆕 Get from AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handle password change
  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert('Please fill in all password fields');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔒 Requesting password change through AuthContext...');
      
      // 🔥 USE AuthContext method
      const result = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (result.success) {
        alert('Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordModal(false);
      } else {
        // Handle specific errors
        if (result.error.includes('current password') || result.error.includes('incorrect')) {
          alert('Current password is incorrect. Please try again.');
        } else if (result.error.includes('characters')) {
          alert('New password must be at least 6 characters long.');
        } else {
          alert(`Failed to update password: ${result.error}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Password update failed:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email settings
  const handleEmailSettings = () => {
    // TODO: Implement email settings modal
    console.log('Email settings clicked');
    alert('Email settings feature coming soon!');
  };

  // Handle theme toggle
  const handleThemeSettings = async () => {
    try {
      const newTheme = preferences?.theme === 'light' ? 'dark' : 'light';
      
      // Update through parent component
      if (onUpdatePreferences) {
        await onUpdatePreferences({ 
          ...preferences, 
          theme: newTheme 
        });
      }
      
      // Also update user profile
      if (onUpdateProfile) {
        await onUpdateProfile({ theme: newTheme });
      }
      
      console.log('Theme changed to:', newTheme);
    } catch (error) {
      console.error('Failed to update theme:', error);
      alert('Failed to update theme. Please try again.');
    }
  };

  // Handle notification toggle
  const handleNotificationSettings = async () => {
    try {
      const newNotificationState = !preferences?.notifications;
      
      const updatedPreferences = {
        ...preferences,
        notifications: newNotificationState
      };
      
      // Update through parent component
      if (onUpdatePreferences) {
        await onUpdatePreferences(updatedPreferences);
      }
      
      // Also update user profile  
      if (onUpdateProfile) {
        await onUpdateProfile({ notifications: newNotificationState });
      }
      
      console.log('Notifications:', newNotificationState ? 'enabled' : 'disabled');
    } catch (error) {
      console.error('Failed to update notifications:', error);
      alert('Failed to update notifications. Please try again.');
    }
  };

  // Handle privacy settings
  const handlePrivacySettings = () => {
    const showStats = preferences?.privacy?.showStats !== false;
    const newShowStats = !showStats;
    
    const updatedPreferences = {
      ...preferences,
      privacy: {
        ...preferences?.privacy,
        showStats: newShowStats
      }
    };
    
    if (onUpdatePreferences) {
      onUpdatePreferences(updatedPreferences);
    }
    
    console.log('Stats visibility:', newShowStats ? 'public' : 'private');
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      {/* Debug Button - REMOVE after testing */}
      <button 
        onClick={() => {
          console.log('🔍 AccountSettings Debug:');
          console.log('User:', user);
          console.log('Preferences:', preferences);
          console.log('Theme:', preferences?.theme);
          console.log('Notifications:', preferences?.notifications);
          console.log('Privacy:', preferences?.privacy);
        }}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm mb-4"
      >
        Debug Account Settings
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings ⚙️</h2>
      
      <div className="space-y-4">
        {/* Password Change */}
        <SettingItem
          icon="🔒"
          title="Change Password"
          description="Update your account password"
          onClick={handleChangePassword}
        />

        {/* Email Settings */}
        <SettingItem
          icon="📧"
          title="Email Settings"
          description={`Current: ${user?.email || 'Not set'}`}
          onClick={handleEmailSettings}
        />

        {/* Theme Settings */}
        <SettingItem
          icon="🎨"
          title={`Theme: ${preferences?.theme === 'dark' ? 'Dark' : 'Light'}`}
          description="Customize app appearance"
          onClick={handleThemeSettings}
        />

        {/* Notification Settings */}
        <SettingItem
          icon="🔔"
          title={`Notifications: ${preferences?.notifications ? 'On' : 'Off'}`}
          description="Manage notification preferences"
          onClick={handleNotificationSettings}
        />

        {/* Privacy Settings */}
        <SettingItem
          icon="👁️"
          title={`Stats Visibility: ${preferences?.privacy?.showStats !== false ? 'Public' : 'Private'}`}
          description="Control who can see your statistics"
          onClick={handlePrivacySettings}
        />

        {/* Account Info */}
        <SettingItem
          icon="👤"
          title="Account Information"
          description={`Member since ${user?.createdAt ? new Date(user.createdAt).getFullYear() : 'recently'}`}
          onClick={() => alert(`Account Details:\nName: ${user?.name}\nEmail: ${user?.email}\nJoined: ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}`)}
        />

        {/* Sign Out */}
        <SettingItem
          icon="🚪"
          title="Sign Out"
          description="Log out of your account"
          onClick={onLogout}
          variant="danger"
        />
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? '🔄 Updating...' : '🔐 Update Password'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
