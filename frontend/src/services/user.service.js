/* User Service */
import api from './api';

const user = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user wishlist
  getWishlist: async () => {
    try {
      const response = await api.get('/users/wishlist');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add to wishlist
  addToWishlist: async (propertyId) => {
    try {
      const response = await api.post('/users/wishlist', { propertyId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (propertyId) => {
    try {
      const response = await api.delete(`/users/wishlist/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/users/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default user;
