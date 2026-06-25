import { Location } from './location.model.js';

class LocationRepository {
  /**
   * Retrieves all active locations for a user.
   * @param {String} userId 
   */
  async findByUserId(userId) {
    return await Location.find({ user: userId, isActive: true })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /**
   * Retrieves a single location by ID and User ID.
   * @param {String} id 
   * @param {String} userId 
   */
  async findByIdAndUser(id, userId) {
    return await Location.findOne({ _id: id, user: userId, isActive: true })
      .lean()
      .exec();
  }

  /**
   * Inserts a new location into the DB.
   * @param {Object} locationData 
   */
  async create(locationData) {
    const location = new Location(locationData);
    return await location.save();
  }

  /**
   * Updates a location by ID and User ID.
   * @param {String} id 
   * @param {String} userId 
   * @param {Object} updateData 
   */
  async updateByIdAndUser(id, userId, updateData) {
    return await Location.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).lean().exec();
  }

  /**
   * Soft deletes a location by ID and User ID.
   * @param {String} id 
   * @param {String} userId 
   */
  async deleteByIdAndUser(id, userId) {
    return await Location.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      { isActive: false },
      { new: true }
    ).lean().exec();
  }
}

export const locationRepository = new LocationRepository();
