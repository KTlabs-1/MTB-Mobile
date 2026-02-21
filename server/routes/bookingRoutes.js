const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get available time slots for a date
router.get('/available-slots', bookingController.getAvailableSlots);

// Get booking by reference number
router.get('/:ref', bookingController.getBooking);

// Cancel a booking
router.post('/:ref/cancel', bookingController.cancelBooking);

module.exports = router;
