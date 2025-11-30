import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      // Provide clearer error text when express-validator returns errors array
      const data = error.response?.data;
      let message = 'Login failed';
      if (data) {
        if (data.message) message = data.message;
        else if (Array.isArray(data.errors)) message = data.errors.map(e => e.msg || e.message).join('; ');
        else message = JSON.stringify(data);
      } else if (error.message) {
        message = error.message;
      }

      return {
        success: false,
        error: message
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const data = error.response?.data;
      let message = 'Registration failed';
      if (data) {
        if (data.message) message = data.message;
        else if (Array.isArray(data.errors)) message = data.errors.map(e => e.msg || e.message).join('; ');
        else message = JSON.stringify(data);
      } else if (error.message) {
        message = error.message;
      }

      return {
        success: false,
        error: message
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
