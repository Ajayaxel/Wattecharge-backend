import { Category } from './category.model.js';
import { logger } from '../../utils/logger.js';

export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      logger.info('Category collection is empty. Seeding bootstrap categories dataset...');
      const seedData = [
        {
          name: 'SUV',
          description: 'Sports Utility Vehicle - suitable for rough terrain and families.',
        },
        {
          name: 'Sedan',
          description: 'Standard 4-door passenger car - efficient and comfortable.',
        },
      ];

      await Category.insertMany(seedData);
      logger.info(`Successfully seeded ${seedData.length} bootstrap categories.`);
    } else {
      logger.info('Categories dataset already loaded. Skipping bootstrap seeding.');
    }
  } catch (error) {
    logger.error(`Failed to execute category seeding task: ${error.message}`);
  }
};
