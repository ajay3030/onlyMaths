// src/context/UIContext/UIProvider.jsx
import React, { useState, useCallback } from 'react';
import { UIContext } from './UIContext';

export const UIProvider = ({ children }) => {
  const [modals, setModals] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('kids');
  const [loading, setLoading] = useState({});

  const openModal = useCallback((modalName, props = {}) => {
    setModals(prev => ({ ...prev, [modalName]: { isOpen: true, props } }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: { isOpen: false, props: {} } }));
  }, []);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const setLoadingState = useCallback((key, isLoading) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  const contextValue = {
    modals,
    notifications,
    theme,
    loading,
    openModal,
    closeModal,
    showNotification,
    setTheme,
    setLoadingState
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
};
