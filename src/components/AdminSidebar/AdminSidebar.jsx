import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <NavLink to="/home" className={styles.logoArea}>
        <img src="/images/Screenshot 2026-05-25 213956.png" alt="Epic Grocery Logo" />
        <h2>Epic Admin</h2>
      </NavLink>

      <ul className={styles.navLinks}>
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            📊 Dashboard Overview
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            🍎 Inventory Manager
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            📦 Customer Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            👥 User Directory
          </NavLink>
        </li>
        <li style={{ marginTop: '20px', borderTop: '1px solid #2e7d32', paddingTop: '20px' }}>
          <NavLink to="/home">
            🏠 Exit to Customer View
          </NavLink>
        </li>
      </ul>

      <div className={styles.footer}>
        <p>© 2026 Epic Grocery</p>
      </div>
    </aside>
  );
}
