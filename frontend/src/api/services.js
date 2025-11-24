import { api } from './axios'

export const cropAPI = {
  detect: async (imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post('/detect/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getHistory: async () => {
    const response = await api.get('/history/')
    return response.data
  },

  getHistoryById: async (id) => {
    const response = await api.get(`/history/${id}/`)
    return response.data
  },

  getDiseases: async () => {
    const response = await api.get('/diseases/')
    return response.data
  },

  getDiseaseById: async (id) => {
    const response = await api.get(`/diseases/${id}/`)
    return response.data
  }
}

// Health check service
export const healthService = {
  check: async () => {
    try {
      const healthURL = 'https://git-4-8zex.onrender.com/health/'
      const response = await fetch(healthURL, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return await response.json()
    } catch (error) {
      throw new Error('Backend health check failed')
    }
  }
}

export default cropAPI