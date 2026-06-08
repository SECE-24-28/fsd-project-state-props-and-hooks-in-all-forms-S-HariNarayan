import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import Categories from './pages/Categories/Categories';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers/AdminUsers';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import FAQ from './pages/FAQ/FAQ';
import ContactUs from './pages/ContactUs/ContactUs';

// Simple Route Protection Middleware for Customers
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

// Simple Route Protection Middleware for Admines
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(storedUser);
  return user.isAdmin ? children : <Navigate to="/home" />;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') || 'original';
    const activeTheme = savedTheme === 'dark-neon' ? 'dark-neon' : 'original';
    document.body.setAttribute('data-theme', activeTheme);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* Private Customer Routes */}
        <Route path="/about" element={<PrivateRoute><AboutUs /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/products/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/order-success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/privacy-policy" element={<PrivateRoute><PrivacyPolicy /></PrivateRoute>} />
        <Route path="/terms-and-conditions" element={<PrivateRoute><TermsAndConditions /></PrivateRoute>} />
        <Route path="/faq" element={<PrivateRoute><FAQ /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><ContactUs /></PrivateRoute>} />

        {/* Private Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
