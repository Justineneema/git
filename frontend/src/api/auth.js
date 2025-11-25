import { api, setAuthToken } from './axios';

export const authAPI = {
  login: async (username, password) => {
    try {
      console.log('Attempting login for user:', username);
      const response = await api.post('auth/login/', { 
        username, 
        password 
      });
      
      const { access, refresh, user } = response.data;
      
      // Set auth token
      setAuthToken(access);
      
      // Store user data
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('refresh_token', refresh);
      
      console.log('Login successful for user:', user.username);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (username, password, isExpert = false) => {
    try {
      console.log('Attempting registration for user:', username);
      const response = await api.post('auth/register/', { 
        username, 
        password,
        is_expert: isExpert 
      });
      
      const { access, refresh, user } = response.data;
      
      // Set auth token
      setAuthToken(access);
      
      // Store user data
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('refresh_token', refresh);
      
      console.log('Registration successful for user:', user.username);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      });
      throw error;
    }
  },

  logout: () => {
    console.log('Logging out user');
    setAuthToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('auth_user');
      const user = userStr ? JSON.parse(userStr) : null;
      console.log('Retrieved current user:', user?.username);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    const isAuth = !!localStorage.getItem('auth_token');
    console.log('Authentication check:', isAuth);
    return isAuth;
  }
};

export default authAPI;