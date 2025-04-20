import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper functions to create user-specific storage keys (match those in AuthContext)
const getTokenKey = (userId) => `jobswipe_token_${userId}`;
const getCurrentUserIdKey = () => 'jobswipe_current_user_id';

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  config => {
    try {
      // Get current user ID first
      const currentUserId = sessionStorage.getItem(getCurrentUserIdKey()) || 
                            localStorage.getItem(getCurrentUserIdKey());
      
      if (!currentUserId) {
        console.log('No current user ID found');
        return config;
      }
      
      // Get token using the user-specific key
      let token = sessionStorage.getItem(getTokenKey(currentUserId));
      
      // If not in sessionStorage, try localStorage
      if (!token) {
        token = localStorage.getItem(getTokenKey(currentUserId));
      }
      
      if (token) {
        // Set both header formats to ensure compatibility with the server
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-auth-token'] = token;
        
        // For debugging - remove in production
        console.log('Token added to request:', token.substring(0, 15) + '...');
      } else {
        console.log('No auth token found for user:', currentUserId);
      }
    } catch (err) {
      console.error('Error setting auth token in request:', err);
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;