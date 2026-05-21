// Trang danh sách khách sạn (kết hợp bộ lọc bên trái).

import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchResult.css'; // Thêm file CSS để style
import PropertyCard from '../components/ui/PropertyCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useFetch from '../hooks/useFetch';
import SearchContext from '../store/SearchContext';
import api from '../services/api';

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { searchData } = useContext(SearchContext);

    // Lấy tham số tìm kiếm từ URL hoặc Context
    const location = searchParams.get('location') || searchData?.location || '';
    const checkIn = searchParams.get('checkIn') || searchData?.checkIn || '';
    const checkOut = searchParams.get('checkOut') || searchData?.checkOut || '';
    const guests = searchParams.get('guests') || searchData?.guests || 1;

    // State cho bộ lọc
    const [filters, setFilters] = useState({
        priceMin: 0,
        priceMax: 10000000,
        rating: 0,
        amenities: [],
        roomType: 'all',
        sortBy: 'price_asc'
    });

    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy danh sách properties từ API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                // Gọi API với tham số tìm kiếm
                const response = await api.get('/properties/search', {
                    params: {
                        location: location,
                        checkIn: checkIn,
                        checkOut: checkOut,
                        guests: guests
                    }
                });
                setProperties(response.data.data || []);
                setError(null);
            } catch (err) {
                console.error('Lỗi khi tìm kiếm properties:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại!');
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        if (location) {
            fetchProperties();
        }
    }, [location, checkIn, checkOut, guests]);

    // Áp dụng bộ lọc và sắp xếp
    useEffect(() => {
        let result = [...properties];

        // Lọc theo giá
        result = result.filter(
            prop => prop.basePrice >= filters.priceMin && prop.basePrice <= filters.priceMax
        );

        // Lọc theo rating
        if (filters.rating > 0) {
            result = result.filter(prop => prop.rating >= filters.rating);
        }

        // Lọc theo loại phòng
        if (filters.roomType !== 'all') {
            result = result.filter(prop => prop.roomType === filters.roomType);
        }

        // Lọc theo tiện ích
        if (filters.amenities.length > 0) {
            result = result.filter(prop => {
                const propAmenities = prop.amenities || [];
                return filters.amenities.every(amenity => propAmenities.includes(amenity));
            });
        }

        // Sắp xếp
        switch (filters.sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.basePrice - b.basePrice);
                break;
            case 'price_desc':
                result.sort((a, b) => b.basePrice - a.basePrice);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        setFilteredProperties(result);
    }, [properties, filters]);

    // Xử lý thay đổi filter
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Xử lý thay đổi amenities (checkbox)
    const handleAmenityChange = (amenity) => {
        setFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    // Xử lý click vào property card
    const handlePropertyClick = (propertyId) => {
        navigate(`/property/${propertyId}`, {
            state: { checkIn, checkOut, guests }
        });
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilters({
            priceMin: 0,
            priceMax: 10000000,
            rating: 0,
            amenities: [],
            roomType: 'all',
            sortBy: 'price_asc'
        });
    };

    return (
        <>
            <Navbar />
            <div className="search-result-container">
                {/* Header kết quả tìm kiếm */}
                <div className="search-header">
                    <h1>Kết quả tìm kiếm cho <span className="location-highlight">{location}</span></h1>
                    <p className="search-info">
                        Nhận phòng: <strong>{checkIn}</strong> | Trả phòng: <strong>{checkOut}</strong> | 
                        Số khách: <strong>{guests}</strong>
                    </p>
                    <p className="results-count">
                        {filteredProperties.length} kết quả tìm được
                    </p>
                </div>

                <div className="search-result-content">
                    {/* BỘ LỌC BÊN TRÁI */}
                    <aside className="filters-sidebar">
                        <div className="filter-section">
                            <h3 className="filter-title">Bộ lọc</h3>
                            <button className="btn-reset-filters" onClick={handleResetFilters}>
                                Đặt lại
                            </button>
                        </div>

                        {/* Lọc theo giá */}
                        <div className="filter-section">
                            <h4>Giá tiền</h4>
                            <div className="price-filter">
                                <label>
                                    Tối thiểu:
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={filters.priceMin}
                                        onChange={(e) => handleFilterChange('priceMin', parseInt(e.target.value))}
                                    />
                                </label>
                                <label>
                                    Tối đa:
                                    <input 
                                        type="number" 
                                        max="10000000"
                                        value={filters.priceMax}
                                        onChange={(e) => handleFilterChange('priceMax', parseInt(e.target.value))}
                                    />
                                </label>
                            </div>
                            <div className="price-range-display">
                                {filters.priceMin.toLocaleString()} - {filters.priceMax.toLocaleString()} VNĐ
                            </div>
                        </div>

                        {/* Lọc theo rating */}
                        <div className="filter-section">
                            <h4>Đánh giá</h4>
                            {[5, 4, 3, 2, 1].map(star => (
                                <label key={star} className="radio-label">
                                    <input 
                                        type="radio" 
                                        name="rating"
                                        value={star}
                                        checked={filters.rating === star}
                                        onChange={() => handleFilterChange('rating', star)}
                                    />
                                    <span>{'⭐'.repeat(star)} {star} sao trở lên</span>
                                </label>
                            ))}
                            <label className="radio-label">
                                <input 
                                    type="radio" 
                                    name="rating"
                                    value="0"
                                    checked={filters.rating === 0}
                                    onChange={() => handleFilterChange('rating', 0)}
                                />
                                <span>Tất cả</span>
                            </label>
                        </div>

                        {/* Lọc theo loại phòng */}
                        <div className="filter-section">
                            <h4>Loại phòng</h4>
                            <select 
                                value={filters.roomType}
                                onChange={(e) => handleFilterChange('roomType', e.target.value)}
                                className="select-filter"
                            >
                                <option value="all">Tất cả loại phòng</option>
                                <option value="Standard">Phòng Standard</option>
                                <option value="Deluxe">Phòng Deluxe</option>
                                <option value="Suite">Phòng Suite</option>
                                <option value="Penthouse">Phòng Penthouse</option>
                            </select>
                        </div>

                        {/* Lọc theo tiện ích */}
                        <div className="filter-section">
                            <h4>Tiện ích</h4>
                            {['WiFi', 'Hồ bơi', 'Gym', 'Nhà hàng', 'Spa', 'Điều hòa'].map(amenity => (
                                <label key={amenity} className="checkbox-label">
                                    <input 
                                        type="checkbox"
                                        checked={filters.amenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                    />
                                    <span>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </aside>

                    {/* KẾT QUẢ TÌM KIẾM BÊN PHẢI */}
                    <main className="results-main">
                        {/* Tùy chọn sắp xếp */}
                        <div className="sort-options">
                            <label htmlFor="sortBy">Sắp xếp theo:</label>
                            <select 
                                id="sortBy"
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="select-sort"
                            >
                                <option value="price_asc">Giá: Thấp đến Cao</option>
                                <option value="price_desc">Giá: Cao đến Thấp</option>
                                <option value="rating">Đánh giá cao nhất</option>
                                <option value="newest">Mới nhất</option>
                            </select>
                        </div>

                        {/* Hiển thị danh sách kết quả */}
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <div className="error-message">
                                <p>{error}</p>
                                <button onClick={() => navigate('/')} className="btn-back">
                                    Quay lại trang chủ
                                </button>
                            </div>
                        ) : filteredProperties.length === 0 ? (
                            <div className="no-results">
                                <p>Không tìm thấy kết quả phù hợp với tiêu chí lọc của bạn.</p>
                                <button onClick={handleResetFilters} className="btn-reset">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className="properties-grid">
                                {filteredProperties.map(property => (
                                    <PropertyCard 
                                        key={property.id}
                                        property={property}
                                        onPropertyClick={() => handlePropertyClick(property.id)}
                                        checkIn={checkIn}
                                        checkOut={checkOut}
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SearchResult;