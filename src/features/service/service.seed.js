import { Service } from './service.model.js';
import { logger } from '../../utils/logger.js';

export const seedServices = async () => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      logger.info('Service collection is empty. Seeding bootstrap services dataset...');
      const seedData = [
        {
          name: 'Instant Charge Boost',
          subtitle: 'Mobile charger to your location',
          icon: 'bolt',
          category: 'on_demand',
          isActive: true,
        },
        {
          name: 'Full Charge Slot Booking',
          subtitle: 'Reserve a station & time',
          icon: 'calendar',
          category: 'on_demand',
          isActive: true,
        },
        {
          name: 'Mechanical Issue',
          subtitle: 'On-site diagnostics & repair',
          icon: 'build',
          category: 'roadside',
          isActive: true,
        },
        {
          name: 'Flat Tyre',
          subtitle: 'Tyre fix or replacement',
          icon: 'tyre',
          category: 'roadside',
          isActive: true,
        },
        {
          name: 'Tow / Pickup',
          subtitle: 'Tow to nearest service hub',
          icon: 'tow',
          category: 'roadside',
          isActive: true,
        },
      ];

      await Service.insertMany(seedData);
      logger.info(`Successfully seeded ${seedData.length} bootstrap services.`);
    } else {
      logger.info('Services dataset already loaded. Skipping bootstrap seeding.');
    }
  } catch (error) {
    logger.error(`Failed to execute service seeding task: ${error.message}`);
  }
};
