// Cấu hình Router (gắn các Pages vào các đường dẫn URL).

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context Providers
import { AuthProvider } from './store/AuthContext';
import { SearchProvider } from './store/SearchContext';

// Pages
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import PropertyDetail from './pages/PropertyDetail';
import Checkout from './pages/Checkout';
import HostDashboard from './pages/HostDashboard';

// Auth Pages (sẽ tạo sau)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Các component trang khác
// import BookingConfirmation from './pages/BookingConfirmation';
// import UserProfile from './pages/UserProfile';

/**
 * Protected Route Component
 * Kiểm tra xem user có quyền truy cập route không
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Kiểm tra quyền truy cập
        if (requiredRole && userData.role !== requiredRole) {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
          setUser(userData);
        }
      } catch (err) {
        console.error('Lỗi parse user data:', err);
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }

    setIsLoading(false);
  }, [requiredRole]);

  if (isLoading) {
    return <div className="loading-page">Đang tải...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Main App Component
 */
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <div className="app">
            <Routes>
              {/* PUBLIC ROUTES */}
              
              {/* Trang chủ */}
              <Route path="/" element={<Home />} />

              {/* Tìm kiếm & danh sách */}
              <Route path="/search" element={<SearchResult />} />

              {/* Chi tiết property */}
              <Route path="/property/:propertyId" element={<PropertyDetail />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* PROTECTED ROUTES */}

              {/* Checkout */}
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />

              {/* Host Dashboard (chỉ cho Host) */}
              <Route 
                path="/host-dashboard" 
                element={
                  <ProtectedRoute requiredRole="Host">
                    <HostDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* TODO: Tạo các page khác */}
              {/* 
              <Route 
                path="/booking-confirmation" 
                element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              */}

              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
};

/**
 * 404 Not Found Page
 */
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Trang không tìm thấy</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

// Fix: Import useNavigate
import { useNavigate } from 'react-router-dom';

export default App;