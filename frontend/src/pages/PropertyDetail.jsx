// Trang chi tiết 1 khách sạn (Thư viện ảnh, mô tả, chọn phòng).

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './PropertyDetail.css'; // Thêm file CSS để style
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';

const PropertyDetail = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy thông tin tìm kiếm từ location state
    const searchState = location.state || {};
    const [checkIn, setCheckIn] = useState(searchState.checkIn || '');
    const [checkOut, setCheckOut] = useState(searchState.checkOut || '');
    const [guests, setGuests] = useState(searchState.guests || 1);

    // State cho property details
    const [property, setProperty] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho UI
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showReviews, setShowReviews] = useState(false);

    // Lấy chi tiết property từ API
    useEffect(() => {
        const fetchPropertyDetail = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/properties/${propertyId}`);
                setProperty(response.data.data);
                setError(null);
            } catch (err) {
                console.error('Lỗi khi tải chi tiết property:', err);
                setError('Không thể tải chi tiết khách sạn. Vui lòng thử lại!');
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) {
            fetchPropertyDetail();
        }
    }, [propertyId]);

    // Lấy danh sách phòng của property
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get(`/rooms/property/${propertyId}`);
                setRooms(response.data.data || []);
            } catch (err) {
                console.error('Lỗi khi tải danh sách phòng:', err);
            }
        };

        if (propertyId) {
            fetchRooms();
        }
    }, [propertyId]);

    // Tính toán số ngày
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights();

    // Lấy phòng được chọn
    const selectedRoom = rooms.find(r => r.roomType === selectedRoomType);

    // Tính tổng giá
    const calculateTotalPrice = () => {
        if (!selectedRoom || !nights) return 0;
        return selectedRoom.basePrice * nights * quantity;
    };

    const totalPrice = calculateTotalPrice();

    // Xử lý chuyển ảnh
    const handlePreviousImage = () => {
        if (property?.images && property.images.length > 0) {
            setActiveImageIndex((prev) => 
                prev === 0 ? property.images.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (property?.images && property.images.length > 0) {
            setActiveImageIndex((prev) => 
                prev === property.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    // Xử lý đặt phòng
    const handleBooking = () => {
        if (!selectedRoom || !checkIn || !checkOut) {
            alert('Vui lòng chọn loại phòng và nhập ngày check-in/out!');
            return;
        }

        // Chuyển đến trang Checkout với thông tin booking
        navigate('/checkout', {
            state: {
                propertyId: propertyId,
                propertyName: property?.name,
                roomType: selectedRoomType,
                roomPrice: selectedRoom.basePrice,
                checkIn: checkIn,
                checkOut: checkOut,
                nights: nights,
                quantity: quantity,
                totalPrice: totalPrice,
                guests: guests
            }
        });
    };

    // Xử lý thay đổi ngày
    const handleDateChange = (type, value) => {
        if (type === 'checkIn') {
            setCheckIn(value);
        } else {
            setCheckOut(value);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <>
                <Navbar />
                <div className="error-page">
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="btn-back">
                        Quay lại trang chủ
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    if (!property) {
        return (
            <>
                <Navbar />
                <div className="error-page">
                    <p>Không tìm thấy khách sạn này.</p>
                    <button onClick={() => navigate('/')} className="btn-back">
                        Quay lại trang chủ
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    const images = property.images && property.images.length > 0 
        ? property.images 
        : ['https://via.placeholder.com/800x400?text=No+Image'];

    return (
        <>
            <Navbar />
            <div className="property-detail-container">
                {/* THƯ VIỆN ẢNH */}
                <div className="image-gallery">
                    <div className="main-image-wrapper">
                        <img 
                            src={images[activeImageIndex]} 
                            alt={`${property.name} ${activeImageIndex + 1}`}
                            className="main-image"
                        />
                        <button className="nav-button prev" onClick={handlePreviousImage}>
                            &#10094;
                        </button>
                        <button className="nav-button next" onClick={handleNextImage}>
                            &#10095;
                        </button>
                        <div className="image-counter">
                            {activeImageIndex + 1} / {images.length}
                        </div>
                    </div>

                    {/* Thumbnail gallery */}
                    <div className="thumbnail-gallery">
                        {images.map((img, idx) => (
                            <img 
                                key={idx}
                                src={img} 
                                alt={`Thumbnail ${idx + 1}`}
                                className={`thumbnail ${idx === activeImageIndex ? 'active' : ''}`}
                                onClick={() => setActiveImageIndex(idx)}
                            />
                        ))}
                    </div>
                </div>

                {/* THÔNG TIN CHI TIẾT */}
                <div className="property-content">
                    {/* Sidebar trái: Thông tin property */}
                    <aside className="property-info-sidebar">
                        <h1 className="property-name">{property.name}</h1>
                        
                        <div className="property-meta">
                            <span className="rating">
                                {'⭐'.repeat(Math.floor(property.rating || 0))}
                                <strong>{property.rating || 0}/5</strong>
                            </span>
                            <span className="location">
                                📍 {property.address || 'Không có thông tin địa chỉ'}
                            </span>
                        </div>

                        <div className="description-section">
                            <h3>Mô tả</h3>
                            <p className="description">
                                {property.description || 'Không có mô tả chi tiết.'}
                            </p>
                        </div>

                        {/* Tiện ích */}
                        <div className="amenities-section">
                            <h3>Tiện ích</h3>
                            <div className="amenities-list">
                                {property.amenities && property.amenities.length > 0 ? (
                                    property.amenities.map((amenity, idx) => (
                                        <span key={idx} className="amenity-badge">
                                            ✓ {amenity}
                                        </span>
                                    ))
                                ) : (
                                    <p>Không có thông tin tiện ích</p>
                                )}
                            </div>
                        </div>

                        {/* Đánh giá */}
                        <div className="reviews-section">
                            <button 
                                className="btn-show-reviews"
                                onClick={() => setShowReviews(!showReviews)}
                            >
                                {showReviews ? 'Ẩn đánh giá' : 'Xem đánh giá'} ({property.reviewCount || 0})
                            </button>
                            
                            {showReviews && property.reviews && (
                                <div className="reviews-list">
                                    {property.reviews.map((review, idx) => (
                                        <div key={idx} className="review-item">
                                            <div className="review-header">
                                                <strong>{review.userName}</strong>
                                                <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                                            </div>
                                            <p className="review-text">{review.comment}</p>
                                            <small className="review-date">
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Sidebar phải: Form đặt phòng */}
                    <aside className="booking-sidebar">
                        <div className="booking-card">
                            <h2>Chọn phòng & Đặt ngay</h2>

                            {/* Chọn ngày */}
                            <div className="date-selection">
                                <label>
                                    Nhận phòng:
                                    <input 
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => handleDateChange('checkIn', e.target.value)}
                                    />
                                </label>
                                <label>
                                    Trả phòng:
                                    <input 
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => handleDateChange('checkOut', e.target.value)}
                                    />
                                </label>
                            </div>

                            {nights > 0 && (
                                <div className="night-info">
                                    <strong>Số đêm: {nights}</strong>
                                </div>
                            )}

                            {/* Chọn loại phòng */}
                            <div className="room-selection">
                                <h3>Chọn loại phòng</h3>
                                {rooms.length > 0 ? (
                                    <div className="room-options">
                                        {rooms.map(room => (
                                            <div 
                                                key={room.id}
                                                className={`room-option ${selectedRoomType === room.roomType ? 'selected' : ''}`}
                                                onClick={() => setSelectedRoomType(room.roomType)}
                                            >
                                                <div className="room-header">
                                                    <h4>{room.roomType}</h4>
                                                    <span className="room-price">
                                                        {room.basePrice.toLocaleString()} VNĐ/đêm
                                                    </span>
                                                </div>
                                                <p className="room-capacity">
                                                    Sức chứa: {room.capacity} người
                                                </p>
                                                <p className="room-available">
                                                    Còn trống: {room.available || 0} phòng
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Không có phòng khả dụng</p>
                                )}
                            </div>

                            {/* Chọn số lượng phòng */}
                            {selectedRoom && (
                                <div className="quantity-selection">
                                    <label>
                                        Số lượng phòng:
                                        <div className="quantity-control">
                                            <button 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="qty-btn"
                                            >
                                                -
                                            </button>
                                            <input 
                                                type="number" 
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="qty-input"
                                            />
                                            <button 
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="qty-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </label>
                                </div>
                            )}

                            {/* Tính giá */}
                            {selectedRoom && nights > 0 && (
                                <div className="price-summary">
                                    <div className="price-row">
                                        <span>Giá/đêm:</span>
                                        <strong>{selectedRoom.basePrice.toLocaleString()} VNĐ</strong>
                                    </div>
                                    <div className="price-row">
                                        <span>Số đêm:</span>
                                        <strong>{nights}</strong>
                                    </div>
                                    <div className="price-row">
                                        <span>Số phòng:</span>
                                        <strong>{quantity}</strong>
                                    </div>
                                    <div className="price-row total">
                                        <span>Tổng cộng:</span>
                                        <strong className="total-price">
                                            {totalPrice.toLocaleString()} VNĐ
                                        </strong>
                                    </div>
                                </div>
                            )}

                            {/* Nút đặt phòng */}
                            <button 
                                className="btn-book"
                                onClick={handleBooking}
                                disabled={!selectedRoom || !checkIn || !checkOut}
                            >
                                Tiếp tục thanh toán
                            </button>

                            {!checkIn || !checkOut ? (
                                <p className="warning-text">⚠️ Vui lòng chọn ngày check-in và check-out</p>
                            ) : null}
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PropertyDetail;