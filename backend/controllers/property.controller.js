// Xử lý request lấy danh sách khách sạn, tìm kiếm theo bộ lọc.

const db = require('../config/db.config');

// 1. Lấy danh sách toàn bộ khách sạn (Có phân trang cơ bản)
const getAllProperties = async (req, res) => {
    try {
        // Lấy page và limit từ query (mặc định page 1, 10 items/page)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [properties] = await db.query(
            'SELECT id, name, address, star_rating FROM properties LIMIT ? OFFSET ?',
            [limit, offset]
        );

        // Đếm tổng số lượng để FE làm giao diện phân trang (Pagination)
        const [totalRows] = await db.query('SELECT COUNT(id) as total FROM properties');
        const total = totalRows[0].total;

        res.status(200).json({
            message: 'Lấy danh sách thành công',
            data: properties,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            }
        });
    } catch (error) {
        console.error('Lỗi API getAllProperties:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách sạn.' });
    }
};

// 2. Tìm kiếm và Lọc khách sạn (Tính năng quan trọng nhất)
const PropertyModel = require('../models/property.model');

const searchProperties = async (req, res, next) => {
    try {
        // Gom tất cả query người dùng gửi lên thành 1 object
        const filters = {
            location_id: req.query.location_id,
            min_price: req.query.min_price,
            max_price: req.query.max_price,
            star_rating: req.query.star_rating,
            keyword: req.query.keyword
        };

        // Đẩy xuống Model xử lý
        const results = await PropertyModel.search(filters);

        res.status(200).json({
            success: true,
            totalResults: results.length,
            data: results
        });
    } catch (error) {
        next(error); // Đẩy lỗi cho error.middleware.js xử lý
    }
};

// 3. Lấy chi tiết 1 khách sạn và danh sách các phòng thuộc khách sạn đó
const getPropertyById = async (req, res) => {
    try {
        const propertyId = req.params.id; // Lấy ID từ URL param (VD: /api/properties/5)

        // Lấy thông tin cơ bản của khách sạn
        const [properties] = await db.query(
            'SELECT * FROM properties WHERE id = ?', 
            [propertyId]
        );

        if (properties.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy khách sạn này.' });
        }

        const propertyDetail = properties[0];

        // Lấy danh sách các phòng thuộc khách sạn này
        const [rooms] = await db.query(
            'SELECT id, room_type, base_price, capacity, total_rooms FROM rooms WHERE property_id = ?',
            [propertyId]
        );

        // Gắn danh sách phòng vào object trả về
        propertyDetail.rooms = rooms;

        res.status(200).json({
            message: 'Lấy thông tin chi tiết thành công',
            data: propertyDetail
        });
    } catch (error) {
        console.error('Lỗi API getPropertyById:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết khách sạn.' });
    }
};

module.exports = {
    getAllProperties,
    searchProperties,
    getPropertyById
};