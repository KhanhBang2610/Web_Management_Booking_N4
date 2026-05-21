import React from 'react';
import './DatePicker.css';

const DatePicker = ({ label, value, onChange }) => {
  return (
    <div className="date-picker">
      <label className="search-label">{label}</label>
      <input
        className="date-picker-input"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DatePicker;
