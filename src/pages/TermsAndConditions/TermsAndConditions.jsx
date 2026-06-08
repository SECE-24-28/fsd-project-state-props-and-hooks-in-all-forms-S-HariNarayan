import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './TermsAndConditions.module.css';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className={styles.termsWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.subtitle}>Last updated: June 8, 2026</p>

        <div className={styles.card}>
          <div className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Epic Grocery. By using our website and services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our platform.
            </p>
          </div>

          <div className={styles.section}>
            <h2>2. User Accounts & Registration</h2>
            <p>
              To browse products, manage shopping carts, and place orders, you must create a registered account. You are responsible for keeping your login credentials confidential and agree to notify us immediately of any unauthorized account activity.
            </p>
          </div>

          <div className={styles.section}>
            <h2>3. Product Orders & Pricing</h2>
            <p>
              All orders are subject to product availability and confirmation of order prices. While we try to ensure all details and descriptions on our platform are accurate, errors may occur. We reserve the right to correct any errors and cancel orders if necessary.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Delivery & Payment Terms</h2>
            <p>
              Delivery times may vary depending on availability and location. We aim to complete deliveries as quickly as possible. Payments must be processed securely at checkout, and order values must be finalized before dispatch.
            </p>
          </div>

          <div className={styles.section}>
            <h2>5. Limitation of Liability</h2>
            <p>
              Epic Grocery will not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, our platform or purchased grocery products.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
