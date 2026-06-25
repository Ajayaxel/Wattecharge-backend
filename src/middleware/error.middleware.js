import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

/**
 * Express centralized error handling middleware.
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error details
  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  if (env.nodeEnv === 'development') {
    console.error(err);
  }

  // Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    return sendError(res, 'Validation Error', 400, messages);
  }

  // Mongoose Cast Errors (Invalid ID format)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid path: ${err.path} with value: ${err.value}`, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, `Duplicate field value: ${field}. Please use another value.`, 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired. Please log in again.', 401);
  }

  // Joi schema validation errors (if passed to next() or thrown inside request logic)
  if (err.isJoi) {
    const messages = err.details.map((detail) => detail.message);
    return sendError(res, 'Validation Error', 400, messages);
  }

  // Check if error is custom operational error
  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode);
  }

  // General server/programming errors
  const message = env.nodeEnv === 'production' ? 'An unexpected error occurred on the server' : err.message;
  return sendError(res, message, err.statusCode);
};
