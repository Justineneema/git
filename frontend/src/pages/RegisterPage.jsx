import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage({ auth }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isExpert, setIsExpert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await auth.register(username, password, isExpert)
      setSuccess('Registration successful. You can login now.')
      setTimeout(()=>navigate('/login'), 800)
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-forest">Register</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input className="input" value={username} onChange={e=>setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isExpert} onChange={e=>setIsExpert(e.target.checked)} /> Register as expert
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-700 text-sm">{success}</div>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <p className="mt-3 text-sm">Have an account? <Link className="text-forest underline" to="/login">Login</Link></p>
      </div>
    </div>
  )
}


