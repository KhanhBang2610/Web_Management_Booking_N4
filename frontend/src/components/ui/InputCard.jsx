import React from 'react';
import './InputCard.css';

const InputCard = ({ title, description, children, active = false, className = '' }) => {
  return (
    <div className={`input-card ${active ? 'active' : ''} ${className}`}>
      {(title || description) && (
        <div className="input-card-header">
          {title && <h3 className="input-card-title">{title}</h3>}
          {description && <p className="input-card-description">{description}</p>}
        </div>
      )}
      <div className="input-card-body">{children}</div>
    </div>
  );
};

export default InputCard;
