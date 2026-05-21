// Khởi tạo kết nối với MySQL

const mysql = require('mysql2');
require('dotenv').config(); // Load các biến môi trường từ file .env

// Tạo một Connection Pool để quản lý và tái sử dụng các kết nối
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Số lượng kết nối tối đa được mở cùng lúc (có thể tăng lên khi deploy thực tế)
    queueLimit: 0        // Số lượng request tối đa xếp hàng chờ (0 = không giới hạn)
});

// Kiểm tra kết nối ngay khi khởi động server
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused. Check your MySQL server.');
        } else {
            console.error('Lỗi kết nối MySQL:', err.message);
        }
    } else {
        console.log('Đã kết nối thành công tới MySQL Database!');
        connection.release(); // Trả lại kết nối cho pool sau khi test xong
    }
});

// Xuất ra dạng Promise để dùng async/await ở các Controller
module.exports = pool.promise();