import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Categories.module.css';

const categoriesList = [
  {
    name: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c',
    desc: 'Fresh and healthy vegetables directly from farms to your home.'
  },
  {
    name: 'Fruits',
    image: 'https://media.istockphoto.com/id/995518546/photo/assortment-of-colorful-ripe-tropical-fruits-top-view.jpg?s=612x612&w=0&k=20&c=bz2zksjSPikOYm9I-mG-f8SAQWVpFsR4M_u4K9soLQ0=',
    desc: 'Buy fresh seasonal fruits with natural taste and nutrition.'
  },
  {
    name: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    desc: 'Fresh milk, butter, cheese and other dairy products available daily.'
  },
  {
    name: 'Snacks',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707',
    desc: 'Tasty snacks and ready-to-eat items for every occasion.'
  },
  {
    name: 'Beverages',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/029/283/229/small/a-front-view-fresh-fruit-cocktails-with-fresh-fruit-slices-ice-cooling-on-blue-drink-juice-co-free-photo.jpg',
    desc: 'Refreshing juices and cool drinks for your daily energy.'
  },
  {
    name: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    desc: 'Fresh bread, cakes and bakery products baked every day.'
  },
  {
    name: 'Meat',
    image: 'https://media.istockphoto.com/id/1443190699/photo/different-types-of-raw-meat.jpg?s=612x612&w=0&k=20&c=bCxqsBiCno4-6WUYKnm08iW_wOqupbQjGEz5An_FIGg=',
    desc: 'Fresh meat and poultry products for your daily meals.'
  },
  {
    name: 'Sea Food',
    image: 'https://media.istockphoto.com/id/1263355363/photo/top-view-of-variety-of-fresh-fish-and-seafood-on-ice.jpg?s=612x612&w=0&k=20&c=6FcACxQ4Ysixz02J8rixvRthM0b9FXd6Mm5Ysb6ZEKM=',
    desc: 'Fresh fish, shrimp, and other sea food products for your meals.'
  },
  {
    name: 'General Products',
    image: 'https://munnastor.com/wp-content/uploads/2025/12/Our-products-1.webp',
    desc: 'All your daily essentials and general grocery items in one place.'
  }
];

export default function Categories() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCategoryClick = (categoryName) => {
    // Route to Products list page with preselected category query param
    navigate(`/products?category=${categoryName}`);
  };

  return (
    <div className={styles.categoriesWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <h2>Shop By Categories</h2>
        </section>

        <section className={styles.categories}>
          <h2>Popular Categories</h2>
          <div className={styles.categoryContainer}>
            {categoriesList.map((category, index) => (
              <div key={index} className={styles.categoryCard}>
                <img src={category.image} alt={category.name} />
                <div className={styles.categoryContent}>
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.desc}</p>
                  </div>
                  <button
                    className={styles.shopBtn}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
