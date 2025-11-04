// src/Register.js - Updated with useEffect to add body class for scrolling override
import React, { useState, useEffect } from "react";
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

  // Add class to body for scrolling override
  useEffect(() => {
    document.body.classList.add('register-page');
    return () => {
      document.body.classList.remove('register-page');
    };
  }, []);

  // Prevent scrolling when register form is shown
  useEffect(() => {
    if (showRegisterForm) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [showRegisterForm]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
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
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
     
      console.log("Registration response:", res.data);
     
      if (res.data.token && res.data.user) {
        setError('Account created! Redirecting to login...');
        setTimeout(() => {
          navigate("/login", {
            state: {
              registrationSuccess: true,
              message: "Registration successful! Please log in.",
              email: formData.email
            }
          });
        }, 1500);
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
          <div className="logo" aria-label="YoChat Logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="white" opacity="0.9"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            </div>
            <span className="logo-name " style={{ color: 'white' }}>YoChat</span>
          </div>
          <Link to="/login" className="nav-login-btn" style={{ color: 'white' }}>Login</Link>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge" role="img" aria-label="Beta Badge" style={{ color: 'white' }}>✨ Now in Beta</div>
            <h1 className="hero-title" style={{ color: 'white' }}>
              Where conversations
              <span className="gradient-text"> come alive</span>
            </h1>
            <p className="hero-subtitle" style={{ color: 'white' }}>
              Join the next generation of chat. 🚀
            </p>
           
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number" style={{ color: 'white' }}>10K+</div>
                <div className="stat-label" style={{ color: 'white' }}>Active Users</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number" style={{ color: 'white' }}>500+</div>
                <div className="stat-label" style={{ color: 'white' }}>Live Rooms</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number" style={{ color: 'white' }}>24/7</div>
                <div className="stat-label" style={{ color: 'white' }}>Community</div>
              </div>
            </div>
            <button
              className="hero-cta-btn"
              onClick={handleGetStarted}
              disabled={loading}
              aria-label="Get Started with YoChat"
            >
              <span style={{ color: 'white' }}>Get Started</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
           
            <p className="hero-footer-text" style={{ color: 'white' }}>
              Already have an account? <Link to="/login" className="text-link" style={{ color: 'white' }}>Sign in</Link>
            </p>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">💬</div>
              <div className="card-text">
                <div className="card-title" style={{ color: 'white' }}>Real-time Chat</div>
                <div className="card-desc" style={{ color: 'white' }}>Instant messaging</div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🎮</div>
              <div className="card-text">
                <div className="card-title" style={{ color: 'white' }}>Custom Rooms</div>
                <div className="card-desc" style={{ color: 'white' }}>Your space, your rules</div>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🌍</div>
              <div className="card-text">
                <div className="card-title" style={{ color: 'white' }}>Global Community</div>
                <div className="card-desc" style={{ color: 'white' }}>Connect worldwide</div>
              </div>
            </div>
            <div className="center-glow"></div>
          </div>
        </div>
       
      </section>
     
      {/* Register Modal */}
      {showRegisterForm && (
        <>
          <div className="modal-overlay" onClick={() => !loading && setShowRegisterForm(false)}></div>
          <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button
              className="modal-close"
              onClick={() => setShowRegisterForm(false)}
              disabled={loading}
              aria-label="Close modal"
              style={{ color: 'white' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="modal-header">
              <h2 id="modal-title" style={{ color: 'white' }}>Create Account</h2>
              <p style={{ color: 'white' }}>Join thousands of users on YoChat</p>
            </div>
            <form className="register-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="username" style={{ color: 'white' }}>Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="cooluser123"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                  maxLength="20"
                  disabled={loading}
                  autoComplete="username"
                  aria-describedby="username-hint"
                  style={{ color: 'white' }}
                />
                <span id="username-hint" className="input-hint" style={{ color: 'white' }}>3-20 characters, letters, numbers, underscores</span>
              </div>
              <div className="form-group">
                <label htmlFor="email" style={{ color: 'white' }}>Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="email"
                  style={{ color: 'white' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" style={{ color: 'white' }}>Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  disabled={loading}
                  autoComplete="new-password"
                  style={{ color: 'white' }}
                />
                <span className="input-hint" style={{ color: 'white' }}>Minimum 6 characters</span>
              </div>
              {error && (
                <div className="error-alert" role="alert" aria-live="assertive" style={{ color: 'white' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                aria-label={loading ? "Creating account" : "Continue to register"}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span style={{ color: 'white' }}>Creating account...</span>
                  </>
                ) : (
                  <span style={{ color: 'white' }}>Continue</span>
                )}
              </button>
            </form>
            <div className="modal-footer">
              <Link to="/login" className="footer-link" onClick={() => setShowRegisterForm(false)} style={{ color: 'white' }}>Already have an account? Sign in</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;