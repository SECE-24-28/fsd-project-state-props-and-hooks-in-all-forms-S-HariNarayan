import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ForgetPassword.module.css';
import { API_BASE_URL } from '../../config';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme') || 'original';
    return saved === 'dark-neon' ? 'dark-neon' : 'original';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark-neon' ? 'original' : 'dark-neon';
    setTheme(nextTheme);
    localStorage.setItem('appTheme', nextTheme);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (email === '' || newPassword === '' || confirmPassword === '') {
      alert('Please fill all fields');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must contain minimum 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email,
        password: newPassword
      });

      alert('Password Updated Successfully');
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (err.message === 'Network Error' || !err.response) {
        alert('Cannot connect to the server. Please check if your backend server is running on port 5000.');
      } else {
        alert(err.response?.data?.message || 'Error updating password. Please ensure email is correct.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetWrapper}>
      <div className={styles.themeToggleContainer}>
        <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Toggle theme">
          {theme === 'dark-neon' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className={styles.resetContainer}>
        <img
          src="/images/Screenshot 2026-05-25 213956.png"
          alt="Grocery Logo"
          className={styles.logo}
        />
        <h1>Reset Password</h1>
        <p>Update your password securely</p>

        <form onSubmit={handleReset}>
          <div className={styles.inputBox}>
            <input
              type="email"
              placeholder="Enter Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.resetBtn} disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <div className={styles.extraLinks}>
          <p>
            Back to <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
