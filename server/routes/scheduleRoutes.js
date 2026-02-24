const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

// Public routes
router.get('/available', scheduleController.getAvailableSchedules);
router.get('/date/:date', scheduleController.getScheduleByDate);
router.get('/current', scheduleController.getCurrentLocations);

// Admin routes
router.get('/all', auth, scheduleController.getAllSchedules);
router.post('/daily', auth, scheduleController.setDailySchedule);
router.post('/week', auth, scheduleController.setWeekSchedules);
router.delete('/:id', auth, scheduleController.deleteSchedule);

module.exports = router;
