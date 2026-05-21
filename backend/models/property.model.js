// ác hàm query khách sạn, join với bảng Location/Rooms.

const db = require('../config/db.config');

const Property = {
    // 1. Lấy danh sách khách sạn (dùng cho trang chủ, có phân trang)
    findAll: async (limit, offset) => {
        const sql = `
            SELECT p.id, p.name, p.address, p.star_rating, p.description, l.name as location_name 
            FROM properties p
            LEFT JOIN locations l ON p.location_id = l.id
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(sql, [limit, offset]);
        return rows;
    },

    // 1.1 Đếm tổng số khách sạn để tính số trang (Pagination)
    countAll: async () => {
        const sql = 'SELECT COUNT(id) as total FROM properties';
        const [rows] = await db.query(sql);
        return rows[0].total;
    },

    // 2. Tìm kiếm và lọc khách sạn (Logic cốt lõi của Agoda)
    search: async (filters) => {
        const { location_id, min_price, max_price, star_rating, keyword } = filters;
        
        let query = `
            SELECT p.id, p.name, p.address, p.star_rating, p.description, l.name as location_name
            FROM properties p
            JOIN locations l ON p.location_id = l.id
            WHERE 1=1
        `;
        const queryParams = [];

        if (keyword) {
            query += ' AND p.name LIKE ?';
            queryParams.push(`%${keyword}%`);
        }
        if (location_id) {
            query += ' AND p.location_id = ?';
            queryParams.push(location_id);
        }
        if (star_rating) {
            query += ' AND p.star_rating = ?';
            queryParams.push(star_rating);
        }
        
        // Lọc giá dựa trên bảng rooms
        if (min_price || max_price) {
            query += ` AND p.id IN (SELECT property_id FROM rooms WHERE 1=1 `;
            if (min_price) {
                query += ' AND base_price >= ?';
                queryParams.push(min_price);
            }
            if (max_price) {
                query += ' AND base_price <= ?';
                queryParams.push(max_price);
            }
            query += ')'; 
        }

        const [rows] = await db.query(query, queryParams);
        return rows;
    },

    // 3. Lấy thông tin chi tiết 1 khách sạn
    findById: async (propertyId) => {
        const sql = `
            SELECT p.*, l.name as location_name, u.full_name as host_name 
            FROM properties p
            LEFT JOIN locations l ON p.location_id = l.id
            LEFT JOIN users u ON p.owner_id = u.id
            WHERE p.id = ?
        `;
        const [rows] = await db.query(sql, [propertyId]);
        return rows.length > 0 ? rows[0] : null;
    },

    // 4. Lấy danh sách phòng của 1 khách sạn
    findRoomsByPropertyId: async (propertyId) => {
        const sql = `
            SELECT id, room_type, base_price, capacity, total_rooms 
            FROM rooms 
            WHERE property_id = ?
        `;
        const [rows] = await db.query(sql, [propertyId]);
        return rows;
    }
};

module.exports = Property;