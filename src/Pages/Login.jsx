// src/Login.js (unchanged, but CSS updated below for consistency)
import React, { useState, useContext } from 'react';
import axiosInstance from '../Utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      console.log("Login successful:", res.data);
      navigate('/home');
    } catch (error) {
      console.error("Login error:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
      <div className="login-card">
        <div className="card-header">
          <div className="logo-section">
            <div className="login-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" opacity="0.9"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
            </div>
            <h2 style={{ color: 'white' }}>YoChat</h2>
          </div>
          <h1 style={{ color: 'white' }}>Welcome back!</h1>
          <p style={{ color: 'white' }}>We're so excited to see you again!</p>
        </div>
       
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-field">
            <label htmlFor="email" style={{ color: 'white' }}>
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              style={{ color: 'white' }}
            />
          </div>
         
          <div className="form-field">
            <label htmlFor="password" style={{ color: 'white' }}>
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              style={{ color: 'white' }}
            />
            <button type="button" className="forgot-link" style={{ color: 'white' }}>Forgot password?</button>
          </div>
          {error && (
            <div className="error-banner" style={{ color: 'white' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 4V8M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                <span style={{ color: 'white' }}>Logging in...</span>
              </>
            ) : (
              <span style={{ color: 'white' }}>Log In</span>
            )}
          </button>
        </form>
       
        <div className="card-footer">
          <span className="footer-text" style={{ color: 'white' }}>Need an account?</span>
          <button
            className="register-btn"
            onClick={() => navigate('/register')}
            disabled={loading}
          >
            <span style={{ color: 'white' }}>Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;