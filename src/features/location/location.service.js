import { locationRepository } from './location.repository.js';
import { APIError } from '../../utils/response.js';

class LocationService {
  /**
   * Gets all locations for a user.
   * @param {String} userId 
   */
  async getLocations(userId) {
    return await locationRepository.findByUserId(userId);
  }

  /**
   * Creates a new location for a user.
   * @param {String} userId 
   * @param {Object} locationData 
   */
  async createLocation(userId, locationData) {
    const data = {
      ...locationData,
      user: userId,
    };
    return await locationRepository.create(data);
  }

  /**
   * Updates an existing location for a user.
   * @param {String} id 
   * @param {String} userId 
   * @param {Object} updateData 
   */
  async updateLocation(id, userId, updateData) {
    const updatedLocation = await locationRepository.updateByIdAndUser(id, userId, updateData);
    if (!updatedLocation) {
      throw new APIError('Location not found or unauthorized to update.', 404);
    }
    return updatedLocation;
  }

  /**
   * Soft deletes a location for a user.
   * @param {String} id 
   * @param {String} userId 
   */
  async deleteLocation(id, userId) {
    const deletedLocation = await locationRepository.deleteByIdAndUser(id, userId);
    if (!deletedLocation) {
      throw new APIError('Location not found or unauthorized to delete.', 404);
    }
    return deletedLocation;
  }
}

export const locationService = new LocationService();
