import { User } from './auth.model.js';
import { logger } from '../../utils/logger.js';

export const seedAdmin = async () => {
  try {
    const email = 'admin@wattcharge.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      // Ensure role is admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
      }
      logger.info('Admin user already exists in database.');
    } else {
      logger.info('Default admin user not found. Seeding admin account...');
      const admin = new User({
        name: 'Admin User',
        email: email,
        phoneNumber: '0000000000',
        password: 'admin1234',
        role: 'admin',
      });
      await admin.save();
      logger.info('Default admin user created successfully (admin@wattcharge.com / admin1234).');
    }
  } catch (error) {
    logger.error(`Error seeding admin user: ${error.message}`);
  }
};
