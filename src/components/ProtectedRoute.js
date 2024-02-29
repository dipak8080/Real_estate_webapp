// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the import path as needed

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page. React Router v6 uses the state
    // prop in Navigate for passing the current location to the login page.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children; // If authenticated, render the child component
};

export default ProtectedRoute;
