import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage({ auth }) {
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
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
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
      await auth.register(username, password, isExpert);
      
      setSuccess(`Registration successful! Welcome ${username}. You are now logged in.`);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
      
    } catch (err) {
      console.error('Registration page error:', err);
      
      // Extract user-friendly error message
      let errorMessage = 'Registration failed. Please try again.';
      
      // Check for timeout
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timeout. The server may be starting up. Please try again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Registration endpoint not found. Please contact support.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.username) {
        const usernameError = err.response.data.username;
        errorMessage = Array.isArray(usernameError) ? usernameError[0] : usernameError;
      } else if (err.response?.data?.password) {
        const passwordError = err.response.data.password;
        errorMessage = Array.isArray(passwordError) ? passwordError[0] : passwordError;
      } else if (err.response?.data?.email) {
        const emailError = err.response.data.email;
        errorMessage = Array.isArray(emailError) ? emailError[0] : emailError;
      } else if (err.response?.data) {
        // Handle Django REST framework validation errors
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // Find the first error message
          for (const key in errorData) {
            if (Array.isArray(errorData[key]) && errorData[key].length > 0) {
              errorMessage = `${key}: ${errorData[key][0]}`;
              break;
            } else if (typeof errorData[key] === 'string') {
              errorMessage = errorData[key];
              break;
            }
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-forest">Create Account</h2>
        <p className="text-sm text-gray-600 mt-1">Join CropDetector to start identifying plant diseases</p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input 
              className="input" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Enter your username"
              minLength={3}
              autoComplete="username"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 3 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={loading}
              placeholder="Create a password"
              minLength={4}
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 4 characters</p>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              id="expert"
              checked={isExpert} 
              onChange={e => setIsExpert(e.target.checked)} 
              disabled={loading}
              className="h-4 w-4 text-forest border-gray-300 rounded focus:ring-forest"
            />
            <label htmlFor="expert" className="text-sm font-medium">
              Register as agricultural expert
            </label>
          </div>
          
          {error && (
            <div className="p-3 text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {success && (
            <div className="p-3 text-green-700 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{success}</span>
              </div>
            </div>
          )}
          
          <button 
            className="btn-primary w-full py-3" 
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Creating your account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link 
              className="text-forest font-semibold hover:text-forest-dark transition-colors" 
              to="/login"
            >
              Sign in here
            </Link>
          </p>
        </div>
        
        {/* Debug info */}
        {/* <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>API Base:</strong> {import.meta.env.VITE_API_BASE || 'https://git-4-8zex.onrender.com/api'}
          </p>
        </div> */}
      </div>
    </div>
  );
}
