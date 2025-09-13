// src/components/features/Profile/AccountSettings/AccountSettings.jsx
import React from 'react';
import { useProfile } from '../../../../context/ProfileContext';
import SettingItem from './SettingItem';

const AccountSettings = ({ onLogout }) => {
  const { preferences, updatePreferences } = useProfile();

  const handleChangePassword = () => {
    // TODO: Implement password change modal
    console.log('Change password clicked');
  };

  const handleEmailSettings = () => {
    // TODO: Implement email settings modal
    console.log('Email settings clicked');
  };

  const handleThemeSettings = () => {
    // Toggle theme using ProfileContext
    const newTheme = preferences?.theme === 'light' ? 'dark' : 'light';
    updatePreferences({ theme: newTheme });
    console.log('Theme changed to:', newTheme);
  };

  const handleNotificationSettings = () => {
    // Toggle notifications using ProfileContext
    const newNotificationState = !preferences?.notifications?.gameReminders;
    updatePreferences({ 
      notifications: { 
        ...preferences?.notifications,
        gameReminders: newNotificationState 
      }
    });
    console.log('Notifications:', newNotificationState ? 'enabled' : 'disabled');
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings ⚙️</h2>
      
      <div className="space-y-4">
        <SettingItem
          icon="🔒"
          title="Change Password"
          description="Update your account password"
          onClick={handleChangePassword}
        />

        <SettingItem
          icon="📧"
          title="Email Settings"
          description="Manage email preferences"
          onClick={handleEmailSettings}
        />

        <SettingItem
          icon="🎨"
          title={`Theme: ${preferences?.theme === 'dark' ? 'Dark' : 'Light'}`}
          description="Customize app appearance"
          onClick={handleThemeSettings}
        />

        <SettingItem
          icon="🔔"
          title={`Notifications: ${preferences?.notifications?.gameReminders ? 'On' : 'Off'}`}
          description="Manage notification preferences"
          onClick={handleNotificationSettings}
        />

        <SettingItem
          icon="🚪"
          title="Sign Out"
          description="Log out of your account"
          onClick={onLogout}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AccountSettings;
