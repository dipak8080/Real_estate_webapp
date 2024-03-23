// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
  });

  const login = (user) => {
    setAuthState({
      isAuthenticated: true,
      isAdmin: user.isAdmin,
      user: user,
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
