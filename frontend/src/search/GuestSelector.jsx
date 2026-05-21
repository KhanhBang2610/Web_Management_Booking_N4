import React, { useState } from 'react';
import './GuestSelector.css';

const GuestSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = (type, adjustment) => {
    const nextValue = { ...value };
    nextValue[type] = Math.max(1, nextValue[type] + adjustment);
    onChange(nextValue);
  };

  return (
    <div className="guest-selector">
      <button
        type="button"
        className="guest-selector-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{`${value.adults || 1} Người lớn, ${value.children || 0} Trẻ em`}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      <div className={`guest-selector-dropdown ${isOpen ? 'active' : ''}`}>
        <div className="guest-group">
          <div className="guest-group-title">Người lớn</div>
          <div className="guest-item">
            <div className="guest-info">
              <span className="guest-label">Người lớn</span>
              <span className="guest-subtext">Từ 18 tuổi trở lên</span>
            </div>
            <div className="guest-counter">
              <button type="button" className="counter-button" onClick={() => handleSelection('adults', -1)}>-</button>
              <span className="counter-value">{value.adults || 1}</span>
              <button type="button" className="counter-button" onClick={() => handleSelection('adults', 1)}>+</button>
            </div>
          </div>
        </div>
        <div className="guest-group">
          <div className="guest-group-title">Trẻ em</div>
          <div className="guest-item">
            <div className="guest-info">
              <span className="guest-label">Trẻ em</span>
              <span className="guest-subtext">Dưới 18 tuổi</span>
            </div>
            <div className="guest-counter">
              <button type="button" className="counter-button" onClick={() => handleSelection('children', -1)}>-</button>
              <span className="counter-value">{value.children || 0}</span>
              <button type="button" className="counter-button" onClick={() => handleSelection('children', 1)}>+</button>
            </div>
          </div>
        </div>
        <div className="guest-selector-footer">
          <button type="button" className="btn-secondary" onClick={() => setIsOpen(false)}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestSelector;
