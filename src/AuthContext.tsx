import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isLoggedIn: boolean;
  isInstructor: boolean; // Added for role-based routing [2/2]
  login: (token: string, role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false); // Added for role-based routing [1/2
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    console.log("AuthContext: useEffect - isLoggedIn", !!token); // Debugging
  }, []); // Empty dependency array means this runs once on mount

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role',  role);
    if (role === 'Instructor') {
      setIsInstructor(true);
    }
    setIsLoggedIn(true);

    console.log("AuthContext: login - isLoggedIn set to true"); // Debugging
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    console.log("AuthContext: logout - isLoggedIn set to false"); // Debugging
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isInstructor }}>
      {children}
    </AuthContext.Provider>
  );
};
