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
    console.log(`✅ Response received from: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    // Enhanced error logging
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    };
    
    console.error('❌ API Error Details:', errorDetails);

    // Handle 401 Unauthorized - Clear all auth data
    if (error?.response?.status === 401) {
      console.log('🛡️  Authentication failed, clearing tokens...');
      setAuthToken(null);
      localStorage.removeItem('auth');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
      
      // Only redirect if not already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        console.log('🔀 Redirecting to login page...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    
    // Handle 400 Bad Request - Show specific error messages
    if (error?.response?.status === 400) {
      const errorData = error.response.data;
      if (typeof errorData === 'object') {
        console.error('📝 Validation errors:', errorData);
      }
    }
    
    // Handle 404 Not Found
    if (error?.response?.status === 404) {
      console.error('🔍 Endpoint not found:', error.config?.url);
    }
    
    // Handle 500 Internal Server Error
    if (error?.response?.status === 500) {
      console.error('💥 Server error - check backend logs');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error - Backend might be unavailable or CORS issue');
      if (error.config && !error.config.url.includes('/health/')) {
        // Show user-friendly error message only if not on auth pages
        setTimeout(() => {
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            alert('Cannot connect to server. Please check your internet connection and try again.');
          }
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

// Enhanced health check function
export const healthCheck = async () => {
  try {
    // Remove /api/ from baseURL for health check
    const healthURL = baseURL.replace('/api/', '') + 'health/';
    console.log('🏥 Health check URL:', healthURL);
    const response = await axios.get(healthURL, { 
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Health check passed:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    throw new Error(`Backend health check failed: ${error.message}`);
  }
};

// Helper function to test API connectivity
export const testConnection = async () => {
  try {
    const health = await healthCheck();
    return {
      success: true,
      health,
      baseURL,
      message: 'API connection successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      baseURL,
      message: 'API connection failed'
    };
  }
};

// Initialize connection test on import
console.log('🔧 Axios configured with:', { baseURL });

export default api;