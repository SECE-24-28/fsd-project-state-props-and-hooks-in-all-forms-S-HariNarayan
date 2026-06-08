import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../../components/AdminSidebar/AdminSidebar';
import styles from './AdminUsers.module.css';
import { API_BASE_URL } from '../../../config';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setCurrentUser(parsedUser);

    if (!parsedUser.isAdmin) {
      alert('Access Denied');
      navigate('/home');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/auth/users`, config);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, userEmail, currentIsAdmin) => {
    if (currentUser?.id === userId) {
      alert('You cannot modify your own admin role!');
      return;
    }

    if (!window.confirm(`Are you sure you want to ${currentIsAdmin ? 'demote' : 'promote'} user: ${userEmail}?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      await axios.put(`${API_BASE_URL}/auth/users/${userId}/role`, {}, config);
      alert('User role updated successfully');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error toggling user role');
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />

      <main className={styles.mainPanel}>
        <div className={styles.header}>
          <h1>User Directory</h1>
        </div>

        <div className={styles.usersSection}>
          {loading ? (
            <div>Loading registered user directory...</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Mobile Number</th>
                    <th>Registration Date</th>
                    <th>Current Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td style={{ fontWeight: 'bold', color: '#333' }}>
                        {user.fullName} {currentUser?.id === user._id && ' (You)'}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`${styles.roleBadge} ${user.isAdmin ? styles.role_admin : styles.role_customer}`}>
                          {user.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td>
                        {currentUser?.id !== user._id ? (
                          <button
                            className={styles.toggleBtn}
                            onClick={() => handleToggleRole(user._id, user.email, user.isAdmin)}
                          >
                            Toggle Role
                          </button>
                        ) : (
                          <span style={{ fontStyle: 'italic', color: '#888' }}>No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>No users registered yet.</td>
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
