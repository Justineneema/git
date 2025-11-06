import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSignup(e){
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if(users.find(u => u.email === email)){
      alert('Email already in use')
      return
    }
    const newUser = { id: Date.now(), name, email, password, role: 'student', points: 0, progress: [] }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    navigate('/dashboard')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 container-card">
        <h3>Sign Up</h3>
        <form onSubmit={handleSignup}>
          <div className="mb-2">
            <label>Name</label>
            <input className="form-control bg-black text-white" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label>Email</label>
            <input type="email" className="form-control bg-black text-white" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control bg-black text-white" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-light">Create Account</button>
        </form>
      </div>
    </div>
  )
}
