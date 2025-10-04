import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import Practice from './components/Practice'
import Leaderboard from './components/Leaderboard'
import SchoolAdmin from './components/SchoolAdmin'
import Progress from './components/Progress'
import Certificate from './components/Certificate'

function App() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  function logout(){
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black px-3">
        <Link className="navbar-brand" to="/">Typing Academy</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            {currentUser && <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>}
            {currentUser && <li className="nav-item"><Link className="nav-link" to="/practice">Practice</Link></li>}
            <li className="nav-item"><Link className="nav-link" to="/leaderboard">Leaderboard</Link></li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {!currentUser && <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/signup">Sign up</Link></li>
            </>}
            {currentUser && <>
              <li className="nav-item small-muted align-self-center me-2">Hi, {currentUser.name}</li>
              <li className="nav-item"><button onClick={logout} className="btn btn-outline-light btn-sm">Logout</button></li>
            </>}
          </ul>
        </div>
      </nav>

      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/school-admin" element={<SchoolAdmin />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/certificate/:id" element={<Certificate />} />
        </Routes>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="text-center">
      <h1>Typing Academy</h1>
      <p className="small-muted">Practice typing, track progress, earn certificates — all in black & white.</p>
      <div className="mt-4">
        <Link to="/practice" className="btn btn-light me-2">Start Practice</Link>
        <Link to="/leaderboard" className="btn btn-outline-light">Leaderboard</Link>
      </div>
    </div>
  )
}

export default App
