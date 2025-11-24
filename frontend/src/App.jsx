import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadImage from './pages/UploadImage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import LandingPage from './pages/LandingPage.jsx'
import About from './pages/About.jsx'
import Experts from './pages/Experts.jsx'
import Support from './pages/Support.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import { api, setAuthToken } from './api/axios.js'

function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user?.access) setAuthToken(user.access)
  }, [user])

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login/', { username, password })
      const authData = { 
        access: data.access, 
        refresh: data.refresh, 
        user: data.user 
      }
      // Set token header immediately to avoid race on first protected fetch
      setAuthToken(authData.access)
      localStorage.setItem('auth', JSON.stringify(authData))
      setUser(authData)
      return authData
    } catch (error) {
      console.error('Login error in useAuth:', error.response?.data)
      throw error
    }
  }

  const register = async (username, password, is_expert = false) => {
    try {
      const { data } = await api.post('/auth/register/', { 
        username, 
        password, 
        is_expert 
      })
      const authData = { 
        access: data.access, 
        refresh: data.refresh, 
        user: data.user 
      }
      setAuthToken(authData.access)
      localStorage.setItem('auth', JSON.stringify(authData))
      setUser(authData)
      return authData
    } catch (error) {
      console.error('Registration error in useAuth:', error.response?.data)
      // Extract user-friendly error message
      const errorData = error.response?.data
      let errorMessage = 'Registration failed'
      
      if (errorData?.error) {
        errorMessage = errorData.error
      } else if (errorData?.username) {
        errorMessage = Array.isArray(errorData.username) ? errorData.username[0] : errorData.username
      } else if (errorData?.email) {
        errorMessage = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email
      } else if (typeof errorData === 'object') {
        // Try to find any error message in the response
        const firstError = Object.values(errorData).find(val => Array.isArray(val) && val.length > 0)
        if (firstError) {
          errorMessage = firstError[0]
        }
      }
      
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth')
    setAuthToken(null)
    setUser(null)
  }

  return useMemo(() => ({ user, login, register, logout }), [user])
}

function Protected({ children, auth }) {
  const location = useLocation()
  if (!auth?.user?.access) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function ProtectedAdmin({ children, auth }) {
  const location = useLocation()
  const isAdmin = !!(auth?.user?.user?.is_expert || auth?.user?.user?.is_staff)
  if (!auth?.user?.access) return <Navigate to="/login" replace state={{ from: location }} />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const auth = useAuth()

  return (
    <div className="app-bg flex min-h-screen flex-col">
      <Navbar auth={auth} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage auth={auth} />} />
          <Route path="/register" element={<RegisterPage auth={auth} />} />
          <Route path="/dashboard" element={<Protected auth={auth}><Dashboard auth={auth} /></Protected>} />
          <Route path="/upload" element={<Protected auth={auth}><UploadImage auth={auth} /></Protected>} />
          <Route path="/admin" element={<ProtectedAdmin auth={auth}><AdminDashboard auth={auth} /></ProtectedAdmin>} />
          <Route path="/history" element={<Protected auth={auth}><Dashboard auth={auth} /></Protected>} />
          <Route path="/about" element={<About />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}