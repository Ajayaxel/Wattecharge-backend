import { vehicleRepository } from './vehicle.repository.js';
import { APIError } from '../../utils/response.js';

class VehicleService {
  /**
   * Retrieves all vehicles matching filters.
   * @param {Object} filters
   */
  async getVehicles(filters) {
    return await vehicleRepository.findAll(filters);
  }

  /**
   * Retrieves a single vehicle by ID.
   * @param {String} id
   */
  async getVehicleById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new APIError('Vehicle not found.', 404);
    }
    return vehicle;
  }

  /**
   * Creates a new vehicle in the database.
   * @param {Object} vehicleData
   */
  async createVehicle(vehicleData) {
    return await vehicleRepository.create(vehicleData);
  }

  /**
   * Updates an existing vehicle.
   * @param {String} id
   * @param {Object} updateData
   */
  async updateVehicle(id, updateData) {
    const updatedVehicle = await vehicleRepository.updateById(id, updateData);
    if (!updatedVehicle) {
      throw new APIError('Vehicle not found or unauthorized to update.', 404);
    }
    return updatedVehicle;
  }

  /**
   * Deletes a vehicle.
   * @param {String} id
   */
  async deleteVehicle(id) {
    const deletedVehicle = await vehicleRepository.deleteById(id);
    if (!deletedVehicle) {
      throw new APIError('Vehicle not found or unauthorized to delete.', 404);
    }
    return deletedVehicle;
  }
}

export const vehicleService = new VehicleService();
