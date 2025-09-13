// src/components/features/Profile/UserInfo/UserInfo.jsx
import React, { useState } from 'react';
import { useProfile } from '../../../../context/ProfileContext';

const UserInfo = ({ user, stats }) => {
   const { profileSettings, updateProfileSettings, updateAvatar, updateDisplayName } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: profileSettings?.displayName || user?.name || '',
    avatar: profileSettings?.avatar || user?.avatar || '🧒',
    bio: profileSettings?.bio || ''
  });

  const avatarOptions = ['🧒', '👧', '👦', '🦸‍♂️', '🦸‍♀️', '🤖', '👨‍🎓', '👩‍🎓', '🧙‍♂️', '🧙‍♀️'];

  const handleSaveProfile = async () => {
    try {
      await updateDisplayName(editForm.displayName);
      await updateAvatar(editForm.avatar);
      await updateProfileSettings({ bio: editForm.bio });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      avatar: user?.avatar || '🧒'
    });
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (profileSettings) {
      setEditForm({
        displayName: profileSettings.displayName || user?.name || '',
        avatar: profileSettings.avatar || user?.avatar || '🧒',
        bio: profileSettings.bio || ''
      });
    }
  }, [profileSettings, user]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
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
  );
};

export default UserInfo;
