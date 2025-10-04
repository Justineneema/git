import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleLogin(e){
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if(found){
      localStorage.setItem('currentUser', JSON.stringify(found))
      navigate('/dashboard')
    } else {
      alert('Invalid credentials. Try signup or check details.')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 container-card">
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control bg-black text-white" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control bg-black text-white" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-light">Login</button>
        </form>
        <p className="small-muted mt-3">Demo accounts are stored in localStorage. This is a frontend-only demo.</p>
      </div>
    </div>
  )
}
