import axios from 'axios';

// Ensure baseURL ends with /api/ (with trailing slash)
const baseURL = import.meta.env.VITE_API_BASE || 'https://git-4-8zex.onrender.com/api/';

console.log('API Base URL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 
    'Content-Type': 'application/json',
  },
  withCredentials: false,
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

// Request interceptor - FIXED URL HANDLING
api.interceptors.request.use(
  (config) => {
    // Remove leading slash from URL to prevent double slashes
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }
    
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle 401 Unauthorized
    if (error?.response?.status === 401) {
      setAuthToken(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - Backend might be unavailable');
      if (error.config && !error.config.url.includes('/health/')) {
        // Show user-friendly error message
        setTimeout(() => {
          if (!window.location.pathname.includes('/login')) {
            alert('Cannot connect to server. Please check your internet connection and try again.');
          }
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

// Health check function
export const healthCheck = async () => {
  try {
    // Remove /api/ from baseURL for health check
    const healthURL = baseURL.replace('/api/', '') + 'health/';
    console.log('Health check URL:', healthURL);
    const response = await axios.get(healthURL, { 
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;