import axios from 'axios'

// Base URL – Works in both development and production
// Make sure VITE_API_BASE ends with `/api/`
const baseURL =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') + '/' || 
  'https://git-4-8zex.onrender.com/api/'

console.log('API Base URL:', baseURL) // Debug log

export const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Set authorization token helper
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('auth_token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('auth_token')
  }
}

// Load token on startup
const token = localStorage.getItem('auth_token')
if (token) {
  setAuthToken(token)
}

// REQUEST interceptor
api.interceptors.request.use(
  (config) => {
    // Fix: remove leading slash to prevent overriding baseURL
    if (config.url.startsWith('/')) {
      config.url = config.url.substring(1)
    }

    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`
    )

    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `Response received from: ${response.config.url}`,
      response.status
    )
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)

    // Unauthorized
    if (error?.response?.status === 401) {
      setAuthToken(null)
      localStorage.removeItem('auth_user')
      localStorage.removeItem('refresh_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Network-level error (backend down)
    if (!error.response) {
      console.error('Network error — backend might be down')
    }

    return Promise.reject(error)
  }
)

// HEALTH CHECK for backend availability
export const healthCheck = async () => {
  try {
    const healthURL = baseURL.replace('/api/', '/health/')
    const response = await axios.get(healthURL, { timeout: 10000 })
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

export default api
