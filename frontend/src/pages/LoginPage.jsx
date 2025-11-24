import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { authAPI } from '../api/auth' // Import directly

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authAPI.login(username, password)
      const to = location.state?.from?.pathname || '/dashboard'
      navigate(to, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-forest">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input 
              className="input" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input 
              className="input" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button 
            className="btn-primary w-full" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-3 text-sm">
          No account? <Link className="text-forest underline" to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}