import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user (session-based)
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('AuthService login error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        const errorMessage = errorData.message || 'Login failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        // Other error (including our test error above)
        throw new Error(error.message || 'An unexpected error occurred. Please try again.');
      }
    }
  },

  // Logout user (session-based)
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated (session-based)
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return !!user;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check authentication status with server
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data.success && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data.data.user;
      }
      return null;
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  },
};
