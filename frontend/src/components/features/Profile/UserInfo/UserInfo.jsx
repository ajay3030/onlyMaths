// src/components/features/Profile/UserInfo/UserInfo.jsx - NO STATS VERSION
import React, { useState } from 'react';

const UserInfo = ({ user, onUpdateProfile, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '🧒',
    bio: user?.bio || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const avatarOptions = ['🧒', '👧', '👦', '🦸‍♂️', '🦸‍♀️', '🤖', '👨‍🎓', '👩‍🎓', '🧙‍♂️', '🧙‍♀️', '🎯', '⭐', '🚀', '🔥', '💪', '🏆'];

  // Update form when user data changes
  React.useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '🧒',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!editForm.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('💾 Saving profile to backend...', editForm);

      const result = await onUpdateProfile({
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        avatar: editForm.avatar,
        bio: editForm.bio.trim()
      });

      if (result.success) {
        console.log('✅ Profile saved successfully');
        setIsEditing(false);
        
        if (onRefresh) {
          setTimeout(onRefresh, 500);
        }
      } else {
        console.error('❌ Profile save failed:', result.error);
        setError(result.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('❌ Profile save error:', error);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '🧒',
      bio: user?.bio || ''
    });
    setIsEditing(false);
    setError(null);
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '💾 Saving...' : '✅ Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
          <p className="text-red-600 text-sm">❌ {error}</p>
        </div>
      )}

      <div className="flex items-start space-x-8">
        {/* Avatar Section */}
        <div className="text-center flex-shrink-0">
          <div className="text-8xl mb-4">{editForm.avatar}</div>
          {isEditing && (
            <div>
              <p className="text-sm text-gray-600 mb-3">Choose your avatar:</p>
              <div className="grid grid-cols-4 gap-2 max-w-xs">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setEditForm({ ...editForm, avatar })}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                      editForm.avatar === avatar
                        ? 'border-purple-500 bg-purple-50 scale-105'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    title={`Select ${avatar} avatar`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info Section - NO STATS */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Display Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter your name"
                  maxLength={50}
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Bio (Optional)
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editForm.bio.length}/200 characters
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Display Mode - ONLY BASIC INFO */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                <p className="text-gray-600 text-lg mb-3">{user?.email}</p>
                {user?.bio && (
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">
                    "{user.bio}"
                  </p>
                )}
              </div>

              {/* Basic Info Only */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center">
                  📅 Joined: <strong className="ml-1">
                    {formatJoinDate(user?.joinDate)}
                  </strong>
                </span>
                
                <span className="flex items-center">
                  🎮 Favorite: <strong className="ml-1 text-blue-600">
                    {user?.favoriteGameType || 'None yet'}
                  </strong>
                </span>
                
                <span className="flex items-center">
                  🕐 Last Active: <strong className="ml-1">
                    {user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Today'}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
