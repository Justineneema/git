import axios from 'axios'

// Use environment variable with fallback for production
const baseURL = import.meta.env.VITE_API_BASE || 'https://git-4-8zex.onrender.com/api/'

console.log('API Base URL:', baseURL) // Debug log

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to false to avoid CORS issues with credentials 
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('auth_token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('auth_token')
  }
}

// Initialize auth token
const token = localStorage.getItem('auth_token')
if (token) {
  setAuthToken(token)
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear auth and redirect to login
      setAuthToken(null)
      localStorage.removeItem('auth_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - backend might be down')
      // Show user-friendly message
      if (error.config && error.config.url !== '/health/') {
        alert('Cannot connect to server. Please check your connection and try again.')
      }
    }
    
    return Promise.reject(error)
  }
)

// Health check function
export const healthCheck = async () => {
  try {
    // Remove /api from baseURL for health check
    const healthURL = baseURL.replace('/api', '') + '/health/'
    const response = await axios.get(healthURL, { timeout: 10000 })
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

export default api