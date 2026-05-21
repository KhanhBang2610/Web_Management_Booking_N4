import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirmation.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const bookingInfo = state?.bookingData ?? {};
  const orderSummary = state?.orderSummary ?? {};

  if (!state || !state.bookingId) {
    return (
      <div className="booking-confirmation-empty">
        <p>Không có thông tin đơn đặt phòng.</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="booking-confirmation-page">
        <div className="booking-confirmation-card">
          <div className="booking-confirmation-header">
            <h1>Cảm ơn bạn đã đặt phòng!</h1>
            <p>Mã đơn đặt phòng của bạn là <strong>#{state.bookingId}</strong></p>
          </div>

          <div className="booking-confirmation-section">
            <h2>Chi tiết đơn</h2>
            <div className="confirmation-row">
              <span>Khách sạn</span>
              <strong>{bookingInfo.propertyName}</strong>
            </div>
            <div className="confirmation-row">
              <span>Loại phòng</span>
              <strong>{bookingInfo.roomType}</strong>
            </div>
            <div className="confirmation-row">
              <span>Ngày nhận phòng</span>
              <strong>{bookingInfo.checkIn}</strong>
            </div>
            <div className="confirmation-row">
              <span>Ngày trả phòng</span>
              <strong>{bookingInfo.checkOut}</strong>
            </div>
            <div className="confirmation-row">
              <span>Số đêm</span>
              <strong>{bookingInfo.nights}</strong>
            </div>
            <div className="confirmation-row">
              <span>Tổng thanh toán</span>
              <strong>{orderSummary.total?.toLocaleString()} VNĐ</strong>
            </div>
          </div>

          <div className="booking-confirmation-actions">
            <button onClick={() => navigate('/')} className="btn-home">
              Trở về trang chủ
            </button>
            <button onClick={() => navigate('/host-dashboard')} className="btn-secondary">
              Xem dashboard
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingConfirmation;
