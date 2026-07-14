import { UserVehicle } from './userVehicle.model.js';
import { Vehicle } from '../vehicle/vehicle.model.js';
import { sendSuccess } from '../../utils/response.js';
import { APIError } from '../../utils/response.js';

/**
 * Handles HTTP GET requests to retrieve user registered vehicles in their garage.
 */
export const getMyVehicles = async (req, res, next) => {
  try {
    const userVehicles = await UserVehicle.find({ user: req.user._id, isActive: true })
      .populate('vehicle')
      .sort({ createdAt: -1 });

    const serialized = userVehicles.map(uv => {
      if (!uv.vehicle) return null;
      return {
        id: uv._id.toString(),
        vehicleId: uv.vehicle._id.toString(),
        name: `${uv.vehicle.brand} ${uv.vehicle.modelName}`,
        brand: uv.vehicle.brand,
        modelName: uv.vehicle.modelName,
        plate: uv.vehicleNumber,
        chargingPortType: uv.chargingPortType,
        battery: uv.batteryPercent,
        range: uv.rangeKm,
        status: uv.status,
        image: uv.vehicle.imageUrl,
        isLocalImage: false,
      };
    }).filter(Boolean);

    return sendSuccess(res, 'User vehicles retrieved successfully.', serialized, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST requests to register a vehicle to a user's garage.
 */
export const registerUserVehicle = async (req, res, next) => {
  try {
    const { vehicleId, vehicleNumber, chargingPortType } = req.body;

    if (!vehicleId || !vehicleNumber || !chargingPortType) {
      throw new APIError('Vehicle reference, license number and charging port are required.', 400);
    }

    const vehicleExists = await Vehicle.findById(vehicleId);
    if (!vehicleExists || !vehicleExists.isActive) {
      throw new APIError('Selected vehicle model not found.', 404);
    }

    // Check if vehicle number is already registered for this user
    const exists = await UserVehicle.findOne({
      user: req.user._id,
      vehicleNumber: vehicleNumber.trim(),
      isActive: true,
    });
    if (exists) {
      throw new APIError('This vehicle number is already registered in your garage.', 400);
    }

    const userVehicle = await UserVehicle.create({
      user: req.user._id,
      vehicle: vehicleId,
      vehicleNumber: vehicleNumber.trim(),
      chargingPortType: chargingPortType.trim(),
    });

    const populated = await userVehicle.populate('vehicle');

    const serialized = {
      id: populated._id.toString(),
      vehicleId: populated.vehicle._id.toString(),
      name: `${populated.vehicle.brand} ${populated.vehicle.modelName}`,
      brand: populated.vehicle.brand,
      modelName: populated.vehicle.modelName,
      plate: populated.vehicleNumber,
      chargingPortType: populated.chargingPortType,
      battery: populated.batteryPercent,
      range: populated.rangeKm,
      status: populated.status,
      image: populated.vehicle.imageUrl,
      isLocalImage: false,
    };

    return sendSuccess(res, 'Vehicle registered to garage successfully.', serialized, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP DELETE requests to remove a vehicle from a user's garage.
 */
export const removeUserVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userVehicle = await UserVehicle.findOne({ _id: id, user: req.user._id });
    if (!userVehicle) {
      throw new APIError('Vehicle not found in your garage.', 404);
    }

    // Hard delete or soft delete. Let's hard delete for simplicity.
    await UserVehicle.findByIdAndDelete(id);

    return sendSuccess(res, 'Vehicle removed successfully.', null, 200);
  } catch (error) {
    next(error);
  }
};
