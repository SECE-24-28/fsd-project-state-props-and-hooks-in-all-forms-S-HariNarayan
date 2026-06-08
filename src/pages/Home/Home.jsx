import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Home.module.css';
import { API_BASE_URL } from '../../config';

export default function Home() {
  const navigate = useNavigate();
  const [popularProducts, setPopularProducts] = useState([]);
  const [email, setEmail] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    // Fetch popular products from backend (public API)
    axios.get(`${API_BASE_URL}/products`)
      .then(response => {
        // Just take the first 3 products for the popular section
        setPopularProducts(response.data.slice(0, 3));
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      });
  }, []);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      alert('Please login first to shop!');
      navigate('/login');
      return;
    }

    let cart = [];
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }

    // Check if product is already in cart
    const existingIndex = cart.findIndex(item => item.product === product._id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // Trigger header update
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} added to cart!`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing, ${email}!`);
      setEmail('');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <div className={styles.homeWrapper}>
      <Header />

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h2>Fresh & Healthy Grocery Delivered</h2>
            <p>
              Shop fresh vegetables, fruits, dairy products, juices and snacks directly from your home with fast
              delivery and affordable prices.
            </p>
            {isLoggedIn ? (
              <button className={styles.heroBtn} onClick={() => navigate('/products')}>
                Start Shopping
              </button>
            ) : (
              <div className={styles.heroButtons}>
                <button className={styles.heroBtn} onClick={() => navigate('/login')}>
                  Login to Shop
                </button>
                <button className={styles.registerBtn} onClick={() => navigate('/signup')}>
                  Register Account
                </button>
              </div>
            )}
          </div>
          <div className={styles.heroImage}>
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e"
              alt="Grocery"
            />
          </div>
        </section>

        {/* Services */}
        <section className={styles.services}>
          <h2>Why Choose Us</h2>
          <div className={styles.serviceContainer}>
            <div className={styles.serviceBox}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
                alt="Fresh"
              />
              <h3>Fresh Products</h3>
              <p>We provide farm fresh vegetables and fruits directly to your doorstep.</p>
            </div>
            <div className={styles.serviceBox}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
                alt="Delivery"
              />
              <h3>Fast Delivery</h3>
              <p>Quick and safe delivery service available for all your grocery needs.</p>
            </div>
            <div className={styles.serviceBox}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3523/3523887.png"
                alt="Price"
              />
              <h3>Affordable Prices</h3>
              <p>Best grocery products at budget friendly prices with exciting offers.</p>
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className={styles.productsSection}>
          <h2>Popular Products</h2>
          <div className={styles.productContainer}>
            {popularProducts.map((product) => (
              <div key={product._id} className={styles.productCard}>
                <Link to={`/products/${product._id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className={styles.productDetails}>
                  <h3>{product.name}</h3>
                  <p className={styles.price}>₹{product.price} {product.category === 'Fruits' || product.category === 'Vegetables' ? '/ Kg' : product.category === 'Dairy' && product.name.includes('Milk') ? '/ Litre' : ''}</p>
                  <button className={styles.cartBtn} onClick={() => handleAddToCart(product)}>
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className={styles.newsletter}>
          <h2>Subscribe Newsletter</h2>
          <p>Get updates about new products and exciting offers</p>
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.subscribeBtn}>
              Subscribe
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
