import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './FAQ.module.css';

const FAQ_DATA = [
  {
    id: 1,
    category: 'general',
    question: 'What is Epic Grocery?',
    answer: 'Epic Grocery is an online grocery platform delivering fresh vegetables, fruits, dairy products, pantry essentials, and household items directly to your doorstep. We guarantee freshness and quality.'
  },
  {
    id: 2,
    category: 'ordering',
    question: 'How do I place an order on Epic Grocery?',
    answer: 'Placing an order is simple! Browse products by categories or search for specific items, add them to your cart, click the Cart icon to review items, and click Checkout to enter your delivery address and pay.'
  },
  {
    id: 3,
    category: 'delivery',
    question: 'What are the delivery times and charges?',
    answer: 'We deliver between 6:00 AM and 9:00 PM daily. Standard delivery takes 2-4 hours, or you can choose slots. Delivery is FREE for orders above ₹500; otherwise, a flat fee of ₹40 applies.'
  },
  {
    id: 4,
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We support multiple payment methods including Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD).'
  },
  {
    id: 5,
    category: 'returns',
    question: 'What is your return and refund policy?',
    answer: 'We offer a "no questions asked" return policy. If you receive damaged or unsatisfactory items, contact us within 24 hours of delivery. Refunds are processed back to your original payment method or wallet.'
  },
  {
    id: 6,
    category: 'ordering',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'Yes, you can modify or cancel your order up to 30 minutes after placing it, or before it has been marked as "Dispatched". Simply visit your Profile page, go to Order History, and select Cancel Order.'
  },
  {
    id: 7,
    category: 'general',
    question: 'Are the fruits and vegetables fresh?',
    answer: 'Absolutely. We source our fresh produce daily directly from local farms. Our quality assurance team inspects every single item before packaging to ensure you only get the freshest groceries.'
  },
  {
    id: 8,
    category: 'account',
    question: 'How do I reset my password if I forget it?',
    answer: 'Go to the Login page and click on "Forgot Password?". Enter your registered email address, and follow the link to securely reset your password.'
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  // Filter and search logic
  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.faqWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.faqHeader}>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>Find answers to commonly asked questions about ordering, delivery, and services.</p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className={styles.categoryFilters}>
          {['all', 'general', 'ordering', 'delivery', 'payment', 'returns', 'account'].map((category) => (
            <button
              key={category}
              className={`${styles.filterBtn} ${selectedCategory === category ? styles.activeFilter : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setOpenId(null);
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className={styles.faqList}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`${styles.faqCard} ${isOpen ? styles.cardOpen : ''}`}
                >
                  <button
                    className={styles.questionHeader}
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.questionText}>{faq.question}</span>
                    <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>▼</span>
                  </button>
                  <div
                    className={`${styles.answerWrapper} ${isOpen ? styles.wrapperOpen : ''}`}
                  >
                    <div className={styles.answerContent}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>💡</span>
              <p>No FAQs match your search or filter criteria. Try different keywords.</p>
            </div>
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className={styles.ctaCard}>
          <h3>Still have questions?</h3>
          <p>We are here to help. Reach out to our customer support team directly.</p>
          <button className={styles.ctaBtn} onClick={() => navigate('/contact')}>
            Contact Us
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
