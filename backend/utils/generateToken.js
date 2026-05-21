// Hàm tạo JWT.

const jwt = require('jsonwebtoken');

/**
 * Tạo JWT token cho đăng nhập
 * @param {Object} payload - Dữ liệu cần mã hóa trong token (thường là { id, role })
 * @param {string} expiresIn - Thời gian hết hạn của token (ví dụ: '7d', '24h')
 * @returns {string} - JWT token
 */
const generateToken = (payload, expiresIn = null) => {
    try {
        const options = {
            expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d'
        };
        
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            options
        );
        
        return token;
    } catch (error) {
        console.error('Lỗi tạo token:', error);
        throw new Error('Không thể tạo token');
    }
};

/**
 * Xác minh JWT token có hợp lệ hay không
 * @param {string} token - JWT token cần xác minh
 * @returns {Object|null} - Payload nếu token hợp lệ, null nếu không
 */
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('Token đã hết hạn');
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Token không hợp lệ');
        }
        return null;
    }
};

/**
 * Giải mã token mà không kiểm tra chữ ký (dùng để lấy thông tin)
 * @param {string} token - JWT token cần giải mã
 * @returns {Object|null} - Payload nếu giải mã thành công, null nếu lỗi
 */
const decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.error('Lỗi giải mã token:', error);
        return null;
    }
};

/**
 * Tạo Access Token (token ngắn hạn - 15 phút) và Refresh Token (token dài hạn - 7 ngày)
 * @param {Object} payload - Dữ liệu cần mã hóa (thường là { id, role })
 * @returns {Object} - { accessToken, refreshToken }
 */
const generateAccessAndRefreshToken = (payload) => {
    try {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Token ngắn hạn cho API calls
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token dài hạn để refresh
        );

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error('Lỗi tạo access và refresh token:', error);
        throw new Error('Không thể tạo token');
    }
};

/**
 * Kiểm tra token có sắp hết hạn không (sắp hết hạn = còn dưới 1 phút)
 * @param {string} token - JWT token cần kiểm tra
 * @returns {boolean} - true nếu sắp hết hạn, false nếu còn lâu
 */
const isTokenExpiringSoon = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return true;

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = decoded.exp - now; // Thời gian còn lại (tính bằng giây)

        return timeLeft < 60; // Sắp hết hạn nếu còn dưới 1 phút
    } catch (error) {
        return true; // Coi như hết hạn nếu lỗi
    }
};

/**
 * Lấy thời gian hết hạn của token (timestamp Unix)
 * @param {string} token - JWT token
 * @returns {number|null} - Unix timestamp của thời gian hết hạn, null nếu lỗi
 */
const getTokenExpiryTime = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded?.exp || null;
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
    generateAccessAndRefreshToken,
    isTokenExpiringSoon,
    getTokenExpiryTime
};