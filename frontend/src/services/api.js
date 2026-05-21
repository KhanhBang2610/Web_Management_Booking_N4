// Cấu hình Axios instance (base URL, gán token vào header).

import axios from 'axios';

/**
 * Cấu hình Axios instance với base URL và interceptor
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request Interceptor
 * Thêm token vào header mỗi khi gửi request
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * Xử lý lỗi authentication (token hết hạn, token không hợp lệ)
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Kiểm tra nếu lỗi 401 (Unauthorized)
        if (error.response?.status === 401) {
            console.error('Token hết hạn hoặc không hợp lệ');
            
            // Xóa token và user info
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect đến login
            window.location.href = '/login';
        }

        // Kiểm tra nếu lỗi 403 (Forbidden)
        if (error.response?.status === 403) {
            console.error('Không có quyền truy cập tài nguyên này');
        }

        return Promise.reject(error);
    }
);

export default api;