// Các hàm query tạo đơn đặt phòng, cập nhật trạng thái.

const db = require('../config/db.config');

const Booking = {
    // 1. Đếm số lượng phòng đã bị đặt trùng lịch
    // Mẹo nhỏ: Truyền thêm tham số connection để dùng chung Transaction ở Controller khi cần LOCK hàng dữ liệu
    countOverlappingBookings: async (roomId, checkIn, checkOut, connection = null) => {
        const client = connection || db; // Nếu có transaction thì dùng connection đó, không thì dùng pool mặc định
        
        const sql = `
            SELECT COUNT(id) as booked_count 
            FROM bookings 
            WHERE room_id = ? 
            AND status != 'Cancelled'
            AND check_in_date < ? 
            AND check_out_date > ?
        `;
        
        const [rows] = await client.query(sql, [roomId, checkOut, checkIn]);
        return rows[0].booked_count;
    },

    // 2. Tạo đơn đặt phòng mới
    create: async (bookingData, connection = null) => {
        const client = connection || db;
        const { userId, roomId, checkInDate, checkOutDate, totalPrice } = bookingData;
        
        const sql = `
            INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status) 
            VALUES (?, ?, ?, ?, ?, 'Pending')
        `;
        
        const [result] = await client.query(sql, [userId, roomId, checkInDate, checkOutDate, totalPrice]);
        return result.insertId; // Trả về ID của đơn đặt phòng vừa tạo
    },

    // 3. Tìm lịch sử đặt phòng của một User (Join nhiều bảng để lấy đủ thông tin hiển thị lên FE)
    findByUserId: async (userId) => {
        const sql = `
            SELECT b.id as booking_id, b.check_in_date, b.check_out_date, b.total_price, b.status, b.created_at,
                   r.room_type, r.base_price,
                   p.name as property_name, p.address
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN properties p ON r.property_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `;
        
        const [rows] = await db.query(sql, [userId]);
        return rows;
    },

    // 4. Cập nhật trạng thái đơn hàng (Dùng khi khách hủy phòng hoặc Admin xác nhận đơn)
    updateStatus: async (bookingId, status) => {
        const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
        const [result] = await db.query(sql, [status, bookingId]);
        return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
    }
};

module.exports = Booking;