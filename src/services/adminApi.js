const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const adminApi = {
  async getBookingStats() {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  async getTodayBookings() {
    const response = await fetch(`${API_URL}/admin/bookings/today`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  async getAllBookings(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/admin/bookings?${params}`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  async updateBookingStatus(bookingRef, status) {
    const response = await fetch(`${API_URL}/admin/bookings/${bookingRef}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return response.json();
  },

  async cancelBooking(bookingRef) {
    const response = await fetch(`${API_URL}/admin/bookings/${bookingRef}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  // Schedule management
  async getSchedules() {
    const response = await fetch(`${API_URL}/schedule/all`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  async setSchedule(weekStart, location) {
    const response = await fetch(`${API_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ weekStart, location })
    });
    return response.json();
  },

  async deleteSchedule(id) {
    const response = await fetch(`${API_URL}/schedule/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return response.json();
  }
};

export default adminApi;
