const jwt = require('jsonwebtoken');

// Middleware xác thực Token người dùng
const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization (Thường có dạng: Bearer <token>)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để thực hiện thao tác này!'
        });
    }

    // Cắt chuỗi để lấy phần Token phía sau chữ 'Bearer '
    const token = authHeader.split(' ')[1];

    try {
        // Giải mã và kiểm tra token xem có hợp lệ không
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin user giải mã được vào object req để các Controller phía sau sử dụng
        req.user = decoded; 
        
        next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
        // Đẩy lỗi sang cho error.middleware.js xử lý (Token hết hạn hoặc không hợp lệ)
        next(error); 
    }
};

// Middleware phân quyền - Chỉ cho phép các Role cụ thể truy cập (ví dụ: Admin, Host)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Kiểm tra xem role của user có nằm trong danh sách được phép không
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập vào chức năng này!'
            });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    authorizeRoles
};