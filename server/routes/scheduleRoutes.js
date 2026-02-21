const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

// Public routes
router.get('/available', scheduleController.getAvailableWeeks);
router.get('/location/:location', scheduleController.getScheduleByLocation);

// Admin routes (require auth)
router.get('/all', auth, scheduleController.getAllSchedules);
router.post('/', auth, scheduleController.setSchedule);
router.delete('/:id', auth, scheduleController.deleteSchedule);

module.exports = router;
