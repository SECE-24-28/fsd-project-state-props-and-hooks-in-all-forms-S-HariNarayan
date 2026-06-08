import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './AboutUs.module.css';

export default function AboutUs() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className={styles.aboutWrapper}>
      <Header />

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.aboutHero}>
          <h2>About Epic Grocery</h2>
        </section>

        {/* About Content */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutText}>
            <h2>Who We Are</h2>
            <p>
              Epic Grocery is an online grocery ecommerce platform that delivers fresh vegetables, fruits, dairy
              products, snacks and household essentials directly to customers. Our website is designed to provide a
              simple and fast shopping experience for everyone.
            </p>
            <p>
              We focus on quality products, affordable prices, quick delivery and excellent customer service. Our
              goal is to make grocery shopping easier and more convenient for customers.
            </p>
          </div>

          <div className={styles.aboutImage}>
            <img
              src="/images/Screenshot 2026-05-25 212851.png"
              alt="About Grocery"
            />
          </div>
        </section>

        {/* Mission */}
        <section className={styles.mission}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide healthy, fresh and affordable grocery products to customers while saving their
            time through easy online shopping and fast home delivery. We aim to improve customer satisfaction with
            quality service and trusted products.
          </p>
        </section>

        {/* Team */}
        <section className={styles.team}>
          <h2>Our Team</h2>
          <div className={styles.teamContainer}>
            <div className={styles.teamCard}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                alt="Team Member"
              />
              <h3>Hari Narayan</h3>
              <p>Project Developer</p>
            </div>
            <div className={styles.teamCard}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140051.png"
                alt="Team Member"
              />
              <h3>Team Member</h3>
              <p>UI Designer</p>
            </div>
            <div className={styles.teamCard}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/4140/4140061.png"
                alt="Team Member"
              />
              <h3>Team Member</h3>
              <p>Backend Developer</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
