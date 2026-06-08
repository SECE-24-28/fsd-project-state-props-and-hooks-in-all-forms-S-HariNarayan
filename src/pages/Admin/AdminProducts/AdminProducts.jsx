import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../../components/AdminSidebar/AdminSidebar';
import styles from './AdminProducts.module.css';
import { API_BASE_URL } from '../../../config';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('20');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user.isAdmin) {
      alert('Access Denied');
      navigate('/home');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setShowForm(true);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Vegetables');
    setImage('');
    setStock('20');
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image);
    setStock(product.stock.toString());
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !image || !stock) {
      alert('Please fill out all fields');
      return;
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const payload = {
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      stock: parseInt(stock)
    };

    try {
      setFormLoading(true);

      if (isEditing) {
        // Edit product
        await axios.put(`${API_BASE_URL}/products/${editId}`, payload, config);
        alert('Product updated successfully!');
      } else {
        // Add product
        await axios.post(`${API_BASE_URL}/products`, payload, config);
        alert('Product created successfully!');
      }

      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, config);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />

      <main className={styles.mainPanel}>
        <div className={styles.header}>
          <h1>Inventory Manager</h1>
          {!showForm && (
            <button className={styles.addBtn} onClick={handleAddClick}>
              + Add Product
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form className={styles.formSection} onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Edit Product Details' : 'Add New Product'}</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fresh Mangoes"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
              </div>

              <div className={styles.inputGroup}>
                <label>Price (INR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 150"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Stock Level</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="e.g. 25"
                  required
                />
              </div>

              <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                <label>Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                <label>Product Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of the product..."
                  rows="3"
                  required
                />
              </div>
            </div>

            <div className={styles.btnRow}>
              <button type="submit" className={styles.saveBtn} disabled={formLoading}>
                {formLoading ? 'Saving...' : 'Save Product'}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Products Table List */}
        <div className={styles.productsSection}>
          {loading ? (
            <div>Loading catalog items...</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img src={product.image} alt={product.name} className={styles.thumbImg} />
                      </td>
                      <td style={{ fontWeight: 'bold', color: '#333' }}>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td style={{ color: product.stock <= 5 ? '#d32f2f' : '#2e7d32', fontWeight: 'bold' }}>
                        {product.stock} {product.stock <= 5 && '(Low Stock)'}
                      </td>
                      <td>
                        <button className={styles.editBtn} onClick={() => handleEditClick(product)}>
                          Edit
                        </button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(product._id, product.name)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>No products listed. Add one!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
