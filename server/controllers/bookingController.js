const Booking = require('../models/Booking');
const emailService = require('../services/emailService');

const bookingController = {
  /**
   * Create a new booking
   * POST /api/bookings
   */
  async createBooking(req, res) {
    try {
      const { customer, service, date, time } = req.body;

      // Validate required fields
      if (!customer || !service || !date || !time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // Generate unique booking reference
      const bookingRef = Booking.generateBookingRef();
      const depositAmount = service.deposit;
      const remainingAmount = service.price - depositAmount;

      // Create booking
      const booking = new Booking({
        bookingRef,
        customer,
        service,
        date: new Date(date),
        time,
        payment: {
          depositAmount,
          depositPaid: true,
          remainingAmount
        },
        status: 'confirmed'
      });

      await booking.save();

      // Send emails (don't await - let them send in background)
      emailService.sendBookingConfirmation(booking).catch(err =>
        console.error('Customer email error:', err)
      );
      emailService.sendNewBookingAlert(booking).catch(err =>
        console.error('Admin email error:', err)
      );

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking: {
          bookingRef: booking.bookingRef,
          date: booking.date,
          time: booking.time,
          service: booking.service,
          customer: {
            name: booking.customer.name,
            email: booking.customer.email
          }
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating booking',
        error: error.message
      });
    }
  },

  /**
   * Get available time slots for a specific date
   * GET /api/bookings/available-slots?date=2024-01-01
   */
  async getAvailableSlots(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date parameter is required'
        });
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await Booking.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['pending', 'confirmed'] }
      });

      const bookedTimes = bookings.map(b => b.time);

      res.json({
        success: true,
        bookedTimes,
        date: startOfDay
      });
    } catch (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching available slots'
      });
    }
  },

  /**
   * Get booking by reference number
   * GET /api/bookings/:ref
   */
  async getBooking(req, res) {
    try {
      const booking = await Booking.findOne({ bookingRef: req.params.ref });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        booking
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching booking'
      });
    }
  },

  /**
   * Cancel a booking
   * POST /api/bookings/:ref/cancel
   */
  async cancelBooking(req, res) {
    try {
      const booking = await Booking.findOne({ bookingRef: req.params.ref });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      booking.status = 'cancelled';
      await booking.save();

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        booking: {
          bookingRef: booking.bookingRef,
          status: booking.status
        }
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({
        success: false,
        message: 'Error cancelling booking'
      });
    }
  }
};

module.exports = bookingController;
