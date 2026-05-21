// Các hàm gọi API fetch danh sách, lấy chi tiết.

import api from './api';

/**
 * Property Service
 * Cung cấp các hàm liên quan đến properties (khách sạn)
 */
const propertyService = {
    /**
     * Lấy danh sách tất cả properties
     * @param {number} page - Trang (default 1)
     * @param {number} limit - Số items trên trang (default 10)
     * @returns {Promise<Object>}
     */
    getAll: async (page = 1, limit = 10) => {
        try {
            const response = await api.get('/properties', {
                params: { page, limit }
            });

            return {
                success: true,
                data: response.data.data || [],
                total: response.data.total,
                pagination: response.data.pagination
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi tải danh sách properties'
            };
        }
    },

    /**
     * Tìm kiếm properties
     * @param {Object} filters - Tiêu chí tìm kiếm
     * @returns {Promise<Object>}
     */
    search: async (filters) => {
        try {
            const response = await api.get('/properties/search', {
                params: filters
            });

            return {
                success: true,
                data: response.data.data || []
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi tìm kiếm properties'
            };
        }
    },

    /**
     * Lấy chi tiết property
     * @param {number} propertyId - ID của property
     * @returns {Promise<Object>}
     */
    getById: async (propertyId) => {
        try {
            const response = await api.get(`/properties/${propertyId}`);

            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi tải chi tiết property'
            };
        }
    },

    /**
     * Lấy danh sách properties của host hiện tại
     * @returns {Promise<Object>}
     */
    getHostProperties: async () => {
        try {
            const response = await api.get('/properties/host');

            return {
                success: true,
                data: response.data.data || []
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi tải properties của host'
            };
        }
    },

    /**
     * Tạo property mới
     * @param {Object} propertyData - Dữ liệu property
     * @returns {Promise<Object>}
     */
    create: async (propertyData) => {
        try {
            const response = await api.post('/properties', propertyData);

            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi tạo property'
            };
        }
    },

    /**
     * Cập nhật property
     * @param {number} propertyId - ID property
     * @param {Object} updateData - Dữ liệu cần cập nhật
     * @returns {Promise<Object>}
     */
    update: async (propertyId, updateData) => {
        try {
            const response = await api.put(`/properties/${propertyId}`, updateData);

            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi cập nhật property'
            };
        }
    },

    /**
     * Xóa property
     * @param {number} propertyId - ID property
     * @returns {Promise<Object>}
     */
    delete: async (propertyId) => {
        try {
            const response = await api.delete(`/properties/${propertyId}`);

            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi xóa property'
            };
        }
    },

    /**
     * Upload ảnh cho property
     * @param {number} propertyId - ID property
     * @param {FormData} formData - FormData chứa file ảnh
     * @returns {Promise<Object>}
     */
    uploadImages: async (propertyId, formData) => {
        try {
            const response = await api.post(`/properties/${propertyId}/upload-images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return {
                success: true,
                images: response.data.images,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi upload ảnh'
            };
        }
    },

    /**
     * Lấy danh sách phòng của property
     * @param {number} propertyId - ID property
     * @returns {Promise<Object>}
     */
    getRooms: async (propertyId) => {
        try {
            const response = await api.get(`/rooms/property/${propertyId}`);

            return {
                success: true,
                data: response.data.data || []
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi tải danh sách phòng'
            };
        }
    },

    /**
     * Kiểm tra tính khả dụng của phòng
     * @param {number} roomId - ID phòng
     * @param {string} checkIn - Ngày check-in
     * @param {string} checkOut - Ngày check-out
     * @returns {Promise<Object>}
     */
    checkAvailability: async (roomId, checkIn, checkOut) => {
        try {
            const response = await api.post('/properties/check-availability', {
                roomId,
                checkInDate: checkIn,
                checkOutDate: checkOut
            });

            return {
                success: true,
                isAvailable: response.data.isAvailable,
                availableRooms: response.data.availableRooms
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi kiểm tra tính khả dụng'
            };
        }
    }
};

export default propertyService;