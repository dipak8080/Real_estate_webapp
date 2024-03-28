// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Make sure the import path is correct

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If the route is for admins only and the user is not an admin, redirect to home or an unauthorized page
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children; // If authenticated, and not adminOnly or if adminOnly and isAdmin, render the child component
};

export default ProtectedRoute;