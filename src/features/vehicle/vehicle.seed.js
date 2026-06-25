import { Vehicle } from './vehicle.model.js';
import { logger } from '../../utils/logger.js';

export const seedVehicles = async () => {
  try {
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      logger.info('Vehicle collection is empty. Seeding bootstrap vehicles dataset...');
      const seedData = [
        {
          brand: 'BMW',
          modelName: 'iX Model',
          imageUrl: 'https://pngimg.com/uploads/bmw/bmw_PNG99525.png',
          type: 'SUV',
        },
        {
          brand: 'BMW',
          modelName: 'iX1 Model',
          imageUrl: 'https://pngimg.com/uploads/bmw/bmw_PNG99546.png',
          type: 'SUV',
        },
        {
          brand: 'Tesla',
          modelName: 'Model Y',
          imageUrl: 'https://pngimg.com/uploads/tesla_car/tesla_car_PNG55.png',
          type: 'SUV',
        },
        {
          brand: 'Tesla',
          modelName: 'Model 3',
          imageUrl: 'https://pngimg.com/uploads/tesla_car/tesla_car_PNG11.png',
          type: 'Sedan',
        },
        {
          brand: 'BYD',
          modelName: 'Han EV',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/BYD_Han_EV_front_20210328.png/640px-BYD_Han_EV_front_20210328.png',
          type: 'Sedan',
        },
        {
          brand: 'BYD',
          modelName: 'Tang EV',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/BYD_Tang_II_EV_front_20201017.png/640px-BYD_Tang_II_EV_front_20201017.png',
          type: 'SUV',
        },
        {
          brand: 'Volkswagen',
          modelName: 'ID.4 Pro',
          imageUrl: 'https://pngimg.com/uploads/volkswagen/volkswagen_PNG1815.png',
          type: 'SUV',
        },
        {
          brand: 'Volkswagen',
          modelName: 'ID.3 Pro',
          imageUrl: 'https://pngimg.com/uploads/volkswagen/volkswagen_PNG1820.png',
          type: 'Sedan',
        },
        {
          brand: 'BMW',
          modelName: 'i4 Gran Coupe',
          imageUrl: 'https://pngimg.com/uploads/bmw/bmw_PNG99544.png',
          type: 'Sedan',
        },
      ];

      await Vehicle.insertMany(seedData);
      logger.info(`Successfully seeded ${seedData.length} bootstrap vehicles.`);
    } else {
      logger.info('Vehicles dataset already loaded. Skipping bootstrap seeding.');
    }
  } catch (error) {
    logger.error(`Failed to execute vehicle seeding task: ${error.message}`);
  }
};
