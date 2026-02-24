const mongoose = require('mongoose');

const dailyScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true,
    enum: ['Dundalk', 'Drogheda', 'Dublin', 'Belfast']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for quick date lookups
dailyScheduleSchema.index({ date: 1 });

// Static method to get schedule for a specific date
dailyScheduleSchema.statics.getScheduleForDate = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await this.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
    isActive: true
  });
};

// Static method to get schedules for next 7 days
dailyScheduleSchema.statics.getUpcomingSchedules = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return await this.find({
    date: { $gte: today, $lt: nextWeek },
    isActive: true
  }).sort({ date: 1 });
};

module.exports = mongoose.model('DailySchedule', dailyScheduleSchema);
