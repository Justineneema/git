import axios from 'axios';

// Use environment variable for API base URL
// For Vercel: Set VITE_API_BASE environment variable to your Render backend URL
const baseURL = import.meta.env.VITE_API_BASE || 'https://git-4-8zex.onrender.com/api';

console.log('🔧 API Base URL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
    if (config.url && !config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;