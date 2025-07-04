import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>React App</h1>
        </Link>

        <nav className="nav">
          {isAuthenticated ? (
            <div className="nav-authenticated">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <div className="user-menu">
                <span className="user-greeting">
                  Hello, {user?.firstName || user?.username}!
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-guest">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link nav-link-primary">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
