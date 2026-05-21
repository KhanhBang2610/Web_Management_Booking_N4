// Các hàm gọi API liên quan auth.

import api from './api';

/**
 * Auth Service
 * Cung cấp các hàm liên quan đến xác thực (login, register, logout)
 */
const authService = {
    /**
     * Đăng nhập
     * @param {string} email - Email người dùng
     * @param {string} password - Mật khẩu
     * @returns {Promise<Object>} - { token, user }
     */
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            return {
                success: true,
                token: response.data.token,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi đăng nhập',
                error: error.response?.data?.error
            };
        }
    },

    /**
     * Đăng ký tài khoản
     * @param {string} fullName - Họ tên đầy đủ
     * @param {string} email - Email
     * @param {string} password - Mật khẩu
     * @param {string} role - Vai trò (Customer hoặc Host)
     * @returns {Promise<Object>}
     */
    register: async (fullName, email, password, role = 'Customer') => {
        try {
            const response = await api.post('/auth/register', {
                fullName,
                email,
                password,
                role
            });

            return {
                success: true,
                message: response.data.message,
                userId: response.data.userId
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi đăng ký',
                error: error.response?.data?.error
            };
        }
    },

    /**
     * Xác minh email
     * @param {string} token - Verification token
     * @returns {Promise<Object>}
     */
    verifyEmail: async (token) => {
        try {
            const response = await api.post('/auth/verify-email', { token });

            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi xác minh email'
            };
        }
    },

    /**
     * Quên mật khẩu - gửi email reset
     * @param {string} email - Email người dùng
     * @returns {Promise<Object>}
     */
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });

            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi gửi email reset'
            };
        }
    },

    /**
     * Reset mật khẩu
     * @param {string} token - Reset token
     * @param {string} newPassword - Mật khẩu mới
     * @returns {Promise<Object>}
     */
    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', {
                token,
                newPassword
            });

            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi reset mật khẩu'
            };
        }
    },

    /**
     * Lấy thông tin profile của user hiện tại
     * @returns {Promise<Object>}
     */
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');

            return {
                success: true,
                user: response.data.user
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi tải profile'
            };
        }
    },

    /**
     * Cập nhật thông tin profile
     * @param {Object} data - Dữ liệu cần cập nhật
     * @returns {Promise<Object>}
     */
    updateProfile: async (data) => {
        try {
            const response = await api.put('/auth/profile', data);

            return {
                success: true,
                user: response.data.user,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi cập nhật profile'
            };
        }
    },

    /**
     * Đổi mật khẩu
     * @param {string} currentPassword - Mật khẩu hiện tại
     * @param {string} newPassword - Mật khẩu mới
     * @returns {Promise<Object>}
     */
    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });

            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi đổi mật khẩu'
            };
        }
    },

    /**
     * Logout (phía client - xóa token)
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { success: true };
    }
};

export default authService;