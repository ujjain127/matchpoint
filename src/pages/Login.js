import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import './Auth.css';
import { auth } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/book';
  const selectedFacility = location.state?.selectedFacility;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.trim() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await auth.login(formData);
      console.log('Login successful:', response.data);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Navigate with the selected facility
      navigate(from, { 
        state: { selectedFacility: selectedFacility },
        replace: true 
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.error || 
        err.response?.data?.error || 
        'Login failed - please check your credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="auth-error">
            <p>{error}</p>
            {error.includes('not found') && (
              <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <EnvelopeIcon className="input-icon" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>
              <LockClosedIcon className="input-icon" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login; 