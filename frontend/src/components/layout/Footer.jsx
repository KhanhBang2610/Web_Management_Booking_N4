import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Angolala</h3>
            <p>Đặt phòng khách sạn và căn hộ trực tuyến dễ dàng, nhanh chóng và an toàn.</p>
          </div>

          <div className="footer-section">
            <h3>Liên kết</h3>
            <ul>
              <li><a href="#">Trang chủ</a></li>
              <li><a href="#">Khám phá</a></li>
              <li><a href="#">Host</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hỗ trợ</h3>
            <ul>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Chính sách</a></li>
              <li><a href="#">Điều khoản</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Kết nối</h3>
            <div className="footer-social">
              <a className="social-link" href="#">F</a>
              <a className="social-link" href="#">T</a>
              <a className="social-link" href="#">I</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 Angolala. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Bảo mật</a>
            <a href="#">Điều khoản</a>
            <a href="#">Chính sách cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
