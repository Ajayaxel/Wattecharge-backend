import { vehicleService } from './vehicle.service.js';
import { sendSuccess } from '../../utils/response.js';

/**
 * Handles HTTP GET requests to retrieve vehicles (supports search & filter).
 */
export const getVehicles = async (req, res, next) => {
  try {
    const { brand, type, search } = req.query;
    const vehicles = await vehicleService.getVehicles({ brand, type, search });
    
    // Add custom helper serialization to convert _id to id in responses
    const serializedVehicles = vehicles.map(vehicle => ({
      id: vehicle._id.toString(),
      brand: vehicle.brand,
      modelName: vehicle.modelName,
      imageUrl: vehicle.imageUrl,
      type: vehicle.type,
    }));

    return sendSuccess(res, 'Vehicles retrieved successfully.', serializedVehicles, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP GET requests for a single vehicle by ID.
 */
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    const serializedVehicle = {
      id: vehicle._id.toString(),
      brand: vehicle.brand,
      modelName: vehicle.modelName,
      imageUrl: vehicle.imageUrl,
      type: vehicle.type,
    };
    return sendSuccess(res, 'Vehicle retrieved successfully.', serializedVehicle, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST requests to create a vehicle (Admin privilege required).
 */
export const createVehicle = async (req, res, next) => {
  try {
    const newVehicle = await vehicleService.createVehicle(req.body);
    const serializedVehicle = {
      id: newVehicle._id.toString(),
      brand: newVehicle.brand,
      modelName: newVehicle.modelName,
      imageUrl: newVehicle.imageUrl,
      type: newVehicle.type,
    };
    return sendSuccess(res, 'Vehicle created successfully.', serializedVehicle, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP PUT requests to edit a vehicle (Admin privilege required).
 */
export const updateVehicle = async (req, res, next) => {
  try {
    const updatedVehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    const serializedVehicle = {
      id: updatedVehicle._id.toString(),
      brand: updatedVehicle.brand,
      modelName: updatedVehicle.modelName,
      imageUrl: updatedVehicle.imageUrl,
      type: updatedVehicle.type,
    };
    return sendSuccess(res, 'Vehicle updated successfully.', serializedVehicle, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP DELETE requests to delete a vehicle (Admin privilege required).
 */
export const deleteVehicle = async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    return sendSuccess(res, 'Vehicle deleted successfully.', null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP GET requests to retrieve brand list metadata.
 */
export const getBrands = async (req, res, next) => {
  try {
    const brands = [
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
    return sendSuccess(res, 'Brands retrieved successfully.', brands, 200);
  } catch (error) {
    next(error);
  }
};
