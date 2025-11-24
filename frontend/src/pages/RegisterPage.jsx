import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isExpert, setIsExpert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Starting registration process...');
      await authAPI.register(username, password, isExpert);
      
      setSuccess(`Registration successful! Welcome ${username}. Redirecting to login...`);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login with your new account.' 
          } 
        });
      }, 2000);
      
    } catch (err) {
      console.error('Registration page error:', err);
      
      // Handle different error types
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data) {
        // Handle non-standard error formats
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          setError(JSON.stringify(errorData));
        } else {
          setError(errorData.toString());
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-forest">Register</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input 
              className="input" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Choose a username"
              minLength={3}
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
              placeholder="Choose a password (min 4 characters)"
              minLength={4}
            />
          </div>
          
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={isExpert} 
              onChange={e => setIsExpert(e.target.checked)} 
              disabled={loading}
            />
            Register as agricultural expert
          </label>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-700 text-sm bg-green-50 p-2 rounded">
              {success}
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <p className="mt-3 text-sm text-center">
          Already have an account?{' '}
          <Link className="text-forest underline hover:text-forest-dark" to="/login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
