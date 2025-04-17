import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Helper functions to create user-specific storage keys
  const getTokenKey = (userId) => `jobswipe_token_${userId}`;
  const getUserKey = (userId) => `jobswipe_user_${userId}`;
  const getCurrentUserIdKey = () => 'jobswipe_current_user_id';

  // Load user from storage on initial load
  useEffect(() => {
    const loadUserState = () => {
      try {
        // Get the current active user ID
        const currentUserId = sessionStorage.getItem(getCurrentUserIdKey()) || 
                              localStorage.getItem(getCurrentUserIdKey());
        
        if (!currentUserId) {
          setLoading(false);
          return;
        }
        
        // Try session storage first (tab-specific)
        let token = sessionStorage.getItem(getTokenKey(currentUserId));
        let userData = sessionStorage.getItem(getUserKey(currentUserId));
        
        // If not found in session storage, try local storage (persistent)
        if (!token || !userData) {
          token = localStorage.getItem(getTokenKey(currentUserId));
          userData = localStorage.getItem(getUserKey(currentUserId));
        }
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          axios.defaults.headers.common['x-auth-token'] = token;
        }
      } catch (err) {
        console.error('Error loading auth state:', err);
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
        const { token, user: newUser } = res.data;
        const userId = newUser._id;
        
        // Store user ID as the current active user
        sessionStorage.setItem(getCurrentUserIdKey(), userId);
        localStorage.setItem(getCurrentUserIdKey(), userId);
        
        // Store token and user data in user-specific storage
        sessionStorage.setItem(getTokenKey(userId), token);
        sessionStorage.setItem(getUserKey(userId), JSON.stringify(newUser));
        
        // Also store in localStorage for persistence
        localStorage.setItem(getTokenKey(userId), token);
        localStorage.setItem(getUserKey(userId), JSON.stringify(newUser));
        
        // Set auth token header
        axios.defaults.headers.common['x-auth-token'] = token;
        
        setUser(newUser);
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
        const { token, user: loggedInUser } = res.data;
        const userId = loggedInUser._id;
        
        // Always store current user ID in session storage (tab-specific)
        sessionStorage.setItem(getCurrentUserIdKey(), userId);
        
        // Always store user data and token in session storage (tab-specific)
        sessionStorage.setItem(getTokenKey(userId), token);
        sessionStorage.setItem(getUserKey(userId), JSON.stringify(loggedInUser));
        
        // If remember me is checked, also store in local storage
        if (rememberMe) {
          localStorage.setItem(getCurrentUserIdKey(), userId);
          localStorage.setItem(getTokenKey(userId), token);
          localStorage.setItem(getUserKey(userId), JSON.stringify(loggedInUser));
        }
        
        // Set auth token header
        axios.defaults.headers.common['x-auth-token'] = token;
        
        setUser(loggedInUser);
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

  // Logout user
  const logout = () => {
    if (user && user._id) {
      // Clear user-specific storage
      sessionStorage.removeItem(getTokenKey(user._id));
      sessionStorage.removeItem(getUserKey(user._id));
      localStorage.removeItem(getTokenKey(user._id));
      localStorage.removeItem(getUserKey(user._id));
    }
    
    // Clear current user ID
    sessionStorage.removeItem(getCurrentUserIdKey());
    localStorage.removeItem(getCurrentUserIdKey());
    
    delete axios.defaults.headers.common['x-auth-token'];
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