// e.g., POST /api/bookings/create

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Khách hàng vãng lai có thể check xem phòng còn trống không (Không cần token)
router.post('/check-availability', bookingController.checkAvailability);

// BẮT BUỘC ĐĂNG NHẬP: Đi qua cổng bảo vệ verifyToken
router.post('/create', verifyToken, bookingController.createBooking);
router.get('/my-bookings', verifyToken, bookingController.getUserBookings);

module.exports = router;