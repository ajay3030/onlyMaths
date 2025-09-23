// src/routes/AppRouter.jsx - UPDATED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import GamePage from '../pages/GamePage/GamePage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';

// Components
import { Navbar, Footer } from '../components/common/Layout';
import AuthModal from '../components/features/Authentication/AuthModal/AuthModal';

// Layout component that conditionally shows navbar/footer
const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/game');

  if (isGamePage) {
    // Game pages: No navbar/footer, full screen
    return (
      <>
        {children}
        <AuthModal />
      </>
    );
  }

  // Regular pages: With navbar/footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      <AuthModal />
    </div>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <ConditionalLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} /> */}
        </Routes>
      </ConditionalLayout>
    </Router>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AppRouter;
