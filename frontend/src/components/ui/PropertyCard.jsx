import React from 'react';
import './PropertyCard.css';

const PropertyCard = ({ property, onPropertyClick }) => {
  return (
    <div className="property-card" onClick={onPropertyClick}>
      <div className="property-card-image-wrapper">
        <img
          className="property-card-image"
          src={property.image || property.coverPhoto || 'https://via.placeholder.com/400x260?text=Property'}
          alt={property.name}
        />
      </div>
      <div className="property-card-content">
        <div>
          <h3 className="property-card-title">{property.name}</h3>
          <p className="property-card-location">{property.address || property.location || 'Địa điểm chưa xác định'}</p>
          <p className="property-card-description">{property.description?.slice(0, 120) || 'Không có mô tả'}...</p>
        </div>
        <div className="property-card-footer">
          <span className="property-card-price">{(property.basePrice || property.price || 0).toLocaleString()} VNĐ</span>
          <span className="property-card-rating">{'⭐'.repeat(Math.round(property.rating || 4))} {property.rating?.toFixed(1) || '4.0'}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
