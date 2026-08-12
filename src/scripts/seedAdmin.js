import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../features/auth/auth.model.js';

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.mongodbUri);
    console.log('Connected.');

    const email = 'admin@wattcharge.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin already exists! Updating password just in case...');
      existingAdmin.password = 'admin1234';
      await existingAdmin.save();
      console.log('Admin user updated.');
    } else {
      console.log('Creating admin user...');
      const admin = new User({
        name: 'Admin User',
        email: email,
        phoneNumber: '0000000000',
        password: 'admin1234',
        role: 'admin',
      });
      await admin.save();
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedAdmin();
