require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@mtbcutz.com' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      firstName: 'MTB',
      lastName: 'Admin',
      email: 'admin@mtbcutz.com',
      phone: '+353 85 000 0000',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('\nAdmin user created successfully!');
    console.log('Email: admin@mtbcutz.com');
    console.log('Password: admin123');
    console.log('\nPlease change the password after first login.\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
