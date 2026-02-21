const WeeklySchedule = require('../models/WeeklySchedule');
const Booking = require('../models/Booking');
const emailService = require('../services/emailService');

const scheduleController = {
  // Get current and upcoming schedules (public - for booking page)
  async getAvailableWeeks(req, res) {
    try {
      const today = new Date();
      const thisWeekStart = WeeklySchedule.getWeekStart(today);

      const schedules = await WeeklySchedule.find({
        weekStart: { $gte: thisWeekStart },
        isActive: true
      }).sort({ weekStart: 1 }).limit(4);

      res.json({ success: true, schedules });
    } catch (error) {
      console.error('Error getting available weeks:', error);
      res.status(500).json({ success: false, message: 'Error getting schedules' });
    }
  },

  // Get schedule for a specific location (public)
  async getScheduleByLocation(req, res) {
    try {
      const { location } = req.params;
      const today = new Date();
      const thisWeekStart = WeeklySchedule.getWeekStart(today);

      const schedule = await WeeklySchedule.findOne({
        location: location,
        weekStart: { $gte: thisWeekStart },
        isActive: true
      }).sort({ weekStart: 1 });

      if (!schedule) {
        return res.json({
          success: true,
          available: false,
          message: `Not in ${location} this week or next week`,
          requiresVIP: true
        });
      }

      res.json({
        success: true,
        available: true,
        schedule
      });
    } catch (error) {
      console.error('Error getting schedule by location:', error);
      res.status(500).json({ success: false, message: 'Error getting schedule' });
    }
  },

  // Admin: Get all schedules
  async getAllSchedules(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const schedules = await WeeklySchedule.find({
        weekEnd: { $gte: today }
      }).sort({ weekStart: 1 });

      res.json({ success: true, schedules });
    } catch (error) {
      console.error('Error getting all schedules:', error);
      res.status(500).json({ success: false, message: 'Error getting schedules' });
    }
  },

  // Admin: Set weekly schedule
  async setSchedule(req, res) {
    try {
      const { weekStart, location } = req.body;

      const startDate = new Date(weekStart);
      const weekStartDate = WeeklySchedule.getWeekStart(startDate);
      const weekEndDate = WeeklySchedule.getWeekEnd(startDate);

      // Check if schedule already exists for this week
      let schedule = await WeeklySchedule.findOne({
        weekStart: weekStartDate
      });

      if (schedule) {
        const oldLocation = schedule.location;
        schedule.location = location;
        schedule.updatedAt = new Date();
        await schedule.save();

        let affectedBookings = 0;
        // If location changed, notify affected customers
        if (oldLocation !== location) {
          affectedBookings = await scheduleController.notifyAffectedCustomers(
            weekStartDate, weekEndDate, oldLocation, location
          );
        }

        res.json({ success: true, schedule, updated: true, affectedBookings });
      } else {
        schedule = new WeeklySchedule({
          weekStart: weekStartDate,
          weekEnd: weekEndDate,
          location,
          createdBy: req.user?._id
        });
        await schedule.save();

        res.json({ success: true, schedule, created: true });
      }
    } catch (error) {
      console.error('Error setting schedule:', error);
      res.status(500).json({ success: false, message: 'Error setting schedule' });
    }
  },

  // Admin: Delete schedule
  async deleteSchedule(req, res) {
    try {
      const { id } = req.params;

      const schedule = await WeeklySchedule.findById(id);
      if (!schedule) {
        return res.status(404).json({ success: false, message: 'Schedule not found' });
      }

      // Check for existing bookings
      const bookings = await Booking.find({
        date: { $gte: schedule.weekStart, $lte: schedule.weekEnd },
        status: { $in: ['pending', 'confirmed'] }
      });

      if (bookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete schedule. ${bookings.length} bookings exist for this week.`,
          bookingsCount: bookings.length
        });
      }

      await WeeklySchedule.findByIdAndDelete(id);
      res.json({ success: true, message: 'Schedule deleted' });
    } catch (error) {
      console.error('Error deleting schedule:', error);
      res.status(500).json({ success: false, message: 'Error deleting schedule' });
    }
  },

  // Helper: Notify customers when location changes
  async notifyAffectedCustomers(weekStart, weekEnd, oldLocation, newLocation) {
    try {
      const affectedBookings = await Booking.find({
        date: { $gte: weekStart, $lte: weekEnd },
        status: { $in: ['pending', 'confirmed'] }
      });

      for (const booking of affectedBookings) {
        booking.status = 'cancelled';
        booking.cancellationReason = `Location changed from ${oldLocation} to ${newLocation}`;
        await booking.save();

        await emailService.sendLocationChangeNotification(booking, oldLocation, newLocation);
      }

      return affectedBookings.length;
    } catch (error) {
      console.error('Error notifying customers:', error);
      return 0;
    }
  }
};

module.exports = scheduleController;
