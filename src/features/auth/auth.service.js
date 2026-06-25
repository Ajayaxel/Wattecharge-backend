import { authRepository } from './auth.repository.js';
import { generateToken } from '../../utils/generateToken.js';
import { APIError } from '../../utils/response.js';
import { sanitizeUser } from '../../utils/helpers.js';
import { emailService } from '../../services/email.service.js';
import { notificationService } from '../../services/notification.service.js';
import { logger } from '../../utils/logger.js';

class AuthService {
  /**
   * Registers a new user.
   * @param {Object} userData 
   */
  async register(userData) {
    const existingUser = await authRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new APIError('A user with this email address already exists.', 400);
    }

    const existingPhone = await authRepository.findByPhoneNumber(userData.phoneNumber);
    if (existingPhone) {
      throw new APIError('A user with this phone number already exists.', 400);
    }

    // Create user in DB
    const user = await authRepository.create(userData);
    
    // Generate auth token
    const token = generateToken({ id: user._id, role: user.role });

    // Send welcome email in background
    emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
      logger.error(`Failed to send welcome email to ${user.email}: ${err.message}`);
    });

    // Send successful signup system notification
    notificationService.sendNotification(
      user._id.toString(),
      'Welcome to Wattcharge!',
      `Hi ${user.name}, your account has been set up successfully.`
    ).catch((err) => {
      logger.error(`Failed to trigger registration notification: ${err.message}`);
    });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
   * Logins an existing user.
   * @param {String} email 
   * @param {String} password 
   */
  async login(email, password) {
    // Fetch user including the selected-out password field
    const user = await authRepository.findByEmail(email, true);
    if (!user) {
      throw new APIError('Invalid email or password.', 401);
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      throw new APIError('Invalid email or password.', 401);
    }

    if (!user.isActive) {
      throw new APIError('Your account has been deactivated. Please contact support.', 403);
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
   * Resolves currently logged in user profile.
   * @param {String} userId 
   */
  async getProfile(userId) {
    const user = await authRepository.findById(userId, true); // Use lean read
    if (!user) {
      throw new APIError('User profile not found.', 404);
    }
    return sanitizeUser(user);
  }

  /**
   * Updates currently logged in user profile.
   * @param {String} userId 
   * @param {Object} updateData 
   */
  async updateProfile(userId, updateData) {
    // If updating email, check for conflicts with other accounts
    if (updateData.email) {
      const existingUser = await authRepository.findByEmail(updateData.email, false, true);
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new APIError('Email is already in use by another account.', 400);
      }
    }

    const updatedUser = await authRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw new APIError('User profile not found.', 404);
    }

    return sanitizeUser(updatedUser);
  }

  /**
   * Logins an admin.
   * @param {String} email 
   * @param {String} password 
   */
  async adminLogin(email, password) {
    const user = await authRepository.findByEmail(email, true);
    if (!user) {
      throw new APIError('Invalid email or password.', 401);
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      throw new APIError('Invalid email or password.', 401);
    }

    if (user.role !== 'admin') {
      throw new APIError('Access denied. Only administrators can access the admin panel.', 403);
    }

    if (!user.isActive) {
      throw new APIError('Your account has been deactivated. Please contact support.', 403);
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: sanitizeUser(user),
      token,
    };
  }

  /**
   * Retrieves all registered users.
   */
  async getAllUsers() {
    const users = await authRepository.findAll();
    return users.map(user => sanitizeUser(user));
  }
}

export const authService = new AuthService();
