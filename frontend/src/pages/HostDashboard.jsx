// Dành cho chủ nhà quản lý phòng (đăng phòng, up ảnh).

import React, { useState, useEffect, useContext } from 'react';
import './HostDashboard.css'; // Thêm file CSS để style
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AuthContext from '../store/AuthContext';
import api from '../services/api';

const HostDashboard = () => {
    const { user } = useContext(AuthContext);

    // State cho dashboard
    const [activeTab, setActiveTab] = useState('overview');
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho form thêm/sửa property
    const [showPropertyForm, setShowPropertyForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [propertyForm, setPropertyForm] = useState({
        name: '',
        address: '',
        description: '',
        starRating: 5,
        locationId: 1,
        amenities: []
    });

    // State cho room management
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [roomForm, setRoomForm] = useState({
        roomType: '',
        basePrice: 0,
        capacity: 1,
        totalRooms: 1,
        description: ''
    });

    // State cho upload ảnh
    const [uploadedImages, setUploadedImages] = useState([]);

    // Tính toán thống kê
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        totalProperties: 0,
        pendingBookings: 0
    });

    // Lấy dữ liệu properties của host
    useEffect(() => {
        const fetchHostData = async () => {
            try {
                setLoading(true);
                
                // Lấy properties
                const propertiesRes = await api.get('/properties/host');
                setProperties(propertiesRes.data.data || []);

                // Lấy bookings
                const bookingsRes = await api.get('/bookings/host');
                setBookings(bookingsRes.data.data || []);

                // Tính stats
                const totalBookings = (bookingsRes.data.data || []).length;
                const pendingBookings = (bookingsRes.data.data || []).filter(b => b.status === 'Pending').length;
                const totalRevenue = (bookingsRes.data.data || []).reduce((sum, b) => sum + (b.totalPrice || 0), 0);

                setStats({
                    totalBookings,
                    totalRevenue,
                    totalProperties: (propertiesRes.data.data || []).length,
                    pendingBookings
                });

                setError(null);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại!');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHostData();
        }
    }, [user]);

    // Lấy danh sách phòng của property
    const handleSelectProperty = async (propertyId) => {
        try {
            setSelectedProperty(propertyId);
            const response = await api.get(`/rooms/property/${propertyId}`);
            setRooms(response.data.data || []);
        } catch (err) {
            console.error('Lỗi khi tải phòng:', err);
        }
    };

    // Xử lý form property
    const handlePropertyFormChange = (field, value) => {
        setPropertyForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddProperty = async () => {
        try {
            const payload = {
                ...propertyForm,
                ownerId: user.id,
                images: uploadedImages
            };

            if (editingProperty) {
                // Update property
                await api.put(`/properties/${editingProperty.id}`, payload);
            } else {
                // Create property
                await api.post('/properties', payload);
            }

            // Reload properties
            const response = await api.get('/properties/host');
            setProperties(response.data.data || []);

            setPropertyForm({
                name: '',
                address: '',
                description: '',
                starRating: 5,
                locationId: 1,
                amenities: []
            });
            setUploadedImages([]);
            setEditingProperty(null);
            setShowPropertyForm(false);
        } catch (err) {
            console.error('Lỗi khi lưu property:', err);
            alert('Lỗi khi lưu property. Vui lòng thử lại!');
        }
    };

    // Xử lý upload ảnh
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files) return;

        try {
            for (let file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const response = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setUploadedImages(prev => [...prev, response.data.imageUrl]);
            }
        } catch (err) {
            console.error('Lỗi upload ảnh:', err);
            alert('Lỗi upload ảnh. Vui lòng thử lại!');
        }
    };

    // Xử lý form room
    const handleRoomFormChange = (field, value) => {
        setRoomForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddRoom = async () => {
        if (!selectedProperty) {
            alert('Vui lòng chọn khách sạn trước!');
            return;
        }

        try {
            const payload = {
                ...roomForm,
                propertyId: selectedProperty
            };

            await api.post('/rooms', payload);

            // Reload rooms
            const response = await api.get(`/rooms/property/${selectedProperty}`);
            setRooms(response.data.data || []);

            setRoomForm({
                roomType: '',
                basePrice: 0,
                capacity: 1,
                totalRooms: 1,
                description: ''
            });
            setShowRoomForm(false);
        } catch (err) {
            console.error('Lỗi khi thêm phòng:', err);
            alert('Lỗi khi thêm phòng. Vui lòng thử lại!');
        }
    };

    // Xử lý xóa property
    const handleDeleteProperty = async (propertyId) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa khách sạn này?')) return;

        try {
            await api.delete(`/properties/${propertyId}`);
            setProperties(properties.filter(p => p.id !== propertyId));
        } catch (err) {
            console.error('Lỗi khi xóa property:', err);
            alert('Lỗi khi xóa property. Vui lòng thử lại!');
        }
    };

    // Xử lý xóa room
    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa phòng này?')) return;

        try {
            await api.delete(`/rooms/${roomId}`);
            if (selectedProperty) {
                const response = await api.get(`/rooms/property/${selectedProperty}`);
                setRooms(response.data.data || []);
            }
        } catch (err) {
            console.error('Lỗi khi xóa room:', err);
            alert('Lỗi khi xóa room. Vui lòng thử lại!');
        }
    };

    // Xử lý cập nhật trạng thái booking
    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            await api.put(`/bookings/${bookingId}`, { status: newStatus });
            const response = await api.get('/bookings/host');
            setBookings(response.data.data || []);
        } catch (err) {
            console.error('Lỗi khi cập nhật booking:', err);
            alert('Lỗi khi cập nhật booking. Vui lòng thử lại!');
        }
    };

    if (!user || user.role !== 'Host') {
        return (
            <>
                <Navbar />
                <div className="error-page">
                    <p>Bạn không có quyền truy cập trang này. Chỉ chủ nhà mới có thể truy cập.</p>
                </div>
                <Footer />
            </>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Navbar />
            <div className="host-dashboard-container">
                <h1>Bảng điều khiển chủ nhà</h1>
                <p className="welcome-text">Chào mừng, {user.fullName}! 👋</p>

                {/* DASHBOARD OVERVIEW */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Tổng đơn đặt</h3>
                        <p className="stat-value">{stats.totalBookings}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Đơn chờ xác nhận</h3>
                        <p className="stat-value" style={{ color: '#ff9800' }}>{stats.pendingBookings}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Khách sạn</h3>
                        <p className="stat-value">{stats.totalProperties}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Tổng doanh thu</h3>
                        <p className="stat-value">{stats.totalRevenue.toLocaleString()} VNĐ</p>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* TABS */}
                <div className="tabs-navigation">
                    <button 
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Tổng quan
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
                        onClick={() => setActiveTab('properties')}
                    >
                        🏨 Khách sạn
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rooms')}
                    >
                        🛏️ Phòng
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        📅 Đơn đặt
                    </button>
                </div>

                {/* TAB CONTENT */}
                <div className="tab-content">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="tab-pane">
                            <h2>Tổng quan hoạt động</h2>
                            <div className="overview-grid">
                                <div className="overview-card">
                                    <h3>📈 Tỷ lệ đặt phòng</h3>
                                    <p>{stats.totalBookings > 0 ? ((stats.totalBookings / (stats.totalProperties * 10)) * 100).toFixed(1) : 0}%</p>
                                </div>
                                <div className="overview-card">
                                    <h3>💰 Doanh thu trung bình</h3>
                                    <p>{stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings).toLocaleString() : 0} VNĐ/đơn</p>
                                </div>
                                <div className="overview-card">
                                    <h3>✅ Đơn hoàn tất</h3>
                                    <p>{bookings.filter(b => b.status === 'Completed').length}</p>
                                </div>
                                <div className="overview-card">
                                    <h3>⏳ Đơn đang chờ</h3>
                                    <p>{stats.pendingBookings}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROPERTIES TAB */}
                    {activeTab === 'properties' && (
                        <div className="tab-pane">
                            <div className="section-header">
                                <h2>Quản lý khách sạn</h2>
                                <button 
                                    className="btn-add"
                                    onClick={() => {
                                        setEditingProperty(null);
                                        setPropertyForm({
                                            name: '',
                                            address: '',
                                            description: '',
                                            starRating: 5,
                                            locationId: 1,
                                            amenities: []
                                        });
                                        setUploadedImages([]);
                                        setShowPropertyForm(true);
                                    }}
                                >
                                    + Thêm khách sạn
                                </button>
                            </div>

                            {showPropertyForm && (
                                <div className="form-modal">
                                    <div className="form-content">
                                        <h3>{editingProperty ? 'Sửa khách sạn' : 'Thêm khách sạn mới'}</h3>
                                        
                                        <div className="form-group">
                                            <label>Tên khách sạn</label>
                                            <input 
                                                type="text"
                                                value={propertyForm.name}
                                                onChange={(e) => handlePropertyFormChange('name', e.target.value)}
                                                placeholder="Nhập tên khách sạn"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Địa chỉ</label>
                                            <input 
                                                type="text"
                                                value={propertyForm.address}
                                                onChange={(e) => handlePropertyFormChange('address', e.target.value)}
                                                placeholder="Nhập địa chỉ"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Mô tả</label>
                                            <textarea 
                                                value={propertyForm.description}
                                                onChange={(e) => handlePropertyFormChange('description', e.target.value)}
                                                placeholder="Nhập mô tả khách sạn"
                                                rows="4"
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Sao đánh giá</label>
                                                <select 
                                                    value={propertyForm.starRating}
                                                    onChange={(e) => handlePropertyFormChange('starRating', e.target.value)}
                                                >
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <option key={star} value={star}>{star} sao</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Địa điểm</label>
                                                <select 
                                                    value={propertyForm.locationId}
                                                    onChange={(e) => handlePropertyFormChange('locationId', e.target.value)}
                                                >
                                                    <option value="1">Phú Quốc</option>
                                                    <option value="2">Nha Trang</option>
                                                    <option value="3">Đà Nẵng</option>
                                                    <option value="4">Hà Nội</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Upload ảnh khách sạn</label>
                                            <input 
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            <div className="uploaded-images">
                                                {uploadedImages.map((img, idx) => (
                                                    <div key={idx} className="image-preview">
                                                        <img src={img} alt={`Preview ${idx}`} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-buttons">
                                            <button className="btn-save" onClick={handleAddProperty}>
                                                Lưu
                                            </button>
                                            <button className="btn-cancel" onClick={() => setShowPropertyForm(false)}>
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="properties-list">
                                {properties.length === 0 ? (
                                    <p>Bạn chưa có khách sạn nào. Hãy thêm khách sạn đầu tiên!</p>
                                ) : (
                                    properties.map(property => (
                                        <div key={property.id} className="property-item">
                                            <div className="property-info">
                                                <h3>{property.name}</h3>
                                                <p>📍 {property.address}</p>
                                                <p>⭐ {property.starRating}/5</p>
                                                <p className="property-desc">{property.description}</p>
                                            </div>
                                            <div className="property-actions">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => {
                                                        setEditingProperty(property);
                                                        setPropertyForm({
                                                            name: property.name,
                                                            address: property.address,
                                                            description: property.description,
                                                            starRating: property.starRating,
                                                            locationId: property.locationId
                                                        });
                                                        setShowPropertyForm(true);
                                                    }}
                                                >
                                                    ✏️ Sửa
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteProperty(property.id)}
                                                >
                                                    🗑️ Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ROOMS TAB */}
                    {activeTab === 'rooms' && (
                        <div className="tab-pane">
                            <h2>Quản lý phòng</h2>
                            
                            <div className="section-header">
                                <select 
                                    value={selectedProperty || ''}
                                    onChange={(e) => handleSelectProperty(e.target.value)}
                                    className="property-selector"
                                >
                                    <option value="">-- Chọn khách sạn --</option>
                                    {properties.map(prop => (
                                        <option key={prop.id} value={prop.id}>
                                            {prop.name}
                                        </option>
                                    ))}
                                </select>

                                {selectedProperty && (
                                    <button 
                                        className="btn-add"
                                        onClick={() => {
                                            setShowRoomForm(true);
                                            setRoomForm({
                                                roomType: '',
                                                basePrice: 0,
                                                capacity: 1,
                                                totalRooms: 1,
                                                description: ''
                                            });
                                        }}
                                    >
                                        + Thêm phòng
                                    </button>
                                )}
                            </div>

                            {showRoomForm && selectedProperty && (
                                <div className="form-modal">
                                    <div className="form-content">
                                        <h3>Thêm phòng mới</h3>
                                        
                                        <div className="form-group">
                                            <label>Loại phòng</label>
                                            <input 
                                                type="text"
                                                value={roomForm.roomType}
                                                onChange={(e) => handleRoomFormChange('roomType', e.target.value)}
                                                placeholder="VD: Standard, Deluxe, Suite"
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Giá cơ bản (VNĐ/đêm)</label>
                                                <input 
                                                    type="number"
                                                    value={roomForm.basePrice}
                                                    onChange={(e) => handleRoomFormChange('basePrice', parseInt(e.target.value))}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Sức chứa (người)</label>
                                                <input 
                                                    type="number"
                                                    min="1"
                                                    value={roomForm.capacity}
                                                    onChange={(e) => handleRoomFormChange('capacity', parseInt(e.target.value))}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Số lượng phòng</label>
                                                <input 
                                                    type="number"
                                                    min="1"
                                                    value={roomForm.totalRooms}
                                                    onChange={(e) => handleRoomFormChange('totalRooms', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Mô tả phòng</label>
                                            <textarea 
                                                value={roomForm.description}
                                                onChange={(e) => handleRoomFormChange('description', e.target.value)}
                                                placeholder="Nhập mô tả phòng"
                                                rows="3"
                                            />
                                        </div>

                                        <div className="form-buttons">
                                            <button className="btn-save" onClick={handleAddRoom}>
                                                Lưu
                                            </button>
                                            <button className="btn-cancel" onClick={() => setShowRoomForm(false)}>
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedProperty ? (
                                <div className="rooms-list">
                                    {rooms.length === 0 ? (
                                        <p>Khách sạn này chưa có phòng nào</p>
                                    ) : (
                                        rooms.map(room => (
                                            <div key={room.id} className="room-item">
                                                <div className="room-info">
                                                    <h3>{room.roomType}</h3>
                                                    <p>💰 {room.basePrice.toLocaleString()} VNĐ/đêm</p>
                                                    <p>👥 Sức chứa: {room.capacity} người</p>
                                                    <p>🛏️ Có {room.totalRooms} phòng</p>
                                                </div>
                                                <div className="room-actions">
                                                    <button className="btn-delete" onClick={() => handleDeleteRoom(room.id)}>
                                                        🗑️ Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <p>Vui lòng chọn khách sạn để xem phòng</p>
                            )}
                        </div>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        <div className="tab-pane">
                            <h2>Quản lý đơn đặt</h2>
                            
                            <div className="bookings-list">
                                {bookings.length === 0 ? (
                                    <p>Chưa có đơn đặt nào</p>
                                ) : (
                                    bookings.map(booking => (
                                        <div key={booking.id} className="booking-item">
                                            <div className="booking-info">
                                                <h3>Đơn #{booking.id}</h3>
                                                <p>👤 Khách: {booking.guestName}</p>
                                                <p>📧 Email: {booking.guestEmail}</p>
                                                <p>📅 Nhận: {booking.checkInDate} | Trả: {booking.checkOutDate}</p>
                                                <p>💰 Tổng tiền: {booking.totalPrice.toLocaleString()} VNĐ</p>
                                            </div>
                                            <div className="booking-status">
                                                <select 
                                                    value={booking.status}
                                                    onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="Pending">⏳ Chờ xác nhận</option>
                                                    <option value="Confirmed">✅ Đã xác nhận</option>
                                                    <option value="CheckedIn">🔑 Đã nhận phòng</option>
                                                    <option value="Completed">✔️ Hoàn tất</option>
                                                    <option value="Cancelled">❌ Hủy</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HostDashboard;