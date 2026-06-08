import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SignUp.module.css';

import { API_BASE_URL } from '../../config';

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
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

  const handleRegister = async (e) => {
    e.preventDefault();

    // Field Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fullName === '' || email === '' || mobile === '' || password === '' || confirmPassword === '' || address === '') {
      alert('Please fill all fields');
      return;
    }

    if (!email.match(emailPattern)) {
      alert('Enter valid email address');
      return;
    }

    if (mobile.length < 10) {
      alert('Enter a valid mobile number');
      return;
    }

    if (password.length < 6) {
      alert('Password must contain minimum 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        fullName,
        email,
        mobile,
        password,
        address
      });

      // Save token and user details to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert('Registration Successful');
      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.message === 'Network Error' || !err.response) {
        alert('Cannot connect to the server. Please check if your backend server is running on port 5000.');
      } else {
        alert(err.response?.data?.message || 'Error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupWrapper}>
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

      <div className={styles.signupContainer}>
        <img
          src="/images/Screenshot 2026-05-25 213956.png"
          alt="Grocery Logo"
          className={styles.logo}
        />
        <h1>Create Account</h1>
        <p>Register for Epic Grocery</p>

        <form onSubmit={handleRegister}>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <textarea
              placeholder="Enter Delivery Address (Default)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows="3"
            />
          </div>

          <button type="submit" className={styles.signupBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.extraLinks}>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
