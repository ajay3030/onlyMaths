// src/App.jsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { UIProvider } from './context/UIContext';
import {UserStatsProvider} from './context/UserStatsContext'
import AppRouter from './routes/AppRouter';
import NotificationSystem from './components/common/UI/NotificationSystem/NotificationSystem';
// import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <UIProvider>
        <AuthProvider>
          <UserStatsProvider> 
          <GameProvider>
            <AppRouter />
            <NotificationSystem />
          </GameProvider>
          </UserStatsProvider> 
        </AuthProvider>
      </UIProvider>
    </div>
  );
}

export default App;
