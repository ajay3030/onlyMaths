// src/context/UIContext/UIContext.js
import { createContext } from 'react';

export const UIContext = createContext({
  modals: {},
  notifications: [],
  theme: 'kids',
  loading: {},
  openModal: () => {},
  closeModal: () => {},
  showNotification: () => {},
  setTheme: () => {},
  setLoadingState: () => {}
});
