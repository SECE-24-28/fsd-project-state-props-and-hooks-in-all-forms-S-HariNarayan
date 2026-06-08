import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Checkout.module.css';
import { API_BASE_URL } from '../../config';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load Cart
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const items = JSON.parse(storedCart);
      setCartItems(items);
      if (items.length === 0) {
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }

    // Load User info for autofill
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFullName(user.fullName || '');
      setMobile(user.mobile || '');
      setShippingAddress(user.address || '');
    }
  }, [navigate]);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal();
    if (subtotal >= 500) return 0;
    return 50;
  };

  const getGrandTotal = () => {
    return getSubtotal() + getDeliveryCharge();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!fullName || !mobile || !shippingAddress) {
      alert('Please fill out all shipping details');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      // Map cartItems to backend schema
      const orderItems = cartItems.map(item => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await axios.post(`${API_BASE_URL}/orders`, {
        items: orderItems,
        total: getGrandTotal(),
        shippingAddress,
        mobile
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear Cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));

      alert('Order Placed Successfully!');
      navigate(`/order-success?orderId=${response.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred while placing the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Secure Checkout</h1>

        <div className={styles.layout}>
          {/* Shipping Form */}
          <form className={styles.formSection} onSubmit={handlePlaceOrder}>
            <h2>Shipping & Delivery Details</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Receiver's Full Name</label>
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
              <label htmlFor="address">Delivery Address</label>
              <textarea
                id="address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>

            <div className={styles.paymentGroup}>
              <p>Payment Method</p>
              
              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                Cash on Delivery (COD)
              </label>

              <label className={styles.paymentOption}>
                <input
                  type="radio"
                  name="payment"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                />
                Credit / Debit Card (Mock Pay)
              </label>
            </div>

            <button type="submit" className={styles.placeOrderBtn} disabled={loading}>
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>

          {/* Cart Summary */}
          <div className={styles.summarySection}>
            <h2>Items in Order</h2>
            
            {cartItems.map((item, index) => (
              <div key={index} className={styles.orderItem}>
                <div>
                  <span>{item.name}</span>
                  <span style={{ fontSize: '13px', color: '#888', marginLeft: '10px' }}>
                    x{item.quantity}
                  </span>
                </div>
                <span className={styles.itemTotal}>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className={styles.row}>
              <span>Subtotal</span>
              <span>₹{getSubtotal()}</span>
            </div>

            <div className={styles.row}>
              <span>Delivery Charges</span>
              <span>{getDeliveryCharge() === 0 ? 'FREE' : `₹${getDeliveryCharge()}`}</span>
            </div>

            <div className={styles.grandTotal}>
              <span>Grand Total</span>
              <span>₹{getGrandTotal()}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
