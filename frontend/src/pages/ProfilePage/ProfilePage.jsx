// src/pages/ProfilePage/ProfilePage.jsx - Now cleaner!
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserStats } from '../../context/UserStatsContext';
import { Navigate } from 'react-router-dom';
import UserInfo from '../../components/features/Profile/UserInfo';
import StatsDisplay from '../../components/features/Profile/StatsDisplay';
import AccountSettings from '../../components/features/Profile/AccountSettings';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { stats } = useUserStats();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Components now use ProfileContext internally */}
        <UserInfo user={user} stats={stats} />  {/* Less props needed */}
        <StatsDisplay stats={stats} />           {/* Uses ProfileContext for privacy */}
        <AccountSettings onLogout={logout} />    {/* Uses ProfileContext for settings */}
        
      </div>
    </div>
  );
};

export default ProfilePage;
