import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './ProductDetail.module.css';
import { API_BASE_URL } from '../../config';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${API_BASE_URL}/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleQtyChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= (product?.stock || 1)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    let cart = [];
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }

    const existingIndex = cart.findIndex(item => item.product === product._id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${quantity} ${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className={styles.detailWrapper}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.loading}>Loading item details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.detailWrapper}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.loading}>Product not found. <Link to="/products">Back to products</Link></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.detailWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <Link to="/products" className={styles.backBtn}>← Back to Products</Link>

        <div className={styles.productDetailContainer}>
          <div className={styles.imageSection}>
            <img src={product.image} alt={product.name} />
          </div>

          <div className={styles.infoSection}>
            <div>
              <span className={styles.categoryTag}>{product.category}</span>
              <h2>{product.name}</h2>
              <p className={styles.price}>₹{product.price}</p>
              <p className={styles.description}>{product.description}</p>
            </div>

            <div>
              <p className={styles.stockStatus}>
                Availability:{' '}
                {product.stock > 0 ? (
                  <span className={styles.inStock}>In Stock ({product.stock} units left)</span>
                ) : (
                  <span className={styles.outOfStock}>Out of Stock</span>
                )}
              </p>

              {product.stock > 0 && (
                <>
                  <div className={styles.qtySelector}>
                    <span>Quantity:</span>
                    <button className={styles.qtyBtn} onClick={() => handleQtyChange(-1)} disabled={quantity <= 1}>-</button>
                    <span className={styles.qtyDisplay}>{quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => handleQtyChange(1)} disabled={quantity >= product.stock}>+</button>
                  </div>

                  <button className={styles.cartBtn} onClick={handleAddToCart}>
                    Add To Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className={styles.reviewsSection}>
          <h3>Customer Reviews</h3>
          <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewerName}>Aarav Mehta</span>
              <span className={styles.reviewRating}>★★★★★</span>
            </div>
            <p className={styles.reviewText}>
              Extremely fresh products! The delivery was quick, and the packaging was excellent. Will definitely order again.
            </p>
          </div>

          <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewerName}>Ananya Sharma</span>
              <span className={styles.reviewRating}>★★★★☆</span>
            </div>
            <p className={styles.reviewText}>
              Very good price compared to normal stores. Fast home delivery and items were carefully handpicked.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
