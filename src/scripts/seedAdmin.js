import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { seedAdmin } from '../features/auth/auth.seed.js';

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to MongoDB.');

    await seedAdmin();
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

run();
