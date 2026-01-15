import React from 'react';
import { createBrowserRouter, Navigate } from "react-router";
import DigitalTwinPage from '../pages/DigitalTwinPage';
import LoginPage from '../Components/Auth/LoginPage';
import ProtectedRoute from '../Components/ProtectedRoute';
import useAuthStore from '../store/useAuthStore';

// Check auth status for root redirect
const RootRedirect = () => {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DigitalTwinPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <h1 className="text-white text-center text-2xl">404 Not Found</h1>
      </div>
    ),
  }
]);

export default router;