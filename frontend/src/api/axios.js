import axios from 'axios';

// Use environment variable WITHOUT trailing slash
const baseURL = import.meta.env.VITE_API_BASE || 'https://git-4-8zex.onrender.com/api';

console.log('🔧 API Base URL:', baseURL);

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
    // Ensure URL starts with slash for proper concatenation
    if (config.url && !config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
    
    // Add auth token if available
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
    console.log(`✅ Response received: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    };
    
    console.error('❌ API Error:', errorDetails);

    // Handle 401 Unauthorized
    if (error?.response?.status === 401) {
      console.log('🛡️ Authentication failed, clearing tokens...');
      setAuthToken(null);
      localStorage.removeItem('auth');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
    }
    
    // Handle 400 Bad Request - Show validation errors
    if (error?.response?.status === 400) {
      const errorData = error.response.data;
      console.error('📝 Backend validation errors:', errorData);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error - Backend might be unavailable');
    }
    
    return Promise.reject(error);
  }
);

// Health check function
export const healthCheck = async () => {
  try {
    const healthURL = baseURL.replace('/api', '') + '/health/';
    console.log('🏥 Health check URL:', healthURL);
    const response = await axios.get(healthURL, { 
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Health check passed');
    return response.data;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    throw error;
  }
};

export default api;