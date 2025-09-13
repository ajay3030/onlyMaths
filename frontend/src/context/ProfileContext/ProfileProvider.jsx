// src/context/ProfileContext/ProfileProvider.jsx - CLEAN VERSION
import React, { useReducer, useCallback, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { profileService } from '../../service/profileService'; // IMPORT from separate file
import {ProfileContext} from './ProfileContext'
// const ProfileContext = createContext();

// Profile reducer (keep the same)
const profileReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_PROFILE_START':
      return { ...state, isLoading: true };
    
    case 'LOAD_PROFILE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        preferences: action.payload.preferences,
        profileSettings: action.payload.profileSettings
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case 'UPDATE_PROFILE_SETTINGS':
      return {
        ...state,
        profileSettings: { ...state.profileSettings, ...action.payload }
      };
    
    case 'UPDATE_AVATAR':
      return {
        ...state,
        profileSettings: { 
          ...state.profileSettings, 
          avatar: action.payload 
        }
      };
    
    case 'UPDATE_DISPLAY_NAME':
      return {
        ...state,
        profileSettings: { 
          ...state.profileSettings, 
          displayName: action.payload 
        }
      };
    
    case 'RESET_PROFILE':
      return initialState;
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  preferences: null,
  profileSettings: null,
  isLoading: false
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { user } = useAuth();

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    dispatch({ type: 'LOAD_PROFILE_START' });
    
    try {
      const data = await profileService.loadProfile(user.id);
      
      if (data) {
        dispatch({ type: 'LOAD_PROFILE_SUCCESS', payload: data });
      } else {
        // Generate defaults for new users
        const defaults = profileService.generateDefaults(user);
        
        dispatch({ type: 'LOAD_PROFILE_SUCCESS', payload: defaults });
        
        // Save defaults
        await profileService.savePreferences(user.id, defaults.preferences);
        await profileService.saveProfileSettings(user.id, defaults.profileSettings);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Load defaults on error
      const defaults = profileService.generateDefaults(user);
      dispatch({ type: 'LOAD_PROFILE_SUCCESS', payload: defaults });
    }
  }, [user]);

  // Update preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: newPreferences });
    
    if (user?.id) {
      try {
        const updated = { ...state.preferences, ...newPreferences };
        await profileService.savePreferences(user.id, updated);
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    }
  }, [user?.id, state.preferences]);

  // Update profile settings
  const updateProfileSettings = useCallback(async (newSettings) => {
    dispatch({ type: 'UPDATE_PROFILE_SETTINGS', payload: newSettings });
    
    if (user?.id) {
      try {
        const updated = { ...state.profileSettings, ...newSettings };
        await profileService.saveProfileSettings(user.id, updated);
      } catch (error) {
        console.error('Failed to save profile settings:', error);
      }
    }
  }, [user?.id, state.profileSettings]);

  // Update avatar
  const updateAvatar = useCallback(async (newAvatar) => {
    dispatch({ type: 'UPDATE_AVATAR', payload: newAvatar });
    
    if (user?.id) {
      try {
        await profileService.updateProfileSetting(user.id, 'avatar', newAvatar);
      } catch (error) {
        console.error('Failed to save avatar:', error);
      }
    }
  }, [user?.id]);

  // Update display name
  const updateDisplayName = useCallback(async (newName) => {
    dispatch({ type: 'UPDATE_DISPLAY_NAME', payload: newName });
    
    if (user?.id) {
      try {
        await profileService.updateProfileSetting(user.id, 'displayName', newName);
      } catch (error) {
        console.error('Failed to save display name:', error);
      }
    }
  }, [user?.id]);

  // Reset profile
  const resetProfile = useCallback(() => {
    dispatch({ type: 'RESET_PROFILE' });
  }, []);

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      resetProfile();
    }
  }, [user, loadProfile, resetProfile]);

  const contextValue = {
    ...state,
    loadProfile,
    updatePreferences,
    updateProfileSettings,
    updateAvatar,
    updateDisplayName,
    resetProfile
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
