import { Vehicle } from './vehicle.model.js';

class VehicleRepository {
  /**
   * Retrieves vehicles based on filters.
   * @param {Object} filters
   * @param {String} filters.brand
   * @param {String} filters.type
   * @param {String} filters.search
   */
  async findAll({ brand, type, search }) {
    const query = { isActive: true };

    if (brand && brand.toLowerCase() !== 'all') {
      // Case-insensitive exact match
      query.brand = new RegExp(`^${brand}$`, 'i');
    }

    if (type) {
      // Case-insensitive exact match
      query.type = new RegExp(`^${type}$`, 'i');
    }

    if (search) {
      // Case-insensitive substring match
      query.modelName = new RegExp(search, 'i');
    }

    return await Vehicle.find(query)
      .sort({ brand: 1, modelName: 1 })
      .lean()
      .exec();
  }

  /**
   * Retrieves a single vehicle by ID.
   * @param {String} id
   */
  async findById(id) {
    return await Vehicle.findOne({ _id: id, isActive: true })
      .lean()
      .exec();
  }

  /**
   * Inserts a new vehicle into the DB.
   * @param {Object} vehicleData
   */
  async create(vehicleData) {
    const vehicle = new Vehicle(vehicleData);
    return await vehicle.save();
  }

  /**
   * Updates a vehicle by ID.
   * @param {String} id
   * @param {Object} updateData
   */
  async updateById(id, updateData) {
    return await Vehicle.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).lean().exec();
  }

  /**
   * Soft deletes a vehicle by ID.
   * @param {String} id
   */
  async deleteById(id) {
    return await Vehicle.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    ).lean().exec();
  }
}

export const vehicleRepository = new VehicleRepository();
