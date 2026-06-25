import { authService } from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';

/**
 * Handles HTTP POST User Registration requests.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    const result = await authService.register({ name, email, password, phoneNumber, role });
    return sendSuccess(res, 'User registered successfully.', result, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST User Login requests.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, 'User logged in successfully.', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP GET Authenticated Profile requests.
 */
export const getMe = async (req, res, next) => {
  try {
    const userProfile = await authService.getProfile(req.user._id);
    return sendSuccess(res, 'Profile retrieved successfully.', userProfile, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP PUT Update Profile requests.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateProfile(req.user._id, req.body);
    return sendSuccess(res, 'Profile updated successfully.', updatedUser, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST Logout requests.
 */
export const logout = async (req, res, next) => {
  try {
    // In stateless JWT architecture, the client discards the token.
    return sendSuccess(res, 'User logged out successfully.', null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP POST Admin Login requests.
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.adminLogin(email, password);
    return sendSuccess(res, 'Admin logged in successfully.', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles HTTP GET Users List requests.
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    return sendSuccess(res, 'Users retrieved successfully.', users, 200);
  } catch (error) {
    next(error);
  }
};
