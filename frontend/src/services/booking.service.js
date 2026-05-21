// Booking Service
import api from './api';

const booking = {
  // Get all bookings for current user
  getUserBookings: async (params = {}) => {
    try {
      const response = await api.get('/bookings', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update booking
  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason = '') => {
    try {
      const response = await api.post(`/bookings/${bookingId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get available dates for property
  getAvailableDates: async (propertyId) => {
    try {
      const response = await api.get(`/bookings/property/${propertyId}/available`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check availability for date range
  checkAvailability: async (propertyId, checkInDate, checkOutDate) => {
    try {
      const response = await api.post('/bookings/check-availability', {
        propertyId,
        checkInDate,
        checkOutDate,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default booking;
