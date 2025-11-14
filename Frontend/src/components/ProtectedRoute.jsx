import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Protected Route Component
 * 
 * Wrapper component that protects routes requiring authentication
 * - Redirects unauthenticated users to login page
 * - Preserves intended destination for post-login redirect
 * - Shows loading spinner while checking authentication status
 * 
 * @param {React.ReactNode} children - Protected component to render
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Pass current location as state to redirect back after login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Render protected component if authenticated
  return children;
};

export default ProtectedRoute;