/**
 * API Service
 *
 * Handles all communication with the backend API
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Booking result with reference number
   */
  async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - createBooking:', error);
      throw error;
    }
  },

  /**
   * Get available time slots for a specific date
   * @param {string} date - ISO date string
   * @returns {Promise<Object>} Available slots data
   */
  async getAvailableSlots(date) {
    try {
      const response = await fetch(`${API_URL}/bookings/available-slots?date=${date}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - getAvailableSlots:', error);
      throw error;
    }
  },

  /**
   * Get booking details by reference number
   * @param {string} bookingRef - Booking reference (e.g., MTB-123456)
   * @returns {Promise<Object>} Booking details
   */
  async getBooking(bookingRef) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingRef}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - getBooking:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   * @param {string} bookingRef - Booking reference to cancel
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelBooking(bookingRef) {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingRef}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - cancelBooking:', error);
      throw error;
    }
  },

  /**
   * Send test email
   * @param {string} email - Email address to test
   * @returns {Promise<Object>} Email send result
   */
  async testEmail(email) {
    try {
      const response = await fetch(`${API_URL}/email/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - testEmail:', error);
      throw error;
    }
  },

  /**
   * Get available daily schedules (next 7 days)
   */
  async getAvailableSchedules() {
    try {
      const response = await fetch(`${API_URL}/schedule/available`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error - getAvailableSchedules:', error);
      return { success: false, schedules: [] };
    }
  },

  /**
   * Get current locations (today and tomorrow)
   */
  async getCurrentLocations() {
    try {
      const response = await fetch(`${API_URL}/schedule/current`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error - getCurrentLocations:', error);
      return { success: false, today: null, tomorrow: null };
    }
  },

  /**
   * Get available weeks/schedules (backwards-compatible alias)
   */
  async getAvailableWeeks() {
    return this.getAvailableSchedules();
  },

  /**
   * Health check endpoint
   * @returns {Promise<Object>} API health status
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_URL.replace('/api', '')}/api/health`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error - healthCheck:', error);
      throw error;
    }
  },
};

export default api;
