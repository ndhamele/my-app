import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    console.log("AuthContext: useEffect - isLoggedIn", !!token); // Debugging
  }, []); // Empty dependency array means this runs once on mount

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    console.log("AuthContext: login - isLoggedIn set to true"); // Debugging
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    console.log("AuthContext: logout - isLoggedIn set to false"); // Debugging
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
