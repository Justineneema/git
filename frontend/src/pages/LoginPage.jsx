import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Starting login process...');
      await authAPI.login(username, password);
      
      // Get redirect path or default to dashboard
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      console.log('Login successful, redirecting to:', redirectPath);
      
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Login page error:', err);
      
      // Handle different error types
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
              disabled={loading}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input 
              type="password" 
              className="input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <button 
            className="btn-primary w-full" 
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
          <strong>Debug Info:</strong> API Base: {import.meta.env.VITE_API_BASE || 'https://git-4-8zex.onrender.com/api/'}
        </div>
        
        <p className="mt-3 text-sm text-center">
          No account?{' '}
          <Link className="text-forest underline hover:text-forest-dark" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}