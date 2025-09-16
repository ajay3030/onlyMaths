// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import HomePage from '../pages/HomePage/HomePage';
import GamePage from '../pages/GamePage/GamePage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
// import NotFoundPage from '../pages/NotFoundPage';

// Components
import { Navbar, Footer } from '../components/common/Layout';
import AuthModal from '../components/features/Authentication/AuthModal/AuthModal';

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/game/:gameId" element={<GamePage />} />

            {/* <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} /> */}
          </Routes>
        </main>
        
        <Footer />
        <AuthModal />
      </div>
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
