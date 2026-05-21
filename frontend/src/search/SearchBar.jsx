import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const [location, setLocation] = useState(initialValues.location || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '');
  const [guests, setGuests] = useState(initialValues.guests || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ location, checkIn, checkOut, guests });
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar-form">
        <div className="search-field">
          <label className="search-label">Địa điểm</label>
          <input
            className="search-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Nhập điểm đến..."
          />
        </div>
        <div className="search-field">
          <label className="search-label">Nhận phòng</label>
          <input
            className="search-input"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="search-field">
          <label className="search-label">Trả phòng</label>
          <input
            className="search-input"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        <div className="search-field">
          <label className="search-label">Số người</label>
          <select
            className="search-input"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            <option value={1}>1 Người lớn</option>
            <option value={2}>2 Người lớn</option>
            <option value={3}>3 Người lớn</option>
            <option value={4}>4 Người lớn</option>
          </select>
        </div>
        <button type="submit" className="search-button">
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
