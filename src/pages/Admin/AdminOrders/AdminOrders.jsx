import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../../components/AdminSidebar/AdminSidebar';
import styles from './AdminOrders.module.css';
import { API_BASE_URL } from '../../../config';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/orders`, config);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus }, config);
      alert(`Order ${orderId} updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  const getSelectClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return styles.statusSelect_processing;
      case 'shipped':
        return styles.statusSelect_shipped;
      case 'delivered':
        return styles.statusSelect_delivered;
      default:
        return styles.statusSelect_pending;
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />

      <main className={styles.mainPanel}>
        <div className={styles.header}>
          <h1>Customer Orders</h1>
        </div>

        <div className={styles.ordersSection}>
          {loading ? (
            <div>Loading customer purchases...</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Mobile</th>
                    <th>Shipping Address</th>
                    <th>Items Purchased</th>
                    <th>Total Price</th>
                    <th>Tracking Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className={styles.orderId}>{order._id}</td>
                      <td style={{ fontWeight: 'bold' }}>
                        {order.user?.fullName || 'Guest Customer'}
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 'normal' }}>
                          {order.user?.email || ''}
                        </div>
                        {order.review && order.review.rating && (
                          <div className={styles.reviewBadge}>
                            <div className={styles.reviewStars}>
                              {'★'.repeat(order.review.rating)}{'☆'.repeat(5 - order.review.rating)}
                            </div>
                            {order.review.comment && (
                              <div className={styles.reviewComment}>
                                "{order.review.comment}"
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td>{order.mobile}</td>
                      <td>{order.shippingAddress}</td>
                      <td className={styles.itemsList}>
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            • {item.name} x{item.quantity} (₹{item.price})
                          </div>
                        ))}
                      </td>
                      <td style={{ fontWeight: 'bold', color: '#2e7d32' }}>₹{order.total}</td>
                      <td>
                        <select
                          value={order.status}
                          className={`${styles.statusSelect} ${getSelectClass(order.status)}`}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>No customer purchases have been recorded.</td>
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
