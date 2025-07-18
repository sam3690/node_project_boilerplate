import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests for session-based auth
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Don't redirect on auth errors, let the component handle it
    if (error.response?.status === 401) {
      // Session expired or invalid - just remove user data, don't redirect
      localStorage.removeItem('user');
      // Don't use window.location.href as it causes page reload
    }
    
    // Return the error for the component to handle
    return Promise.reject(error);
  }
);

export default api;