import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Node React MSSQL Boilerplate
          </h1>
          <p className="hero-subtitle">
            A secure, production-ready boilerplate application built with Node.js, React, and MSSQL
          </p>
          
          {isAuthenticated ? (
            <div className="hero-authenticated">
              <h2>Welcome back, {user?.firstName || user?.username}!</h2>
              <div className="hero-actions">
                <Link to="/dashboard" className="hero-button primary">
                  Go to Dashboard
                </Link>
                <Link to="/profile" className="hero-button secondary">
                  View Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/register" className="hero-button primary">
                Get Started
              </Link>
              <Link to="/login" className="hero-button secondary">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>JWT-based authentication with password hashing and token management</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏗️</div>
              <h3>MVC Architecture</h3>
              <p>Clean separation of concerns with Models, Views, and Controllers</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Security First</h3>
              <p>CORS protection, rate limiting, input validation, and secure headers</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Modern Stack</h3>
              <p>Built with the latest versions of Node.js, React, and MSSQL</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Mobile-first design that works on all devices and screen sizes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Production Ready</h3>
              <p>Environment variables, error handling, and deployment-ready configuration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tech-stack-section">
        <div className="container">
          <h2 className="section-title">Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js + Express</li>
                <li>MSSQL Database</li>
                <li>JWT Authentication</li>
                <li>bcrypt Password Hashing</li>
                <li>Express Validator</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React 18</li>
                <li>React Router</li>
                <li>React Hook Form</li>
                <li>Axios HTTP Client</li>
                <li>Context API</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>Security</h3>
              <ul>
                <li>Helmet.js</li>
                <li>CORS Protection</li>
                <li>Rate Limiting</li>
                <li>Input Sanitization</li>
                <li>Environment Variables</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
