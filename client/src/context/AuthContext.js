import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from storage on initial load
  useEffect(() => {
    const loadUserState = () => {
      // First try to get from sessionStorage (tab-specific)
      const sessionToken = sessionStorage.getItem('token');
      const sessionUser = sessionStorage.getItem('user');
      
      if (sessionToken && sessionUser) {
        setUser(JSON.parse(sessionUser));
        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
        setLoading(false);
        return;
      }
      
      // If not in sessionStorage, try localStorage (persistent)
      const localToken = localStorage.getItem('token');
      const localUser = localStorage.getItem('user');
      
      if (localToken && localUser) {
        // Load from localStorage (persistent login)
        setUser(JSON.parse(localUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${localToken}`;
        
        // Also set in sessionStorage for this tab
        sessionStorage.setItem('token', localToken);
        sessionStorage.setItem('user', localUser);
      }
      
      setLoading(false);
    };

    loadUserState();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', userData);
      
      if (res.data.success) {
        // Store in both storages by default on registration
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Also store in localStorage for persistence
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setUser(res.data.user);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData, rememberMe = true) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', userData);
      
      if (res.data.success) {
        // Always store in sessionStorage (current tab)
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        
        // If remember me is checked, also store in localStorage
        if (rememberMe) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        
        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setUser(res.data.user);
        setError(null);
        return true;
      } else {
        // Handle case where success is false
        setError(res.data.msg || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user (from current tab)
  const logout = () => {
    // Clear sessionStorage (current tab)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Also clear localStorage to ensure complete logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};