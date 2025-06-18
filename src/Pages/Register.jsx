import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3 || formData.username.length > 20) {
      setError('Username must be 3-20 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers and underscores');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

const handleRegister = async (e) => {
  e.preventDefault();
  setError('');
  
  if (!validateForm()) return;
  
  setLoading(true);
  
  try {
    const res = await axios.post(
      "https://yochat-backend-1.onrender.com/api/auth/register",
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log("Registration response:", res.data);
    
    if (res.data.token && res.data.user) {
      navigate("/login", { 
        state: { 
          registrationSuccess: true,
          message: "Registration successful! Please log in.",
          email: formData.email
        } 
      });
    } else {
      setError(res.data.message || 'Registration completed but unexpected response');
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response) {
      setError(error.response.data?.error || 
              error.response.data?.message || 
              'Registration failed. Please try again.');
    } else if (error.request) {
      setError('Network error. Please check your connection and try again.');
    } else {
      setError('An unexpected error occurred. Please try again later.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleGetStarted = () => {
    setShowRegisterForm(true);
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon">
              <span className="logo-text">Yo</span>
            </div>
            <span className="logo-name">YoChat</span>
          </div>
          <Link to="/login" className="nav-login-btn">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Connect, Chat, and Create
              <span className="highlight"> Amazing Conversations</span>
            </h1>
            <p className="hero-subtitle">
              Join thousands of users in YoChat - where you can create your own chat rooms, 
              join exciting conversations, and build meaningful connections with people worldwide.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon">🏠</div>
                <span>Create Custom Rooms</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <span>Real-time Messaging</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌐</div>
                <span>Global Community</span>
              </div>
            </div>
            <button 
              className="hero-cta-btn"
              onClick={handleGetStarted}
              disabled={loading}
            >
              Get Started Free
              <span className="btn-arrow">→</span>
            </button>
            <p className="hero-login-text">
              Already have an account? <Link to="/login" className="login-link">Sign in here</Link>
            </p>
          </div>
          <div className="hero-visual">
            <div className="chat-mockup">
              <div className="chat-header">
                <div className="chat-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="chat-title">General Room</span>
              </div>
              <div className="chat-messages">
                <div className="message left">
                  <div className="message-avatar">A</div>
                  <div className="message-content">Hey everyone! 👋</div>
                </div>
                <div className="message right">
                  <div className="message-content">Welcome to YoChat!</div>
                  <div className="message-avatar">B</div>
                </div>
                <div className="message left">
                  <div className="message-avatar">C</div>
                  <div className="message-content">This is amazing! 🚀</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Form Dropdown */}
      <div className={`register-dropdown ${showRegisterForm ? 'active' : ''}`}>
        <div className="register-card">
          <div className="register-header">
            <h2 className="register-title">Create Your Account</h2>
            <p className="register-subtitle">Join the YoChat community today</p>
            <button 
              className="close-btn"
              onClick={() => setShowRegisterForm(false)}
              disabled={loading}
            >
              ×
            </button>
          </div>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username</label>
              <input
                id="username"
                className="input-field"
                type="text"
                name="username"
                placeholder="Choose a unique username (3-20 chars)"
                value={formData.username}
                onChange={handleChange}
                required
                minLength="3"
                maxLength="20"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                id="email"
                className="input-field"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                className="input-field"
                type="password"
                name="password"
                placeholder="Create a secure password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                <div className="error-title">Registration Error</div>
                <div className="error-details">
                  {error.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                {error.includes('Network error') && (
                  <div className="error-tip">
                    <small>Try these troubleshooting steps:</small>
                    <ol>
                      <li>Ensure backend server is running (check terminal)</li>
                      <li>Verify the backend URL is correct</li>
                      <li>Check browser's Network tab for details</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className={`register-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
          </div>
        </div>
      </div>

      {/* Background Overlay */}
      {showRegisterForm && (
        <div 
          className="overlay"
          onClick={() => !loading && setShowRegisterForm(false)}
        ></div>
      )}
    </div>
  );
};

export default Register;