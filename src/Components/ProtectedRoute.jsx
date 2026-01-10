import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuthStore from '../store/useAuthStore';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated && location.pathname !== '/login') {
      // Store the intended destination
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, location]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
