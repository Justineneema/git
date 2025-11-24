import { api, setAuthToken } from './axios'

export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password })
      const { access, refresh, user } = response.data
      
      // Set auth token
      setAuthToken(access)
      
      // Store user data
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('refresh_token', refresh)
      
      return response.data
    } catch (error) {
      throw error
    }
  },

  register: async (username, password, isExpert = false) => {
    try {
      const response = await api.post('/auth/register/', { 
        username, 
        password,
        is_expert: isExpert 
      })
      const { access, refresh, user } = response.data
      
      // Set auth token
      setAuthToken(access)
      
      // Store user data
      localStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.setItem('refresh_token', refresh)
      
      return response.data
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    setAuthToken(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_token')
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('auth_user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      return null
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token')
  }
}

export default authAPI