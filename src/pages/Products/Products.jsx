import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Products.module.css';
import { API_BASE_URL } from '../../config';

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read search & filters from URL params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE_URL}/products?category=${categoryParam}&search=${searchParam}&sort=${sortParam}`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam, sortParam, navigate]);

  const handleSearchChange = (e) => {
    setSearchParams({
      category: categoryParam,
      search: e.target.value,
      sort: sortParam
    });
  };

  const handleCategoryChange = (e) => {
    setSearchParams({
      category: e.target.value,
      search: searchParam,
      sort: sortParam
    });
  };

  const handleSortChange = (e) => {
    setSearchParams({
      category: categoryParam,
      search: searchParam,
      sort: e.target.value
    });
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault(); // prevent navigation since card links to details
    e.stopPropagation();

    let cart = [];
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }

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
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className={styles.productsWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Explore Groceries</h1>

        {/* Filter Controls */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchParam}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.filters}>
            <select value={categoryParam} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
              <option value="Bakery">Bakery</option>
              <option value="Meat">Meat</option>
              <option value="Sea Food">Sea Food</option>
              <option value="General Products">General Products</option>
            </select>

            <select value={sortParam} onChange={handleSortChange}>
              <option value="">Sort By: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={styles.noProducts}>Loading items...</div>
        ) : products.length === 0 ? (
          <div className={styles.noProducts}>No products found matching your criteria.</div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id} className={styles.card}>
                <img src={product.image} alt={product.name} />
                <div className={styles.details}>
                  <div>
                    <span className={styles.categoryTag}>{product.category}</span>
                    <h3>{product.name}</h3>
                  </div>
                  <div>
                    <p className={styles.price}>₹{product.price}</p>
                    <button
                      className={styles.cartBtn}
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : 'Add To Cart'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
