// Trang chủ (Banner, thanh tìm kiếm, điểm đến nổi bật).

import React from 'react';
import './Home.css'; //thêm file CSS để style

const Home = () => {
    return (
        <div className="home-container">
            {/* 1. HERO BANNER CÓ ẢNH BIỂN */}
            <div 
                className="hero-section"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
                }}
            >
                <div className="hero-content">
                    <h1 className="brand-name">Angolala</h1>
                    <p className="slogan">Trải nghiệm kỳ nghỉ tuyệt vời!</p>
                </div>

                {/* 2. THANH TÌM KIẾM ĐẶT PHÒNG */}
                <div className="search-box">
                    <div className="search-input-group">
                        <label>Địa điểm</label>
                        <input type="text" placeholder="Bạn muốn đến đâu (VD: Phú Quốc, Đà Nẵng)?" />
                    </div>
                    
                    <div className="search-input-group">
                        <label>Nhận phòng</label>
                        <input type="date" />
                    </div>

                    <div className="search-input-group">
                        <label>Trả phòng</label>
                        <input type="date" />
                    </div>

                    <div className="search-input-group">
                        <label>Số người</label>
                        <select>
                            <option>1 Người lớn</option>
                            <option>2 Người lớn</option>
                            <option>Gia đình</option>
                        </select>
                    </div>

                    <button className="btn-search">Tìm Kiếm</button>
                </div>
            </div>

            {/* 3. ĐIỂM ĐẾN NỔI BẬT */}
            <div className="featured-destinations">
                <h2 className="section-title">Khám Phá Điểm Đến Hot Nhất</h2>
                <div className="destination-grid">
                    {/* Bạn có thể map() dữ liệu từ API ở đây sau */}
                    <div className="dest-card">
                        <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Phú Quốc" />
                        <h3>Phú Quốc</h3>
                    </div>
                    <div className="dest-card">
                        <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Nha Trang" />
                        <h3>Nha Trang</h3>
                    </div>
                    <div className="dest-card">
                        <img src="https://images.unsplash.com/photo-1536584754829-12214d404f32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Đà Nẵng" />
                        <h3>Đà Nẵng</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;