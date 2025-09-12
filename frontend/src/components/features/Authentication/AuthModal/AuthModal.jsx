// src/components/features/Authentication/AuthModal/AuthModal.jsx
import React, { useState } from 'react';
// import { useAuth } from '../../../../context/AuthContext';
import { useUI } from '../../../../context/UIContext';
import Modal from '../../../common/UI/Modal/Modal';
import Button from '../../../common/UI/Button';
import LoginForm from '../LoginForm/LoginForm';
import SignupForm from '../SignupForm/SignupForm';

const AuthModal = () => {
  const { modals, closeModal } = useUI();
  const [activeTab, setActiveTab] = useState('login');
  
  const isOpen = modals.auth?.isOpen || false;
  const initialMode = modals.auth?.props?.mode || 'login';

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleClose = () => {
    closeModal('auth');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      showCloseButton={false}
    >
      <div className="text-center max-h-[80vh] overflow-y-auto">
        {/* Header with mascot */}
        <div className="mb-6">
          <div className="text-4xl mb-2 animate-bounce">🔢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to OnlyMaths!
          </h2>
          <p className="text-gray-600 text-sm">
            Join thousands of kids learning math the fun way!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
              activeTab === 'login'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
              activeTab === 'signup'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <div >
          {activeTab === 'login' ? (
            <LoginForm onSuccess={handleClose} />
          ) : (
            <SignupForm onSuccess={handleClose} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Safe, fun, and educational math games for kids! 🎯
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
