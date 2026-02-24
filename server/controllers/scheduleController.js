const DailySchedule = require('../models/DailySchedule');
const Booking = require('../models/Booking');

const scheduleController = {
  // Get upcoming 7 days of schedules (public)
  async getAvailableSchedules(req, res) {
    try {
      const schedules = await DailySchedule.getUpcomingSchedules();

      // Format for frontend
      const formattedSchedules = schedules.map(schedule => ({
        _id: schedule._id,
        date: schedule.date,
        location: schedule.location,
        dayName: new Date(schedule.date).toLocaleDateString('en-IE', { weekday: 'short' }),
        dayNumber: new Date(schedule.date).getDate(),
        month: new Date(schedule.date).toLocaleDateString('en-IE', { month: 'short' })
      }));

      res.json({ success: true, schedules: formattedSchedules });
    } catch (error) {
      console.error('Get schedules error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch schedules' });
    }
  },

  // Get schedule for specific date (public)
  async getScheduleByDate(req, res) {
    try {
      const { date } = req.params;
      const schedule = await DailySchedule.getScheduleForDate(new Date(date));

      if (!schedule) {
        return res.json({ success: true, schedule: null });
      }

      res.json({ success: true, schedule });
    } catch (error) {
      console.error('Get schedule by date error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
    }
  },

  // Get today's and tomorrow's location for display (public)
  async getCurrentLocations(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaySchedule = await DailySchedule.getScheduleForDate(today);
      const tomorrowSchedule = await DailySchedule.getScheduleForDate(tomorrow);

      res.json({
        success: true,
        today: todaySchedule ? {
          location: todaySchedule.location,
          date: todaySchedule.date
        } : null,
        tomorrow: tomorrowSchedule ? {
          location: tomorrowSchedule.location,
          date: tomorrowSchedule.date
        } : null
      });
    } catch (error) {
      console.error('Get current locations error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch locations' });
    }
  },

  // Admin: Get all schedules
  async getAllSchedules(req, res) {
    try {
      const schedules = await DailySchedule.find().sort({ date: 1 });
      res.json({ success: true, schedules });
    } catch (error) {
      console.error('Get all schedules error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch schedules' });
    }
  },

  // Admin: Set schedule for a specific date
  async setDailySchedule(req, res) {
    try {
      const { date, location } = req.body;

      if (!date || !location) {
        return res.status(400).json({ success: false, message: 'Date and location are required' });
      }

      const scheduleDate = new Date(date);
      scheduleDate.setHours(0, 0, 0, 0);

      // Upsert - update if exists, create if not
      const schedule = await DailySchedule.findOneAndUpdate(
        { date: scheduleDate },
        { date: scheduleDate, location, isActive: true },
        { upsert: true, new: true }
      );

      res.json({ success: true, schedule });
    } catch (error) {
      console.error('Set schedule error:', error);
      res.status(500).json({ success: false, message: 'Failed to set schedule' });
    }
  },

  // Admin: Set schedules for next 7 days at once
  async setWeekSchedules(req, res) {
    try {
      const { schedules } = req.body;

      if (!schedules || !Array.isArray(schedules)) {
        return res.status(400).json({ success: false, message: 'Schedules array is required' });
      }

      const results = [];

      for (const item of schedules) {
        const scheduleDate = new Date(item.date);
        scheduleDate.setHours(0, 0, 0, 0);

        const schedule = await DailySchedule.findOneAndUpdate(
          { date: scheduleDate },
          { date: scheduleDate, location: item.location, isActive: true },
          { upsert: true, new: true }
        );

        results.push(schedule);
      }

      res.json({ success: true, schedules: results });
    } catch (error) {
      console.error('Set week schedules error:', error);
      res.status(500).json({ success: false, message: 'Failed to set schedules' });
    }
  },

  // Admin: Delete a schedule
  async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      await DailySchedule.findByIdAndDelete(id);
      res.json({ success: true, message: 'Schedule deleted' });
    } catch (error) {
      console.error('Delete schedule error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete schedule' });
    }
  }
};

module.exports = scheduleController;
