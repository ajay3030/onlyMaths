// src/pages/ProfilePage/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserStats } from '../../context/UserStatsContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { stats } = useUserStats();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '🧒'
  });

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const avatarOptions = ['🧒', '👧', '👦', '🦸‍♂️', '🦸‍♀️', '🤖', '👨‍🎓', '👩‍🎓', '🧙‍♂️', '🧙‍♀️'];

  const handleSaveProfile = () => {
    // TODO: Update user profile in AuthContext
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-8xl mb-4">{editForm.avatar}</div>
              {isEditing && (
                <div className="grid grid-cols-5 gap-2 max-w-xs">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setEditForm({ ...editForm, avatar })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                        editForm.avatar === avatar
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>⭐ Level: {stats?.level || 'Beginner'}</span>
                    <span>📅 Joined: {new Date(stats?.joinDate || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics 📊</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats?.totalGamesPlayed || 0}
              </div>
              <div className="text-purple-700 font-medium">Total Games</div>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats?.averageScore || 0}
              </div>
              <div className="text-blue-700 font-medium">Average Score</div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats?.bestScore || 0}
              </div>
              <div className="text-green-700 font-medium">Best Score</div>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats?.bestStreak || 0}
              </div>
              <div className="text-yellow-700 font-medium">Best Streak</div>
            </div>

            <div className="text-center p-6 bg-pink-50 rounded-xl">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {stats?.experience || 0}
              </div>
              <div className="text-pink-700 font-medium">Experience Points</div>
            </div>

            <div className="text-center p-6 bg-indigo-50 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {Math.floor((Date.now() - new Date(stats?.joinDate || Date.now())) / (1000 * 60 * 60 * 24)) || 0}
              </div>
              <div className="text-indigo-700 font-medium">Days Active</div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings ⚙️</h2>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🔒</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Email Settings</p>
                  <p className="text-sm text-gray-600">Manage email preferences</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎨</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Theme Settings</p>
                  <p className="text-sm text-gray-600">Customize app appearance</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-red-600"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🚪</span>
                <div className="text-left">
                  <p className="font-semibold">Sign Out</p>
                  <p className="text-sm text-red-500">Log out of your account</p>
                </div>
              </div>
              <span className="text-red-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
