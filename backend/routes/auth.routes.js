// e.g., POST /api/auth/login

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Khách hàng không cần đăng nhập cũng gọi được các API này
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;