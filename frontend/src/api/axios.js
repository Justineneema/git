import axios from 'axios';

// Use environment variable for API base URL
// For Vercel: Set VITE_API_BASE environment variable to your Render backend URL
const baseURL = import.meta.env.VITE_API_BASE || 'https://git-4-8zex.onrender.com/api';

console.log('API Base URL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 60000, // Increased to 60000ms for slow backend startup
  headers: { 
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }
}

// Initialize auth token from localStorage
const token = localStorage.getItem('auth_token');
if (token) {
  setAuthToken(token);
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(` Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error(' Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(` Response received: Status ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error(` Response error: Status ${error.response?.status}`, error.message);
    console.error('Response data:', error.response?.data);
    
    // Handl Unauthorization and redirections
    if (error.response?.status === 401) {
      console.warn(' 401 Unauthorized - Redirecting to login');
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // This allows the component to handle error messages from the backend
    if (error.response) {
      console.log(` Error response: Status ${error.response.status}`, error.response.data);
      throw error;
    }
    
    // Network error or other issue
    console.error(' Network error or no response');
    return Promise.reject(error);
  }
);

export default api;