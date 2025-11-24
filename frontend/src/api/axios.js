import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || 
  'https://git-4-8zex.onrender.com/api';

console.log('API Base URL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
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

// Load token if exists
const token = localStorage.getItem('auth_token');
if (token) setAuthToken(token);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Remove leading slash to prevent overriding baseURL
    if (config.url.startsWith('/')) config.url = config.url.slice(1);

    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    console.log(`Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      setAuthToken(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }

    if (!error.response) console.error('Network error — backend might be down');

    return Promise.reject(error);
  }
);

// Backend health check
export const healthCheck = async () => {
  try {
    const healthURL = baseURL.replace(/\/api$/, '/health');
    const response = await axios.get(healthURL, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
