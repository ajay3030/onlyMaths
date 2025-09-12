// src/context/AuthContext/AuthContext.js
import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  signup: () => {},
  error: null,
  clearError: () => {}
});
