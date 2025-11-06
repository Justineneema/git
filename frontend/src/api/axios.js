import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/'

export const api = axios.create({
  baseURL,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Initialize Authorization header from localStorage on first load
try {
  const stored = localStorage.getItem('auth')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed?.access) {
      setAuthToken(parsed.access)
    }
  }
} catch (_) {}

// Global 401 handler: clear auth and reload to force login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try { localStorage.removeItem('auth') } catch (_) {}
      setAuthToken(null)
      // Optional: hard refresh to reset app state
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)


