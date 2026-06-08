import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className={styles.privacyWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Last updated: June 6, 2026</p>

        <div className={styles.card}>
          <div className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. The types of personal information we collect include:
            </p>
            <ul>
              <li><strong>Account Details:</strong> Your name, email address, password, mobile number, and delivery address.</li>
              <li><strong>Transactional Data:</strong> Details of the grocery items you purchase, billing totals, and order histories.</li>
              <li><strong>Usage Details:</strong> Information about how you interact with our catalog, search queries, and session timestamps.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>To process, fulfill, ship, and track your grocery orders.</li>
              <li>To allow account registration, profile updates, and secure login credential verification.</li>
              <li>To display metrics, trends, and catalog listings on our administrator panels.</li>
              <li>To communicate order status updates or response messages to your requests.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. Information Sharing & Security</h2>
            <p>
              We do not sell, rent, or trade your personal information with third parties. All personal details, registration profiles, and order data are securely stored in our cloud MongoDB database.
            </p>
            <p>
              We use industry-standard encryption practices (such as bcrypt for hashing passwords and JSON Web Tokens for authorization routing) to protect your records from unauthorized access, alteration, or deletion.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Cookies & Trackers</h2>
            <p>
              We use local storage cookies to keep you securely logged into your session. These storage variables help us remember your cart items, profile settings, and login authorization states. You can clear these logs by clicking the "Logout" button at any time.
            </p>
          </div>

          <div className={styles.section}>
            <h2>5. Contact Us</h2>
            <p>
              If you have any questions, concerns, or feedback regarding our privacy policies or data security practices, please feel free to reach out to the Epic Grocery project development team.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
