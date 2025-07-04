import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to your Dashboard</h1>
        <p>Hello, {user?.firstName || user?.username}! Here's your account overview.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Username:</label>
              <span>{user?.username}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>First Name:</label>
              <span>{user?.firstName || 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>Last Name:</label>
              <span>{user?.lastName || 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>Account Created:</label>
              <span>{formatDate(user?.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>Last Login:</label>
              <span>{formatDate(user?.lastLogin)}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <a href="/profile" className="action-button">
              <div className="action-icon">👤</div>
              <div className="action-text">
                <h4>Edit Profile</h4>
                <p>Update your personal information</p>
              </div>
            </a>
            <a href="/profile" className="action-button">
              <div className="action-icon">🔒</div>
              <div className="action-text">
                <h4>Change Password</h4>
                <p>Update your account security</p>
              </div>
            </a>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Application Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1</div>
              <div className="stat-label">Active Sessions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{user?.isActive ? 'Active' : 'Inactive'}</div>
              <div className="stat-label">Account Status</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🔐</div>
              <div className="activity-content">
                <p>Logged in successfully</p>
                <span className="activity-time">Just now</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <p>Account created</p>
                <span className="activity-time">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
