import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './OrderSuccess.module.css';
import { API_BASE_URL } from '../../config';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (orderId) {
      axios.get(`${API_BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setOrder(response.data);
          setLoadingOrder(false);
        })
        .catch(err => {
          console.error('Error fetching order details:', err);
          setLoadingOrder(false);
        });
    } else {
      setLoadingOrder(false);
    }
  }, [navigate, orderId]);

  return (
    <div className={styles.successWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.card}>
          <div className={styles.successHeadingBlock}>
            <span className={styles.icon}>✓</span>
            <h1>Thank You!</h1>
            <p>
              Your order has been placed successfully. We are preparing your fresh groceries for delivery.
              An agent will reach out shortly.
            </p>
          </div>

          {loadingOrder ? (
            <div className={styles.loadingText}>Generating your receipt...</div>
          ) : order ? (
            <div className={styles.receiptContainer} id="printable-receipt">
              <div className={styles.receiptHeader}>
                <div className={styles.receiptLogoContainer}>
                  <img src="/images/Screenshot 2026-05-25 213956.png" alt="Epic Grocery Logo" className={styles.receiptLogoImg} />
                  <div className={styles.receiptLogoText}>Epic Grocery</div>
                </div>
                <div className={styles.receiptWebsite}>www.epicgrocery.com</div>
                <div className={styles.receiptContact}>support@epicgrocery.com | +91 7010678030</div>
              </div>

              <div className={styles.receiptDivider}></div>

              <div className={styles.receiptDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Order ID:</span>
                  <span className={styles.detailValue}>{order._id}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Order Date:</span>
                  <span className={styles.detailValue}>
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Delivery Date:</span>
                  <span className={styles.detailValue}>
                    {new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Delivery Time:</span>
                  <span className={styles.detailValue}>10:00 AM - 01:00 PM (Standard Slot)</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Customer Name:</span>
                  <span className={styles.detailValue}>{order.user?.fullName || 'Valued Customer'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Mobile:</span>
                  <span className={styles.detailValue}>{order.mobile}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Shipping Address:</span>
                  <span className={styles.detailValueAddress}>{order.shippingAddress}</span>
                </div>
              </div>

              <div className={styles.receiptDivider}></div>

              <table className={styles.receiptTable}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>₹{item.price}</td>
                      <td style={{ textAlign: 'right' }}>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.receiptDivider}></div>

              <div className={styles.receiptSummary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery Charges</span>
                  <span>
                    {order.total - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) === 0
                      ? 'FREE'
                      : `₹${order.total - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}`}
                  </span>
                </div>
                <div className={`${styles.summaryRow} ${styles.grandTotalRow}`}>
                  <span>Grand Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>

              <div className={styles.receiptDivider}></div>

              <div className={styles.receiptFooter}>
                <p>Thank you for shopping with Epic Grocery!</p>
                <p className={styles.disclaimer}>This is an electronically generated order invoice receipt.</p>
              </div>

              <div className={styles.printActionBox}>
                <button onClick={() => window.print()} className={styles.printBtn}>
                  Print Receipt (PDF)
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.errorText}>Could not load order details for receipt.</div>
          )}

          <div className={styles.btnGroup}>
            <Link to="/home" className={styles.primaryBtn}>
              Back to Home
            </Link>
            <Link to="/profile" className={styles.secondaryBtn}>
              View Your Orders
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
