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
   * Cancel a booking (admin) — sends reason, processes Stripe refund
   * @param {string} id - MongoDB _id of the booking
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelBooking(id, reason) {
    try {
      const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - cancelBooking:', error);
      return { success: false, message: 'Failed to cancel booking' };
    }
  },

  /**
   * Customer self-cancel a booking (public, 24hr rule)
   * @param {string} bookingReference - Booking reference (e.g. MTB-123456)
   * @param {string} email - Customer email address
   * @returns {Promise<Object>} Cancellation result
   */
  async customerCancelBooking(bookingReference, email) {
    try {
      const response = await fetch(`${API_URL}/bookings/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingReference, email }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - customerCancelBooking:', error);
      return { success: false, message: 'Failed to cancel booking' };
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
   * Get Stripe publishable key from backend
   */
  async getStripeConfig() {
    try {
      const response = await fetch(`${API_URL}/payment/config`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error - getStripeConfig:', error);
      throw error;
    }
  },

  /**
   * Create a Stripe PaymentIntent for a deposit
   * @param {number} amount - Deposit amount in euros
   * @param {Object} bookingDetails - Customer and service info for metadata
   */
  async createPaymentIntent(amount, bookingDetails) {
    try {
      const response = await fetch(`${API_URL}/payment/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bookingDetails }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error - createPaymentIntent:', error);
      throw error;
    }
  },

  /**
   * Verify a PaymentIntent succeeded
   * @param {string} paymentIntentId - Stripe PaymentIntent ID
   */
  async confirmPayment(paymentIntentId) {
    try {
      const response = await fetch(`${API_URL}/payment/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error - confirmPayment:', error);
      throw error;
    }
  },

  /**
   * Admin login
   */
  async adminLogin(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error - adminLogin:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  /**
   * Helper to get auth headers for admin requests
   */
  getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  /**
   * Set schedules for multiple days at once (admin)
   * @param {Array} schedules - Array of { date, location } objects
   */
  async setWeekSchedules(schedules) {
    try {
      const response = await fetch(`${API_URL}/schedule/week`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ schedules }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error - setWeekSchedules:', error);
      return { success: false, message: 'Failed to save schedules' };
    }
  },

  /**
   * Get all bookings for admin, filtered by upcoming/past/all (client-side date filter)
   * @param {string} filter - 'upcoming' | 'past' | 'all'
   */
  async getAdminBookings(filter = 'all') {
    try {
      const response = await fetch(`${API_URL}/admin/bookings?limit=200`, {
        headers: this.getAuthHeaders(),
      });
      const data = await response.json();
      if (!data.success) return data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let bookings = data.bookings || [];
      if (filter === 'upcoming') {
        bookings = bookings.filter(
          (b) => new Date(b.date) >= today && b.status !== 'cancelled'
        );
      } else if (filter === 'past') {
        bookings = bookings.filter(
          (b) => new Date(b.date) < today || b.status === 'completed' || b.status === 'cancelled'
        );
      }

      return { success: true, bookings };
    } catch (error) {
      console.error('API Error - getAdminBookings:', error);
      return { success: false, bookings: [] };
    }
  },

  /**
   * Cancel a booking (admin)
   * @param {string} bookingRef - Booking reference
   */
  async adminCancelBooking(bookingRef) {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/${bookingRef}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - adminCancelBooking:', error);
      return { success: false, message: 'Failed to cancel booking' };
    }
  },

  /**
   * Update booking status (admin)
   * @param {string} bookingRef - Booking reference
   * @param {string} status - New status
   */
  async adminUpdateBookingStatus(bookingRef, status) {
    try {
      const response = await fetch(`${API_URL}/admin/bookings/${bookingRef}/status`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error - adminUpdateBookingStatus:', error);
      return { success: false, message: 'Failed to update status' };
    }
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
