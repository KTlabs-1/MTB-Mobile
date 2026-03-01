const Booking = require('../models/Booking');
const emailService = require('../services/emailService');

const bookingController = {
  /**
   * Create a new booking
   * POST /api/bookings
   */
  async createBooking(req, res) {
    const validateEircode = (eircode) => {
      const cleaned = eircode.replace(/\s/g, '').toUpperCase();
      const eircodeRegex = /^[A-Z]\d[0-9A-Z][0-9A-Z]{4}$/;
      return eircodeRegex.test(cleaned);
    };

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    try {
      const { customer, service, date, time, location, isAfterHours, afterHoursLocation, paymentIntentId } = req.body;

      // Validate required fields
      if (!customer || !service || !date || !time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      if (!validateEmail(customer.email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
      }

      if (!customer.eircode || !validateEircode(customer.eircode)) {
        return res.status(400).json({ success: false, message: 'Invalid Eircode format' });
      }

      // After hours pricing (server-side verification)
      const afterHoursPricing = {
        'Dundalk':  { price: 80,  deposit: 40 },
        'Drogheda': { price: 100, deposit: 50 },
        'Dublin':   { price: 120, deposit: 60 },
        'Belfast':  { price: 150, deposit: 75 },
      };

      let finalPrice, finalDeposit;
      if (isAfterHours && afterHoursLocation && afterHoursPricing[afterHoursLocation]) {
        const pricing = afterHoursPricing[afterHoursLocation];
        finalPrice = pricing.price;
        finalDeposit = pricing.deposit;
      } else {
        finalPrice = service.price;
        finalDeposit = service.deposit;
      }

      // Generate unique booking reference
      const bookingRef = Booking.generateBookingRef();
      const depositAmount = finalDeposit;
      const remainingAmount = finalPrice - finalDeposit;

      // Create booking
      const booking = new Booking({
        bookingRef,
        customer: {
          ...customer,
          eircode: customer.eircode.replace(/\s/g, '').toUpperCase()
        },
        service: { ...service, price: finalPrice, deposit: finalDeposit },
        date: new Date(date),
        time,
        location: location || null,
        isAfterHours: isAfterHours || false,
        afterHoursLocation: isAfterHours ? afterHoursLocation : null,
        afterHoursPrice: isAfterHours ? finalPrice : null,
        payment: {
          depositAmount,
          depositPaid: true,
          remainingAmount,
          paymentIntentId: paymentIntentId || null
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
   * Cancel a booking (admin) — with Stripe refund and reason
   * PUT /api/bookings/:id/cancel
   */
  async cancelBooking(req, res) {
    try {
      const { reason } = req.body;
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({ success: false, message: 'Booking already cancelled' });
      }

      // Process Stripe refund if deposit was paid
      let refundResult = null;
      if (booking.payment?.depositPaid && booking.payment?.paymentIntentId) {
        try {
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
          refundResult = await stripe.refunds.create({
            payment_intent: booking.payment.paymentIntentId,
          });
        } catch (stripeError) {
          console.error('Stripe refund error:', stripeError);
          return res.status(500).json({
            success: false,
            message: 'Failed to process refund. Please try again or refund manually via Stripe dashboard.'
          });
        }
      }

      booking.status = 'cancelled';
      booking.cancellation = {
        cancelledAt: new Date(),
        cancelledBy: 'admin',
        reason: reason || 'No reason provided',
        refunded: refundResult ? true : false,
        refundId: refundResult?.id || null
      };

      await booking.save();

      res.json({
        success: true,
        booking,
        message: refundResult
          ? 'Booking cancelled and deposit refunded successfully'
          : 'Booking cancelled successfully',
        refunded: refundResult ? true : false
      });
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel booking' });
    }
  },

  /**
   * Customer self-cancel (24hr rule, auto-refund)
   * POST /api/bookings/cancel
   */
  async customerCancelBooking(req, res) {
    try {
      const { bookingReference, email } = req.body;

      const booking = await Booking.findOne({
        bookingRef: bookingReference.toUpperCase(),
        'customer.email': email.toLowerCase()
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found. Check your reference and email.'
        });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({ success: false, message: 'Booking already cancelled' });
      }

      // Check 24hr rule — parse AM/PM time format (e.g. "2:00 PM")
      const appointmentDate = new Date(booking.date);
      const timeParts = booking.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const period = timeParts[3].toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        appointmentDate.setHours(hours, minutes, 0, 0);
      }

      const now = new Date();
      const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

      if (hoursUntilAppointment < 24) {
        return res.status(400).json({
          success: false,
          message: 'Cancellations must be made at least 24 hours before your appointment. Please contact us directly.'
        });
      }

      // Process Stripe refund if deposit was paid
      let refundResult = null;
      if (booking.payment?.depositPaid && booking.payment?.paymentIntentId) {
        try {
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
          refundResult = await stripe.refunds.create({
            payment_intent: booking.payment.paymentIntentId,
          });
        } catch (stripeError) {
          console.error('Stripe refund error:', stripeError);
          return res.status(500).json({
            success: false,
            message: 'Failed to process refund. Please contact us directly.'
          });
        }
      }

      booking.status = 'cancelled';
      booking.cancellation = {
        cancelledAt: new Date(),
        cancelledBy: 'customer',
        reason: 'Customer requested cancellation',
        refunded: refundResult ? true : false,
        refundId: refundResult?.id || null
      };

      await booking.save();

      res.json({
        success: true,
        message: 'Booking cancelled successfully. Your deposit will be refunded within 5-10 business days.',
        refunded: refundResult ? true : false
      });
    } catch (error) {
      console.error('Customer cancel booking error:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel booking' });
    }
  }
};

module.exports = bookingController;
