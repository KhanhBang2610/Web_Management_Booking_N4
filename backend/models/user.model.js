// Các hàm query liên quan đến user (findById, create...).

const db = require('../config/db.config');

const User = {
    // 1. Tìm người dùng theo Email (Dùng khi Đăng nhập hoặc kiểm tra trùng lặp khi Đăng ký)
    findByEmail: async (email) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(sql, [email]);
        return rows.length > 0 ? rows[0] : null;
    },

    // 2. Tìm người dùng theo ID (Dùng khi cần lấy thông tin profile)
    findById: async (id) => {
        const sql = 'SELECT id, full_name, email, role, phone, created_at FROM users WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    },

    // 3. Tạo tài khoản mới (Đăng ký)
    create: async (userData) => {
        const { fullName, email, passwordHash, role = 'Customer', phone = null } = userData;
        const sql = `
            INSERT INTO users (full_name, email, password_hash, role, phone) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [fullName, email, passwordHash, role, phone]);
        return result.insertId; // Trả về ID của user vừa tạo
    },

    // 4. Cập nhật mật khẩu mới (Quên mật khẩu / Đổi mật khẩu)
    updatePassword: async (email, newPasswordHash) => {
        const sql = 'UPDATE users SET password_hash = ? WHERE email = ?';
        const [result] = await db.query(sql, [newPasswordHash, email]);
        return result.affectedRows > 0;
    }
};

module.exports = User;