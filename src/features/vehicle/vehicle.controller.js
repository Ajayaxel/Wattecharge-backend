import { vehicleService } from './vehicle.service.js';
import { Brand } from '../brand/brand.model.js';
import { sendSuccess, APIError } from '../../utils/response.js';

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
    let imageUrl = '';
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl && req.body.imageUrl.trim()) {
      imageUrl = req.body.imageUrl.trim();
    } else {
      throw new APIError('Vehicle image file or imageUrl is required.', 400);
    }

    const newVehicle = await vehicleService.createVehicle({
      brand: req.body.brand,
      modelName: req.body.modelName,
      type: req.body.type,
      imageUrl,
    });

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
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updateData = { ...req.body };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedVehicle = await vehicleService.updateVehicle(req.params.id, updateData);
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
    const brands = await Brand.find().sort({ name: 1 });
    const formattedBrands = brands.map(brand => ({
      name: brand.name,
      logoUrl: brand.logoUrl,
    }));
    return sendSuccess(res, 'Brands retrieved successfully.', formattedBrands, 200);
  } catch (error) {
    next(error);
  }
};
