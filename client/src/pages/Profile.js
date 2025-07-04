import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import './Profile.css';

const profileSchema = yup.object({
  firstName: yup.string().max(50, 'First name must be less than 50 characters'),
  lastName: yup.string().max(50, 'Last name must be less than 50 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm new password is required'),
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const response = await userService.updateProfile(data);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsChangingPassword(true);
    try {
      const { currentPassword, newPassword } = data;
      await userService.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and security settings.</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-card">
            <h3>Profile Information</h3>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    {...registerProfile('firstName')}
                    className={profileErrors.firstName ? 'error' : ''}
                    placeholder="Enter your first name"
                  />
                  {profileErrors.firstName && (
                    <span className="error-message">{profileErrors.firstName.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    {...registerProfile('lastName')}
                    className={profileErrors.lastName ? 'error' : ''}
                    placeholder="Enter your last name"
                  />
                  {profileErrors.lastName && (
                    <span className="error-message">{profileErrors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  {...registerProfile('email')}
                  className={profileErrors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {profileErrors.email && (
                  <span className="error-message">{profileErrors.email.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>Username</label>
                <input type="text" value={user?.username || ''} disabled className="disabled" />
                <small className="form-text">Username cannot be changed</small>
              </div>

              <button type="submit" className="submit-button" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="profile-card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  {...registerPassword('currentPassword')}
                  className={passwordErrors.currentPassword ? 'error' : ''}
                  placeholder="Enter your current password"
                />
                {passwordErrors.currentPassword && (
                  <span className="error-message">{passwordErrors.currentPassword.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  {...registerPassword('newPassword')}
                  className={passwordErrors.newPassword ? 'error' : ''}
                  placeholder="Enter your new password"
                />
                {passwordErrors.newPassword && (
                  <span className="error-message">{passwordErrors.newPassword.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  {...registerPassword('confirmNewPassword')}
                  className={passwordErrors.confirmNewPassword ? 'error' : ''}
                  placeholder="Confirm your new password"
                />
                {passwordErrors.confirmNewPassword && (
                  <span className="error-message">{passwordErrors.confirmNewPassword.message}</span>
                )}
              </div>

              <button type="submit" className="submit-button" disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
