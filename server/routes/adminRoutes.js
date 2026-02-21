const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(auth);

router.get('/stats', adminController.getBookingStats);
router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/today', adminController.getTodayBookings);
router.put('/bookings/:ref/status', adminController.updateBookingStatus);
router.delete('/bookings/:ref', adminController.cancelBooking);

module.exports = router;
