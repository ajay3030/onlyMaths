// src/context/ProfileContext/ProfileContext.js
import { createContext } from 'react';

export const ProfileContext = createContext({
  preferences: null,
  profileSettings: null,
  isLoading: false,
  updatePreferences: () => {},
  updateProfileSettings: () => {},
  updateAvatar: () => {},
  updateDisplayName: () => {},
  resetProfile: () => {}
});

export default ProfileContext;
