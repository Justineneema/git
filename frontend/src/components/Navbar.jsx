import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ auth }) {
  const { user, logout } = auth
  const location = useLocation()
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <header className="bg-white/80 backdrop-blur border-b border-green-200">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-forest"></div>
          <span className="font-semibold text-forest">AI Crop Disease Doctor</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link className={`hover:text-forest ${isActive('/')&&location.pathname==='/'?'text-forest font-medium':''}`} to="/">Home</Link>
              <Link className={`hover:text-forest ${isActive('/upload')?'text-forest font-medium':''}`} to="/upload">Upload</Link>
              {(user.user?.is_expert || user.user?.is_staff) ? (
                <>
                  <Link className={`hover:text-forest ${isActive('/dashboard')?'text-forest font-medium':''}`} to="/dashboard">Dashboard</Link>
                  <Link className={`hover:text-forest ${isActive('/admin')?'text-forest font-medium':''}`} to="/admin">Admin</Link>
                </>
              ) : (
                <Link className={`hover:text-forest ${isActive('/history')?'text-forest font-medium':''}`} to="/history">History</Link>
              )}
              <Link className={`hover:text-forest ${isActive('/experts')?'text-forest font-medium':''}`} to="/experts">Experts</Link>
              <Link className={`hover:text-forest ${isActive('/support')?'text-forest font-medium':''}`} to="/support">Support</Link>
              <button onClick={logout} className="btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link className={`hover:text-forest ${isActive('/')&&location.pathname==='/'?'text-forest font-medium':''}`} to="/">Home</Link>
              <Link className={`hover:text-forest ${isActive('/about')?'text-forest font-medium':''}`} to="/about">About</Link>
              <Link className={`hover:text-forest ${isActive('/experts')?'text-forest font-medium':''}`} to="/experts">Experts</Link>
              <Link className={`hover:text-forest ${isActive('/support')?'text-forest font-medium':''}`} to="/support">Support</Link>
              <Link className={`hover:text-forest ${isActive('/login')?'text-forest font-medium':''}`} to="/login">Login</Link>
              <Link className={`hover:text-forest ${isActive('/register')?'text-forest font-medium':''}`} to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
