const mongoose = require('mongoose');

const weeklyScheduleSchema = new mongoose.Schema({
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  location: {
    type: String,
    enum: ['Dundalk', 'Drogheda', 'Dublin'],
    required: true
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Get the Monday of a given date's week
weeklyScheduleSchema.statics.getWeekStart = function(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// Get the Sunday of a given date's week
weeklyScheduleSchema.statics.getWeekEnd = function(date) {
  const weekStart = this.getWeekStart(date);
  const sunday = new Date(weekStart);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
};

module.exports = mongoose.model('WeeklySchedule', weeklyScheduleSchema);
