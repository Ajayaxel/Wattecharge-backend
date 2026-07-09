import { Brand } from './brand.model.js';
import { logger } from '../../utils/logger.js';

export const seedBrands = async () => {
  try {
    const count = await Brand.countDocuments();
    if (count === 0) {
      logger.info('Brand collection is empty. Seeding bootstrap brands dataset...');
      const seedData = [
        {
          name: 'Tesla',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.svg/1200px-Tesla_logo.svg.png',
        },
        {
          name: 'BMW',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png',
        },
        {
          name: 'BYD',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/BYD_logo.svg/1200px-BYD_logo.svg.png',
        },
        {
          name: 'Volkswagen',
          logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/1200px-Volkswagen_logo_2019.svg.png',
        },
      ];

      await Brand.insertMany(seedData);
      logger.info(`Successfully seeded ${seedData.length} bootstrap brands.`);
    } else {
      logger.info('Brands dataset already loaded. Skipping bootstrap seeding.');
    }
  } catch (error) {
    logger.error(`Failed to execute brand seeding task: ${error.message}`);
  }
};
