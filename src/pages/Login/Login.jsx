import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

import { API_BASE_URL } from '../../config';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' || password === '') {
      alert('Please fill all fields');
      return;
    }

    if (!email.match(emailPattern)) {
      alert('Enter valid email address');
      return;
    }

    if (password.length < 6) {
      alert('Password must contain minimum 6 characters');
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      // Save token and user details to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert('Login Successful');
      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.message === 'Network Error' || !err.response) {
        alert('Cannot connect to the server. Please check if your backend server is running on port 5000.');
      } else {
        alert(err.response?.data?.message || 'Invalid Email or Password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
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

      <div className={styles.loginContainer}>
        <img
          src="/images/Screenshot 2026-05-25 213956.png"
          alt="Grocery Logo"
          className={styles.logo}
        />
        <h1>Epic Grocery</h1>
        <p>Login to continue shopping</p>

        <form onSubmit={handleLogin}>
          <div className={styles.inputBox}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.extraLinks}>
          <p>
            <Link to="/forget-password">Forgot Password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
