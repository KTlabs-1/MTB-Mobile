require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const WeeklySchedule = require('../models/WeeklySchedule');

const seedSchedule = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get this week's Monday
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    // Get this week's Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Get next week's dates
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);

    // Clear existing schedules
    await WeeklySchedule.deleteMany({});
    console.log('Cleared existing schedules');

    // Create this week - Dundalk
    const thisWeek = new WeeklySchedule({
      weekStart: monday,
      weekEnd: sunday,
      location: 'Dundalk',
      isActive: true
    });
    await thisWeek.save();
    console.log(`This week set: Dundalk (${monday.toDateString()} - ${sunday.toDateString()})`);

    // Create next week - Drogheda
    const nextWeek = new WeeklySchedule({
      weekStart: nextMonday,
      weekEnd: nextSunday,
      location: 'Drogheda',
      isActive: true
    });
    await nextWeek.save();
    console.log(`Next week set: Drogheda (${nextMonday.toDateString()} - ${nextSunday.toDateString()})`);

    console.log('\n✅ Schedule seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding schedule:', error);
    process.exit(1);
  }
};

seedSchedule();
