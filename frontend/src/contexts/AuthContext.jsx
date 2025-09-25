import React, { createContext, useContext, useState, useEffect } from 'react';

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      const mockUser = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        role: getUserRole(email), // Determine role based on email
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`,
        loginTime: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem('veritasai_user', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true, user: mockUser };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Signup function
  const signup = async (userData) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        institution: userData.institution || null,
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=8b5cf6&color=fff`,
        signupTime: new Date().toISOString()
      };

      setUser(newUser);
      localStorage.setItem('veritasai_user', JSON.stringify(newUser));
      setLoading(false);
      return { success: true, user: newUser };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('veritasai_user');
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
    signup,
    logout,
    hasRole,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;