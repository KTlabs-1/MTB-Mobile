const Booking = require('../models/Booking');

const adminController = {
  // GET /api/admin/stats
  async getBookingStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const [todayCount, weekCount, completedBookings, pendingCount] = await Promise.all([
        Booking.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: { $ne: 'cancelled' } }),
        Booking.countDocuments({ date: { $gte: weekStart, $lt: weekEnd }, status: { $ne: 'cancelled' } }),
        Booking.find({ status: 'completed' }),
        Booking.countDocuments({ status: 'confirmed' })
      ]);

      const revenue = completedBookings.reduce((sum, b) => sum + b.service.price, 0);

      res.json({
        success: true,
        stats: {
          today: todayCount,
          week: weekCount,
          revenue,
          pending: pendingCount
        }
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({ success: false, message: 'Error getting stats' });
    }
  },

  // GET /api/admin/bookings/today
  async getTodayBookings(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const bookings = await Booking.find({
        date: { $gte: today, $lt: tomorrow }
      }).sort({ time: 1 });

      res.json({ success: true, bookings });
    } catch (error) {
      console.error('Error getting today bookings:', error);
      res.status(500).json({ success: false, message: 'Error getting bookings' });
    }
  },

  // GET /api/admin/bookings
  async getAllBookings(req, res) {
    try {
      const { status, search, page = 1, limit = 20 } = req.query;

      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { 'customer.name': { $regex: search, $options: 'i' } },
          { bookingRef: { $regex: search, $options: 'i' } }
        ];
      }

      const bookings = await Booking.find(query)
        .sort({ date: -1, time: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Booking.countDocuments(query);

      res.json({
        success: true,
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting all bookings:', error);
      res.status(500).json({ success: false, message: 'Error getting bookings' });
    }
  },

  // PUT /api/admin/bookings/:ref/status
  async updateBookingStatus(req, res) {
    try {
      const { ref } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const booking = await Booking.findOneAndUpdate(
        { bookingRef: ref },
        { status },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.json({ success: true, booking });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ success: false, message: 'Error updating booking' });
    }
  },

  // DELETE /api/admin/bookings/:ref
  async cancelBooking(req, res) {
    try {
      const { ref } = req.params;

      const booking = await Booking.findOneAndUpdate(
        { bookingRef: ref },
        { status: 'cancelled' },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.json({ success: true, message: 'Booking cancelled' });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ success: false, message: 'Error cancelling booking' });
    }
  }
};

module.exports = adminController;
