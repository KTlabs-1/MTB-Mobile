const mongoose = require('mongoose');
const DailySchedule = require('../models/DailySchedule');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mtb-mobile';

const locations = ['Dundalk', 'Drogheda', 'Dublin', 'Belfast'];

async function seedDailySchedule() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing daily schedules
    await DailySchedule.deleteMany({});
    console.log('Cleared existing daily schedules');

    // Create schedules for next 7 days
    const schedules = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Rotate through locations (for demo purposes)
      const location = locations[i % locations.length];

      schedules.push({
        date: date,
        location: location,
        isActive: true
      });
    }

    await DailySchedule.insertMany(schedules);

    console.log('Daily schedules seeded:');
    schedules.forEach(s => {
      console.log(`  ${s.date.toDateString()} - ${s.location}`);
    });

    console.log('✅ Daily schedule seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding schedule:', error);
    process.exit(1);
  }
}

seedDailySchedule();
