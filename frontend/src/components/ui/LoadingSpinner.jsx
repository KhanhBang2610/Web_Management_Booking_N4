import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', text = 'Đang tải...' }) => {
  const className = `spinner spinner-${size}`;

  return (
    <div className="loading-container">
      <div className={className}>
        <div className="spinner-border" />
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
