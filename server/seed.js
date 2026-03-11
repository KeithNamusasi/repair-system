const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electronics-repair-pos');
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      });

      await admin.save();
      console.log('Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

seedAdmin();