import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Profile.module.css';
import { API_BASE_URL } from '../../config';

export default function Profile() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // States for Order Reviews
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load initial info from localStorage profile details
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      setAddress(user.address || '');
    }

    // Fetch fresh user profile from backend
    axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setFullName(response.data.fullName || '');
        setEmail(response.data.email || '');
        setMobile(response.data.mobile || '');
        setAddress(response.data.address || '');
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
      });

    // Fetch user order history
    axios.get(`${API_BASE_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setOrders(response.data);
        setOrdersLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setOrdersLoading(false);
      });
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!fullName || !mobile) {
      alert('Full Name and Mobile cannot be empty');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      const body = {
        fullName,
        mobile,
        address
      };

      if (password) {
        if (password.length < 6) {
          alert('New Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        body.password = password;
      }

      const response = await axios.put(`${API_BASE_URL}/auth/profile`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update stored user details
      localStorage.setItem('user', JSON.stringify(response.data));
      alert('Profile Updated Successfully!');
      setPassword('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (orderId) => {
    if (!rating) {
      alert('Please select a star rating.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      setSubmittingReview(true);
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/review`, {
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update orders state
      setOrders(orders.map(o => o._id === orderId ? response.data : o));
      
      // Reset form states
      setReviewingOrderId(null);
      setRating(5);
      setComment('');
      alert('Thank you! Your review has been submitted successfully.');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Error occurred while submitting review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return styles.status_processing;
      case 'shipped':
        return styles.status_shipped;
      case 'delivered':
        return styles.status_delivered;
      default:
        return styles.status_pending;
    }
  };

  return (
    <div className={styles.profileWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.layout}>
          {/* Edit Profile Form */}
          <div className={styles.profileCard}>
            <h2>Manage Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className={styles.inputGroup}>
                <label>Email Address (Immutable)</label>
                <input type="email" value={email} disabled />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="address">Default Shipping Address</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your shipping address"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Change Password (Leave blank to keep old)</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* User Order History */}
          <div className={styles.ordersCard}>
            <h2>Your Order History</h2>

            {ordersLoading ? (
              <div className={styles.noOrders}>Loading your order logs...</div>
            ) : orders.length === 0 ? (
              <div className={styles.noOrders}>
                You haven't placed any orders yet. Start shopping to fill your history!
              </div>
            ) : (
              <div>
                {orders.map((order) => (
                  <div key={order._id} className={styles.orderItem}>
                    <div className={styles.orderHeader}>
                      <div>
                        Order ID: <span className={styles.orderId}>{order._id}</span>
                      </div>
                      <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className={styles.orderDetails}>
                      <div className={styles.orderProducts}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '5px' }}>
                            {item.name} <span style={{ color: '#888' }}>x{item.quantity}</span> (₹{item.price} each)
                          </div>
                        ))}
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                          Placed on: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className={styles.orderSummary}>
                        Total: ₹{order.total}
                      </div>
                    </div>

                    {/* Order Review Section */}
                    {true && (
                      <div className={styles.reviewSection}>
                        {order.review && order.review.rating ? (
                          <div className={styles.submittedReview}>
                            <div className={styles.reviewMeta}>
                              <span className={styles.reviewStars}>
                                {'★'.repeat(order.review.rating)}{'☆'.repeat(5 - order.review.rating)}
                              </span>
                              <span className={styles.reviewDate}>
                                Reviewed on: {new Date(order.review.reviewedAt).toLocaleDateString()}
                              </span>
                            </div>
                            {order.review.comment && (
                              <p className={styles.reviewComment}>"{order.review.comment}"</p>
                            )}
                          </div>
                        ) : reviewingOrderId === order._id ? (
                          <div className={styles.reviewForm}>
                            <h4>Share your feedback for Order #{order._id.substring(order._id.length - 6)}</h4>
                            
                            <div className={styles.starSelectGroup}>
                              <label>Rating: </label>
                              <div className={styles.starSelector}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={star <= rating ? styles.starFilled : styles.starEmpty}
                                    onClick={() => setRating(star)}
                                    title={`${star} Star${star > 1 ? 's' : ''}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className={styles.commentInputGroup}>
                              <label htmlFor={`comment-${order._id}`}>Comments: </label>
                              <textarea
                                id={`comment-${order._id}`}
                                rows="3"
                                placeholder="Tell us about the delivery service, product freshness, etc. (optional)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                            </div>

                            <div className={styles.reviewFormActions}>
                              <button
                                onClick={() => handleSubmitReview(order._id)}
                                className={styles.submitReviewBtn}
                                disabled={submittingReview}
                              >
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                              </button>
                              <button
                                onClick={() => {
                                  setReviewingOrderId(null);
                                  setRating(5);
                                  setComment('');
                                }}
                                className={styles.cancelReviewBtn}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReviewingOrderId(order._id);
                              setRating(5);
                              setComment('');
                            }}
                            className={styles.writeReviewBtn}
                          >
                            Write a Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
