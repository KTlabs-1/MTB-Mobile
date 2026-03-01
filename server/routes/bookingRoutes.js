const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get available time slots for a date
router.get('/available-slots', bookingController.getAvailableSlots);

// Customer self-cancel (public — must be before /:ref to avoid conflict)
router.post('/cancel', bookingController.customerCancelBooking);

// Get booking by reference number
router.get('/:ref', bookingController.getBooking);

// Admin cancel with reason + Stripe refund (auth required, uses MongoDB _id)
router.put('/:id/cancel', auth, bookingController.cancelBooking);

module.exports = router;
