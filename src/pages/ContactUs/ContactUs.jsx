import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './ContactUs.module.css';
import { API_BASE_URL } from '../../config';

export default function ContactUs() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Prefill name & email if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          name: user.fullName || '',
          email: user.email || ''
        }));
      } catch (err) {
        console.error('Error parsing stored user details:', err);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters long.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/contact`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: ''
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.contactHeader}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>Have a question, feedback, or need help with an order? Reach out to us, and we'll get back to you shortly.</p>
        </div>

        <div className={styles.gridContainer}>
          {/* Info Side */}
          <div className={styles.infoColumn}>
            <h2>Get in Touch</h2>
            <p className={styles.infoDesc}>
              Our customer service team is here to assist you. Choose your preferred way of communication or drop us a message through the form.
            </p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <span className={styles.cardIcon}>📍</span>
                <div className={styles.cardText}>
                  <h3>Main Office</h3>
                  <p>123 Fresh Street, Veggie City, IN</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardIcon}>📞</span>
                <div className={styles.cardText}>
                  <h3>Phone Number</h3>
                  <p>+91 (555) 987-6543</p>
                  <p>Mon - Sat, 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardIcon}>✉️</span>
                <div className={styles.cardText}>
                  <h3>Email Support</h3>
                  <p>support@epicgrocery.com</p>
                  <p>Average response time: 2 hours</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardIcon}>🕒</span>
                <div className={styles.cardText}>
                  <h3>Delivery Hours</h3>
                  <p>Daily: 6:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className={styles.formColumn}>
            <div className={styles.formCard}>
              <h2>Send us a Message</h2>
              
              {success && (
                <div className={styles.successBanner}>
                  <span className={styles.bannerIcon}>✓</span>
                  <div className={styles.bannerText}>
                    <h4>Message Sent!</h4>
                    <p>Thank you for contacting us. We've received your query and will reply soon.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className={styles.errorBanner}>
                  <span className={styles.bannerIcon}>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="E.g., Order issue, Delivery question"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Describe your request in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
