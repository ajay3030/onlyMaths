// src/App.jsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { UIProvider } from './context/UIContext';
import AppRouter from './routes/AppRouter';
import NotificationSystem from './components/common/UI/NotificationSystem/NotificationSystem';
// import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <UIProvider>
        <AuthProvider>
          <GameProvider>
            <AppRouter />
            <NotificationSystem />
          </GameProvider>
        </AuthProvider>
      </UIProvider>
    </div>
  );
}

export default App;
