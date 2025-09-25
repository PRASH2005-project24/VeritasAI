import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('veritasai_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('veritasai_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success) {
        const userData = {
          ...response.user,
          avatar: `https://ui-avatars.com/api/?name=${response.user.name}&background=3b82f6&color=fff`
        };
        
        setUser(userData);
        localStorage.setItem('veritasai_user', JSON.stringify(userData));
        localStorage.setItem('veritasai_token', response.token);
        
        setLoading(false);
        return { success: true, user: userData };
      } else {
        setLoading(false);
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        const user = {
          ...response.user,
          avatar: `https://ui-avatars.com/api/?name=${response.user.name}&background=8b5cf6&color=fff`
        };
        
        setUser(user);
        localStorage.setItem('veritasai_user', JSON.stringify(user));
        localStorage.setItem('veritasai_token', response.token);
        
        setLoading(false);
        return { success: true, user };
      } else {
        setLoading(false);
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('veritasai_user');
    localStorage.removeItem('veritasai_token');
  };

  // Helper function to determine user role based on email
  const getUserRole = (email) => {
    if (email.includes('admin') || email.includes('superuser')) {
      return 'admin';
    } else if (email.includes('institution') || email.includes('university') || email.includes('college')) {
      return 'institution';
    } else {
      return 'student'; // Default to student/verifier
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;