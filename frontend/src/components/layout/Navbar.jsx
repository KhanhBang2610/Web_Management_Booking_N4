import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a className="navbar-logo" href="/">Angolala</a>

        <ul className="navbar-menu">
          <li><a href="/">Trang chủ</a></li>
          <li><a href="/search">Khám phá</a></li>
          <li><a href="/host">Host</a></li>
          <li><a href="/about">Giới thiệu</a></li>
        </ul>

        <div className="navbar-actions">
          <button className="btn-outline">Đăng nhập</button>
          <button>Đăng ký</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
