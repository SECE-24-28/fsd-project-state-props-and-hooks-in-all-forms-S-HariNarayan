import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Cart.module.css';
import { API_BASE_URL } from '../../config';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Check login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadCart = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    };

    loadCart();
  }, [navigate]);

  const updateQuantity = (index, val) => {
    const newItems = [...cartItems];
    const newQty = newItems[index].quantity + val;
    if (newQty >= 1) {
      newItems[index].quantity = newQty;
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0 || subtotal >= 500) return 0;
    return 50;
  };

  const getGrandTotal = () => {
    return getSubtotal() + getDeliveryCharge();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className={styles.cartWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty. Fill it with fresh products!</p>
            <Link to="/products" className={styles.shopNowBtn}>Shop Now</Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            {/* Items Section */}
            <div className={styles.cartItemsSection}>
              {cartItems.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    <p className={styles.itemPrice}>₹{item.price}</p>
                  </div>

                  <div className={styles.qtyControls}>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(index, -1)}>-</button>
                    <span className={styles.qtyVal}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(index, 1)}>+</button>
                  </div>

                  <div>
                    <p className={styles.itemPrice} style={{ minWidth: '80px', textAlign: 'right' }}>
                      ₹{item.price * item.quantity}
                    </p>
                  </div>

                  <div>
                    <button className={styles.removeBtn} onClick={() => removeItem(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className={styles.summarySection}>
              <h3>Order Summary</h3>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{getSubtotal()}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Delivery Charge</span>
                <span>{getDeliveryCharge() === 0 ? 'FREE' : `₹${getDeliveryCharge()}`}</span>
              </div>

              <div className={styles.summaryRow} style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', marginTop: '-5px' }}>
                *Free delivery on orders of ₹500 and above
              </div>

              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span>₹{getGrandTotal()}</span>
              </div>

              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
