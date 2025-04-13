import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  config => {
    // First check sessionStorage (tab-specific)
    let token = sessionStorage.getItem('token');
    
    // If not in sessionStorage, try localStorage (persistent)
    if (!token) {
      token = localStorage.getItem('token');
      
      // If found in localStorage, sync it to sessionStorage for this tab
      if (token) {
        sessionStorage.setItem('token', token);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;