import { User } from './auth.model.js';

class AuthRepository {
  /**
   * Retrieves a user by email address.
   * @param {String} email 
   * @param {Boolean} selectPassword - Whether to fetch password field
   * @param {Boolean} lean - Return plain JS object (critical for scaling reads)
   */
  async findByEmail(email, selectPassword = false, lean = true) {
    const query = User.findOne({ email });
    if (selectPassword) {
      query.select('+password');
    }
    // Cannot be lean if we need to call schema instance methods (like matchPassword)
    if (lean && !selectPassword) {
      query.lean();
    }
    return await query.exec();
  }

  /**
   * Retrieves a user by phone number.
   * @param {String} phoneNumber
   * @param {Boolean} lean - Return plain JS object (critical for scaling reads)
   */
  async findByPhoneNumber(phoneNumber, lean = true) {
    const query = User.findOne({ phoneNumber });
    if (lean) {
      query.lean();
    }
    return await query.exec();
  }

  /**
   * Retrieves a user by Mongo DB Object ID.
   * @param {String} id 
   * @param {Boolean} lean - Return plain JS object (critical for scaling reads)
   */
  async findById(id, lean = true) {
    const query = User.findById(id);
    if (lean) {
      query.lean();
    }
    return await query.exec();
  }

  /**
   * Inserts a new user record into the DB.
   * @param {Object} userData 
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Updates user profile data by ID.
   * @param {String} id 
   * @param {Object} updateData 
   */
  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean().exec();
  }

  /**
   * Retrieves all users.
   * @param {Boolean} lean - Return plain JS objects (critical for scaling reads)
   */
  async findAll(lean = true) {
    const query = User.find({});
    if (lean) {
      query.lean();
    }
    return await query.exec();
  }
}

export const authRepository = new AuthRepository();
