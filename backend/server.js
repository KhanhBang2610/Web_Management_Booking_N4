// File gốc khởi chạy server Express, gộp các routes.

const express = require('express');
const cors = require('cors'); // Đừng quên cài cors để React gọi được API nhé
require('dotenv').config();

const app = express();

// Middlewares cơ bản
app.use(cors());
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi từ body lên
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const bookingRoutes = require('./routes/booking.routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

// Khai báo Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);

// Bắt lỗi 404 và xử lý lỗi tổng
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend đã chạy thành công tại http://localhost:${PORT}`);
});
